-- =====================================================
-- ROADNEX PostgreSQL Schema
-- Run once to create all tables
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USERS TABLE (replaces server/data/users.json)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id            VARCHAR(64)  PRIMARY KEY,
  name          VARCHAR(128) NOT NULL,
  phone         VARCHAR(20)  DEFAULT '',
  email         VARCHAR(255) NOT NULL UNIQUE,
  salt          VARCHAR(64)  DEFAULT NULL,
  password_hash VARCHAR(128) DEFAULT NULL,
  role          VARCHAR(16)  NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_google     BOOLEAN      NOT NULL DEFAULT FALSE,
  google_id     VARCHAR(64)  DEFAULT NULL,
  avatar_url    TEXT         DEFAULT NULL,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- =====================================================
-- 2. REPORTS TABLE (AI-analyzed road defect reports)
-- =====================================================
CREATE TABLE IF NOT EXISTS reports (
  id              VARCHAR(32)    PRIMARY KEY,          -- e.g. RD-1001
  user_id         VARCHAR(64)    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  citizen_name    VARCHAR(128)   NOT NULL,
  defect_type     VARCHAR(128)   NOT NULL DEFAULT 'Pothole',
  severity        VARCHAR(32)    NOT NULL DEFAULT 'Medium',
  confidence      NUMERIC(5,2)   NOT NULL DEFAULT 0,
  priority_score  INT            NOT NULL DEFAULT 0,
  area            VARCHAR(32)    DEFAULT '0 m²',
  depth           VARCHAR(32)    DEFAULT '0 cm',
  waterlogging    VARCHAR(64)    DEFAULT 'N/A',
  location        TEXT           NOT NULL,
  lat             NUMERIC(10,7)  NOT NULL DEFAULT 0,
  lng             NUMERIC(10,7)  NOT NULL DEFAULT 0,
  image_url       TEXT           DEFAULT NULL,         -- path to uploaded image file
  image_filename  VARCHAR(256)   DEFAULT NULL,
  status          VARCHAR(32)    NOT NULL DEFAULT 'Reported',
  ai_assessment   TEXT           DEFAULT NULL,
  is_pothole      BOOLEAN        NOT NULL DEFAULT TRUE,
  state           VARCHAR(64)    DEFAULT NULL,
  district        VARCHAR(64)    DEFAULT NULL,
  city            VARCHAR(64)    DEFAULT NULL,
  created_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_user_id    ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_status     ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_state      ON reports(state);
CREATE INDEX IF NOT EXISTS idx_reports_district   ON reports(district);
CREATE INDEX IF NOT EXISTS idx_reports_city       ON reports(city);
CREATE INDEX IF NOT EXISTS idx_reports_severity   ON reports(severity);

-- =====================================================
-- 3. COMPLAINTS TABLE (citizen complaint filings)
-- =====================================================
CREATE TABLE IF NOT EXISTS complaints (
  id                VARCHAR(32)   PRIMARY KEY,          -- e.g. C-2001
  report_id         VARCHAR(32)   REFERENCES reports(id) ON DELETE SET NULL,
  user_id           VARCHAR(64)   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  citizen_name      VARCHAR(128)  NOT NULL,
  description       TEXT          NOT NULL,
  location          TEXT          NOT NULL,
  image_url         TEXT          DEFAULT NULL,
  status            VARCHAR(64)   NOT NULL DEFAULT 'Reported',
  ai_similarity     NUMERIC(5,2)  DEFAULT 0,
  matched_defect_id VARCHAR(32)   DEFAULT NULL,
  is_merged         BOOLEAN       NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_complaints_user_id    ON complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_report_id  ON complaints(report_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status     ON complaints(status);

-- =====================================================
-- 4. WORK ORDERS TABLE (municipal maintenance dispatch)
-- =====================================================
CREATE TABLE IF NOT EXISTS work_orders (
  id                  VARCHAR(32)   PRIMARY KEY,       -- e.g. WO-1001
  report_id           VARCHAR(32)   REFERENCES reports(id) ON DELETE SET NULL,
  defect_id           VARCHAR(32)   DEFAULT NULL,
  defect_type         VARCHAR(128)  NOT NULL,
  location            TEXT          NOT NULL,
  lat                 NUMERIC(10,7) NOT NULL DEFAULT 0,
  lng                 NUMERIC(10,7) NOT NULL DEFAULT 0,
  severity            VARCHAR(32)   NOT NULL DEFAULT 'Medium',
  priority            VARCHAR(32)   DEFAULT 'High',
  priority_score      INT           DEFAULT 80,
  status              VARCHAR(32)   NOT NULL DEFAULT 'Pending',
  contractor          VARCHAR(128)  DEFAULT 'Unassigned',
  target_completion   VARCHAR(64)   DEFAULT NULL,
  estimated_cost      VARCHAR(64)   DEFAULT '₹0',
  created_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_work_orders_status    ON work_orders(status);
CREATE INDEX IF NOT EXISTS idx_work_orders_report_id ON work_orders(report_id);

-- =====================================================
-- 5. ADMIN ACTION LOG TABLE (audit trail)
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_logs (
  id          SERIAL        PRIMARY KEY,
  admin_id    VARCHAR(64)   NOT NULL,
  action      VARCHAR(128)  NOT NULL,
  target_type VARCHAR(64)   DEFAULT NULL,
  target_id   VARCHAR(64)   DEFAULT NULL,
  details     JSONB         DEFAULT NULL,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 6. SEED DEFAULT CITIZEN USER (idempotent)
-- =====================================================
INSERT INTO users (id, name, phone, email, salt, password_hash, role, is_google, created_at)
VALUES (
  'usr_default_citizen_01',
  'Rahul Sharma',
  '9876543210',
  'citizen@roadguard.org',
  'af1bee31ecc43546483637dbe8a10a2a',
  '4f160e2d321ac091f49c72bd3dbcd7ce82186316accbfa5be94ce6ae868012cc',
  'user',
  FALSE,
  NOW()
)
ON CONFLICT (email) DO NOTHING;
