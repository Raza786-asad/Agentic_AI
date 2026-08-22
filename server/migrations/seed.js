import pool from '../config/db.js';

const SEED_DATA = [
  // Delhi
  { state: 'Delhi', district: 'New Delhi', city: 'New Delhi', lat: 28.6139, lng: 77.2090, type: 'Pothole', severity: 'High', status: 'OPEN', complaints: 14 },
  { state: 'Delhi', district: 'South Delhi', city: 'New Delhi', lat: 28.5355, lng: 77.2410, type: 'Waterlogging Pothole', severity: 'Critical', status: 'IN_PROGRESS', complaints: 22 },
  
  // Haryana
  { state: 'Haryana', district: 'Gurugram', city: 'Gurugram', lat: 28.4595, lng: 77.0266, type: 'Structural Crack', severity: 'Medium', status: 'OPEN', complaints: 8 },
  { state: 'Haryana', district: 'Gurugram', city: 'Gurugram', lat: 28.4815, lng: 77.0790, type: 'Manhole Subsidence', severity: 'High', status: 'RESOLVED', complaints: 5 },
  
  // Maharashtra
  { state: 'Maharashtra', district: 'Mumbai Suburban', city: 'Mumbai', lat: 19.0760, lng: 72.8777, type: 'Surface Ravelling', severity: 'Low', status: 'OPEN', complaints: 2 },
  { state: 'Maharashtra', district: 'Pune', city: 'Pune', lat: 18.5204, lng: 73.8567, type: 'Edge Breakage', severity: 'Medium', status: 'IN_PROGRESS', complaints: 11 },
  
  // Karnataka
  { state: 'Karnataka', district: 'Bengaluru Urban', city: 'Bengaluru', lat: 12.9716, lng: 77.5946, type: 'Pothole', severity: 'Critical', status: 'OPEN', complaints: 34 },
  { state: 'Karnataka', district: 'Bengaluru Urban', city: 'Bengaluru', lat: 12.9352, lng: 77.6245, type: 'Waterlogging Pothole', severity: 'High', status: 'RESOLVED', complaints: 19 },
  
  // Tamil Nadu
  { state: 'Tamil Nadu', district: 'Chennai', city: 'Chennai', lat: 13.0827, lng: 80.2707, type: 'Deep Structural Crack', severity: 'Critical', status: 'OPEN', complaints: 27 },
  
  // West Bengal
  { state: 'West Bengal', district: 'Kolkata', city: 'Kolkata', lat: 22.5726, lng: 88.3639, type: 'Manhole Subsidence', severity: 'Medium', status: 'IN_PROGRESS', complaints: 7 },
  
  // Gujarat
  { state: 'Gujarat', district: 'Ahmedabad', city: 'Ahmedabad', lat: 23.0225, lng: 72.5714, type: 'Pothole', severity: 'Low', status: 'RESOLVED', complaints: 3 },
  
  // Rajasthan
  { state: 'Rajasthan', district: 'Jaipur', city: 'Jaipur', lat: 26.9124, lng: 75.7873, type: 'Edge Breakage', severity: 'High', status: 'OPEN', complaints: 12 },
  
  // Uttar Pradesh
  { state: 'Uttar Pradesh', district: 'Gautam Buddha Nagar', city: 'Noida', lat: 28.5355, lng: 77.3910, type: 'Surface Ravelling', severity: 'Medium', status: 'OPEN', complaints: 9 },
  { state: 'Uttar Pradesh', district: 'Lucknow', city: 'Lucknow', lat: 26.8467, lng: 80.9462, type: 'Pothole', severity: 'Low', status: 'RESOLVED', complaints: 1 },
  
  // Bihar
  { state: 'Bihar', district: 'Patna', city: 'Patna', lat: 25.5941, lng: 85.1376, type: 'Waterlogging Pothole', severity: 'High', status: 'IN_PROGRESS', complaints: 15 },
  
  // Madhya Pradesh
  { state: 'Madhya Pradesh', district: 'Bhopal', city: 'Bhopal', lat: 23.2599, lng: 77.4126, type: 'Structural Crack', severity: 'Medium', status: 'OPEN', complaints: 6 },
  
  // Chandigarh
  { state: 'Chandigarh', district: 'Chandigarh', city: 'Chandigarh', lat: 30.7333, lng: 76.7794, type: 'Pothole', severity: 'Low', status: 'RESOLVED', complaints: 2 },
];

async function runSeed() {
  try {
    // 1. Alter table to add columns if they don't exist
    await pool.query(`
      ALTER TABLE reports 
      ADD COLUMN IF NOT EXISTS state VARCHAR(64),
      ADD COLUMN IF NOT EXISTS district VARCHAR(64),
      ADD COLUMN IF NOT EXISTS city VARCHAR(64);
    `);
    
    // 2. Add indexes safely
    const indexes = ['state', 'district', 'city', 'severity'];
    for (const idx of indexes) {
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_reports_${idx} ON reports(${idx});`);
    }

    // 3. Clear old seed data if necessary (optional)
    await pool.query(`DELETE FROM reports WHERE location LIKE 'SEED-%'`);

    // 4. Insert seed data
    for (let i = 0; i < SEED_DATA.length; i++) {
      const data = SEED_DATA[i];
      const id = `RD-SEED-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const priorityScore = data.severity === 'Critical' ? Math.floor(Math.random() * 20) + 80 : 
                            data.severity === 'High' ? Math.floor(Math.random() * 20) + 60 : 
                            data.severity === 'Medium' ? Math.floor(Math.random() * 20) + 40 : 
                            Math.floor(Math.random() * 20) + 20;

      await pool.query(`
        INSERT INTO reports (
          id, user_id, citizen_name, defect_type, severity, priority_score, 
          location, lat, lng, status, state, district, city
        ) VALUES (
          $1, 'usr_default_citizen_01', 'Admin Seeder', $2, $3, $4, 
          $5, $6, $7, $8, $9, $10, $11
        )
      `, [
        id, data.type, data.severity, priorityScore, 
        `SEED-LOC-${data.city}`, data.lat, data.lng, data.status, data.state, data.district, data.city
      ]);
    }
    
    console.log('✅ Seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

runSeed();
