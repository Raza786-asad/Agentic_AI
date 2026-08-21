import express from 'express';
import crypto from 'crypto';
import * as db from '../services/db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'roadnex_secret_key_123';

// ─── Token Helpers ────────────────────────────────────────────────────────────

function generateToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const expiry  = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const body    = Buffer.from(JSON.stringify({ ...payload, exp: expiry })).toString('base64url');
  const sig     = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${sig}`;
}

function decodeToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, sig] = parts;
    const expected = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
    if (sig !== expected) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

/**
 * Exported Express middleware — verifies Bearer token on every protected route.
 * Attaches req.user = { id, email, role, name } on success.
 */
export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Access token is missing.' });
  }

  const token   = authHeader.split(' ')[1];
  const payload = decodeToken(token);

  if (!payload) {
    return res.status(401).json({ success: false, error: 'Invalid or expired access token.' });
  }

  req.user = payload;
  next();
}

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 */
router.post('/register', async (req, res) => {
  try {
    const { name, phone, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ success: false, error: 'All required fields must be filled.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, error: 'Passwords do not match.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
    }
    if (phone && !/^\+?[0-9]{10,15}$/.test(phone)) {
      return res.status(400).json({ success: false, error: 'Please enter a valid phone number.' });
    }

    const user  = await db.createUser({ name, phone, email, password });
    const token = generateToken({ id: user.id, email: user.email, role: user.role, name: user.name });

    return res.status(201).json({ success: true, message: 'Account created successfully.', user, token });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const user = await db.validateUserPassword(email, password);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role, name: user.name });
    return res.status(200).json({ success: true, user, token });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/auth/google
 */
router.post('/google', async (req, res) => {
  try {
    const { email, name, googleId } = req.body;
    if (!email || !name) {
      return res.status(400).json({ success: false, error: 'Google login information is incomplete.' });
    }

    const result = await db.createOrUpdateGoogleUser({ email, name, googleId });
    const token  = generateToken({ id: result.user.id, email: result.user.email, role: result.user.role, name: result.user.name });

    return res.status(200).json({ success: true, user: result.user, token, onboardingRequired: result.onboardingRequired });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/auth/google-onboard
 */
router.post('/google-onboard', async (req, res) => {
  try {
    const { userId, phone } = req.body;
    if (!userId || !phone) {
      return res.status(400).json({ success: false, error: 'User ID and phone number are required.' });
    }
    if (!/^\+?[0-9]{10,15}$/.test(phone)) {
      return res.status(400).json({ success: false, error: 'Please enter a valid phone number.' });
    }

    const user  = await db.updateGoogleUserPhone(userId, phone);
    const token = generateToken({ id: user.id, email: user.email, role: user.role, name: user.name });

    return res.status(200).json({ success: true, user, token });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/auth/admin-login
 */
router.post('/admin-login', (req, res) => {
  try {
    const { adminId, password } = req.body;
    const sysId  = process.env.ADMIN_ID       || 'admin@roadguard.gov.in';
    const sysPwd = process.env.ADMIN_PASSWORD || 'admin123';

    if (!adminId || !password) {
      return res.status(400).json({ success: false, error: 'Admin ID and password are required.' });
    }
    if (adminId.toLowerCase() !== sysId.toLowerCase() || password !== sysPwd) {
      return res.status(401).json({ success: false, error: 'Invalid admin credentials.' });
    }

    const adminUser = { id: 'admin_01', name: 'Cmdr. A. Mehta', title: 'Chief Urban Engineer', email: sysId, role: 'admin' };
    const token     = generateToken({ id: adminUser.id, email: adminUser.email, role: adminUser.role, name: adminUser.name });

    return res.status(200).json({ success: true, user: adminUser, token });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/auth/verify
 */
router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Access token is missing.' });
    }

    const token   = authHeader.split(' ')[1];
    const payload = decodeToken(token);
    if (!payload) {
      return res.status(401).json({ success: false, error: 'Invalid or expired access token.' });
    }

    if (payload.role === 'admin') {
      const sysId = process.env.ADMIN_ID || 'admin@roadguard.gov.in';
      return res.status(200).json({
        success: true,
        user: { id: 'admin_01', name: 'Cmdr. A. Mehta', title: 'Chief Urban Engineer', email: sysId, role: 'admin' }
      });
    }

    // Look up citizen from PostgreSQL
    const user = await db.findUserById(payload.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User account not found.' });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
