/**
 * User persistence layer — now backed by PostgreSQL
 * Replaces the old JSON-file storage with pg queries.
 * Exported API is identical so auth.js requires no changes.
 */
import crypto from 'crypto';
import pool from '../config/db.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hashPassword(password, salt) {
  return crypto.createHmac('sha256', salt).update(password).digest('hex');
}

function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

/** Strip sensitive fields before returning to caller */
function sanitize(row) {
  if (!row) return null;
  const { salt, password_hash, ...safe } = row;
  // Normalise snake_case → camelCase for frontend compatibility
  return {
    id:         safe.id,
    name:       safe.name,
    phone:      safe.phone,
    email:      safe.email,
    role:       safe.role,
    isGoogle:   safe.is_google,
    googleId:   safe.google_id ?? undefined,
    avatarUrl:  safe.avatar_url ?? undefined,
    createdAt:  safe.created_at,
  };
}

// ─── User CRUD ────────────────────────────────────────────────────────────────

/**
 * Create a new user with email/password authentication.
 * Throws if email or phone is already registered.
 */
export async function createUser({ name, phone, email, password }) {
  const emailLower = email.toLowerCase();

  // Unique email check
  const emailCheck = await pool.query(
    'SELECT id FROM users WHERE LOWER(email) = $1',
    [emailLower]
  );
  if (emailCheck.rowCount > 0) throw new Error('Email address already registered.');

  // Unique phone check (only if phone provided)
  if (phone) {
    const phoneCheck = await pool.query(
      'SELECT id FROM users WHERE phone = $1',
      [phone]
    );
    if (phoneCheck.rowCount > 0) throw new Error('Phone number already registered.');
  }

  const id   = 'usr_' + crypto.randomUUID();
  const salt = generateSalt();
  const hash = hashPassword(password, salt);

  const { rows } = await pool.query(
    `INSERT INTO users (id, name, phone, email, salt, password_hash, role, is_google)
     VALUES ($1,$2,$3,$4,$5,$6,'user',FALSE)
     RETURNING *`,
    [id, name, phone || '', emailLower, salt, hash]
  );

  return sanitize(rows[0]);
}

/**
 * Validate email+password, return sanitized user or null.
 */
export async function validateUserPassword(email, password) {
  const { rows } = await pool.query(
    'SELECT * FROM users WHERE LOWER(email) = $1 AND is_google = FALSE',
    [email.toLowerCase()]
  );
  if (rows.length === 0) return null;

  const user = rows[0];
  const check = hashPassword(password, user.salt);
  if (check !== user.password_hash) return null;

  return sanitize(user);
}

/**
 * Find user by ID (used during JWT verify flow).
 */
export async function findUserById(id) {
  const { rows } = await pool.query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );
  return rows.length ? sanitize(rows[0]) : null;
}

/**
 * Google OAuth — create or retrieve a user by email/googleId.
 */
export async function createOrUpdateGoogleUser({ email, name, googleId }) {
  const emailLower = email.toLowerCase();

  const existing = await pool.query(
    'SELECT * FROM users WHERE LOWER(email) = $1',
    [emailLower]
  );

  let user;
  if (existing.rowCount > 0) {
    user = existing.rows[0];
  } else {
    const id = 'usr_' + crypto.randomUUID();
    const { rows } = await pool.query(
      `INSERT INTO users (id, name, phone, email, role, is_google, google_id)
       VALUES ($1,$2,'',$3,'user',TRUE,$4)
       RETURNING *`,
      [id, name, emailLower, googleId]
    );
    user = rows[0];
  }

  return {
    user: sanitize(user),
    onboardingRequired: !user.phone
  };
}

/**
 * Set phone number for a Google-onboarded user.
 */
export async function updateGoogleUserPhone(userId, phone) {
  // Check uniqueness
  const check = await pool.query(
    'SELECT id FROM users WHERE phone = $1 AND id <> $2',
    [phone, userId]
  );
  if (check.rowCount > 0) throw new Error('Phone number already registered to another account.');

  const { rows } = await pool.query(
    `UPDATE users SET phone = $1 WHERE id = $2 RETURNING *`,
    [phone, userId]
  );
  if (rows.length === 0) throw new Error('User not found.');

  return sanitize(rows[0]);
}

/**
 * Return all users (admin utility — never expose passwords).
 */
export async function getUsers() {
  const { rows } = await pool.query(
    'SELECT * FROM users ORDER BY created_at DESC'
  );
  return rows.map(sanitize);
}
