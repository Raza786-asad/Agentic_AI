import express from 'express';
import crypto from 'crypto';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';
import * as db from '../services/db.js';

try {
  admin.initializeApp();
} catch (e) {
  console.log('Firebase admin initialization issue:', e.message);
}

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

// Store admin details in memory since admin is not DB-backed
let adminAvatarUrl = null;
let adminName = 'Md. Asad Raza';
let adminPhone = '+91 9102510563';
let adminAddress = 'Vadlamudi,Guntur-522213';

// ─── Automated WhatsApp API Simulation ──────────────────────────────────────────
async function sendWhatsAppWelcomeMessage(phone, name) {
  if (!phone || phone.trim() === '') return;
  
  // Format to standard E.164 (e.g. +91XXXXXXXXXX)
  let cleanPhone = phone.replace(/[^0-9]/g, '');
  if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;
  
  const message = `Hello ${name}, welcome to RoadGuard Smart City Platform! 🛣️\nYour account has been successfully registered. You can now report road defects and help improve city infrastructure.`;

  console.log(`[WhatsApp API Mock] Sending message from Admin to +${cleanPhone}: "${message}"`);
  
  // Note: For real production use, you would integrate Twilio or Meta WhatsApp Cloud API here:
  /*
  const twilio = require('twilio');
  const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
  await client.messages.create({
    body: message,
    from: 'whatsapp:+14155238886', // Admin Twilio Number
    to: `whatsapp:+${cleanPhone}`
  });
  */
}

/**
 * POST /api/auth/register
 */
router.post('/register', async (req, res) => {
  try {
    const { name, phone, email, password, confirmPassword, role } = req.body;

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

    const registrationRole = (role === 'municipal' || role === 'user') ? role : 'user';

    const user  = await db.createUser({ name, phone, email, password, role: registrationRole });
    const token = generateToken({ id: user.id, email: user.email, role: user.role, name: user.name });

    // Send automated WhatsApp message
    if (phone) {
      sendWhatsAppWelcomeMessage(phone, name).catch(err => console.error('WhatsApp sending failed:', err));
    }

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
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, error: 'Firebase token is missing.' });
    }

    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (err) {
      return res.status(401).json({ success: false, error: 'Invalid Firebase token.' });
    }

    const { email, name, uid: googleId } = decodedToken;
    const result = await db.createOrUpdateGoogleUser({ email, name: name || 'Google User', googleId });
    const jwtToken = generateToken({ id: result.user.id, email: result.user.email, role: result.user.role, name: result.user.name });

    return res.status(200).json({ success: true, user: result.user, token: jwtToken, onboardingRequired: result.onboardingRequired });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/auth/google-municipal
 * Google login for Municipal Staff — email must already exist with role='municipal'.
 */
router.post('/google-municipal', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, error: 'Firebase token is missing.' });
    }

    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (err) {
      return res.status(401).json({ success: false, error: 'Invalid Firebase token.' });
    }

    const { email } = decodedToken;

    // Look up the user by email in the database
    const user = await db.findUserByEmail(email);

    if (!user) {
      return res.status(403).json({ success: false, error: 'No registered municipal staff account found for this Google account. Please register first.' });
    }
    if (user.role !== 'municipal') {
      return res.status(403).json({ success: false, error: 'This Google account is not associated with a Municipal Staff account. Use the Citizen Portal instead.' });
    }

    const jwtToken = generateToken({ id: user.id, email: user.email, role: user.role, name: user.name });
    return res.status(200).json({ success: true, user, token: jwtToken });
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

    const adminUser = { 
      id: 'admin_01', 
      name: adminName, 
      title: 'Chief Urban Engineer', 
      email: sysId, 
      phone: adminPhone,
      address: adminAddress,
      role: 'admin', 
      avatarUrl: adminAvatarUrl 
    };
    const token     = generateToken({ id: adminUser.id, email: adminUser.email, role: adminUser.role, name: adminUser.name });

    return res.status(200).json({ success: true, user: adminUser, token });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/auth/municipal-staff
 * Returns all registered municipal staff members (plus fallback if none registered yet).
 */
router.get('/municipal-staff', verifyToken, async (req, res) => {
  try {
    const staff = await db.getMunicipalStaff();
    
    // Default fallback municipal staff members if none in DB so admin can test calling & assigning
    const fallbackStaff = [
      { id: 'muni_01', name: 'Vikram Singh', phone: '+91 98765 43210', email: 'vikram.municipal@roadguard.gov.in', role: 'municipal', department: 'Pothole Repair Crew Alpha' },
      { id: 'muni_02', name: 'Rajesh Sharma', phone: '+91 91025 10563', email: 'rajesh.municipal@roadguard.gov.in', role: 'municipal', department: 'Rapid Asphalt Unit Bravo' },
      { id: 'muni_03', name: 'Anjali Verma', phone: '+91 94733 28088', email: 'anjali.municipal@roadguard.gov.in', role: 'municipal', department: 'Heavy Road Maintenance Division' }
    ];

    const combined = [...staff];
    fallbackStaff.forEach(fb => {
      if (!combined.some(s => s.email === fb.email || (s.phone && fb.phone && s.phone.replace(/\D/g,'') === fb.phone.replace(/\D/g,'')))) {
        combined.push(fb);
      }
    });

    return res.status(200).json({ success: true, staff: combined });
  } catch (error) {
    console.error('[Municipal Staff GET Error]', error);
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
        user: { 
          id: 'admin_01', 
          name: adminName, 
          title: 'Chief Urban Engineer', 
          email: sysId, 
          phone: adminPhone,
          address: adminAddress,
          role: 'admin', 
          avatarUrl: adminAvatarUrl 
        }
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

/**
 * PATCH /api/auth/profile
 * Updates user profile details
 */
router.patch('/profile', verifyToken, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    if (req.user.role === 'admin') {
      adminName = name || adminName;
      adminPhone = phone || adminPhone;
      adminAddress = address || adminAddress;
      const sysId = process.env.ADMIN_ID || 'vu.241fa04475@gmail.com';
      const updatedAdmin = { 
        id: 'admin_01', 
        name: adminName, 
        title: 'Chief Urban Engineer', 
        email: sysId, 
        phone: adminPhone,
        address: adminAddress,
        role: 'admin',
        avatarUrl: adminAvatarUrl
      };
      return res.status(200).json({ success: true, user: updatedAdmin });
    }

    const updatedUser = await db.updateUserProfile(req.user.id, { name, phone, address });
    return res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/auth/profile-photo
 * Uploads a profile photo for the current user.
 * Body: multipart form-data { photo: <file> }
 */
const __authFilename = fileURLToPath(import.meta.url);
const __authDirname  = path.dirname(__authFilename);

const avatarStorage = multer.diskStorage({
  destination(req, file, cb) {
    const uploadsDir = path.join(__authDirname, '../../server/uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    cb(null, uploadsDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname) || '.jpg';
    const safeName = `avatar_${Date.now()}_${Math.random().toString(36).slice(2, 8)}${ext}`;
    cb(null, safeName);
  }
});

const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter(req, file, cb) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    cb(null, allowed.includes(file.mimetype));
  }
});

router.post('/profile-photo', verifyToken, avatarUpload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No photo file received.' });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;

    if (req.user.role === 'admin') {
      // Admin is not DB-backed, return URL for client-side persistence
      adminAvatarUrl = avatarUrl;
      return res.status(200).json({ success: true, avatarUrl });
    }

    const updatedUser = await db.updateUserAvatar(req.user.id, avatarUrl);
    return res.status(200).json({ success: true, user: updatedUser, avatarUrl });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/auth/profile-photo
 * Removes the profile photo for the current user.
 */
router.delete('/profile-photo', verifyToken, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      adminAvatarUrl = null;
      return res.status(200).json({ success: true, avatarUrl: null });
    }

    const updatedUser = await db.updateUserAvatar(req.user.id, null);
    return res.status(200).json({ success: true, user: updatedUser, avatarUrl: null });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
