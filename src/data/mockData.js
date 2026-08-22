/**
 * RoadGuard AI - Mock Dataset
 * Urban Road Infrastructure & Smart City GIS Data
 */

export const INITIAL_DEFECTS = [
  {
    id: "RD-1042",
    location: "Main Road (Km 4.2), Sector 18",
    type: "Pothole",
    severity: "Critical",
    confidence: 96,
    area: "2.4 m²",
    depth: "12 cm",
    complaints: 14,
    waterlogging: true,
    priorityScore: 94,
    lat: 28.5708,
    lng: 77.3261,
    reportedDate: "2026-08-19",
    status: "Pending",
    state: "Karnataka",
    district: "Bengaluru Urban",
    city: "Bengaluru"
  },
  {
    id: "RD-1088",
    location: "Outer Ring Road, Flyover Junction",
    type: "Deep Structural Crack",
    severity: "Critical",
    confidence: 94,
    area: "5.1 m²",
    depth: "8 cm",
    complaints: 19,
    waterlogging: true,
    priorityScore: 91,
    lat: 28.5480,
    lng: 77.2510,
    reportedDate: "2026-08-18",
    status: "Assigned",
    state: "Delhi",
    district: "South East Delhi",
    city: "New Delhi"
  },
  {
    id: "RD-1015",
    location: "MG Road, Near Metro Station Gate 2",
    type: "Manhole Subsidence",
    severity: "High",
    confidence: 92,
    area: "1.8 m²",
    depth: "15 cm",
    complaints: 9,
    waterlogging: false,
    priorityScore: 82,
    lat: 28.4795,
    lng: 77.0800,
    reportedDate: "2026-08-20",
    status: "In Progress",
    state: "Karnataka",
    district: "Bengaluru Urban",
    city: "Bengaluru"
  },
  {
    id: "RD-1033",
    location: "Connaught Place, Inner Circle Block B",
    type: "Surface Ravelling",
    severity: "Medium",
    confidence: 88,
    area: "3.6 m²",
    depth: "4 cm",
    complaints: 5,
    waterlogging: false,
    priorityScore: 65,
    lat: 28.6328,
    lng: 77.2197,
    reportedDate: "2026-08-15",
    status: "Pending",
    state: "Delhi",
    district: "New Delhi",
    city: "New Delhi"
  },
  {
    id: "RD-1050",
    location: "Cyber City Phase 2, Near Tech Park",
    type: "Waterlogging Pothole",
    severity: "Critical",
    confidence: 98,
    area: "3.1 m²",
    depth: "14 cm",
    complaints: 22,
    waterlogging: true,
    priorityScore: 96,
    lat: 28.4950,
    lng: 77.0890,
    reportedDate: "2026-08-21",
    status: "Pending",
    state: "Haryana",
    district: "Gurugram",
    city: "Gurugram"
  },
  {
    id: "RD-1072",
    location: "Park Street Corridor, Sector 4",
    type: "Edge Breakage",
    severity: "Low",
    confidence: 85,
    area: "1.2 m²",
    depth: "3 cm",
    complaints: 2,
    waterlogging: false,
    priorityScore: 42,
    lat: 28.6100,
    lng: 77.3000,
    reportedDate: "2026-08-10",
    status: "Completed",
    state: "Karnataka",
    district: "Bengaluru Urban",
    city: "Bengaluru"
  },
  {
    id: "RD-1099",
    location: "National Highway 48 Exit Ramp",
    type: "Alligator Cracking Cluster",
    severity: "High",
    confidence: 91,
    area: "8.4 m²",
    depth: "6 cm",
    complaints: 11,
    waterlogging: true,
    priorityScore: 84,
    lat: 28.4500,
    lng: 77.0200,
    reportedDate: "2026-08-17",
    status: "In Progress",
    state: "Karnataka",
    district: "Bengaluru Urban",
    city: "Bengaluru"
  },
];

export const INITIAL_COMPLAINTS = [
  {
    id: "C-2041",
    citizenName: "Rahul Sharma",
    location: "Main Road (Km 4.2), Sector 18",
    image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=500&auto=format&fit=crop&q=60",
    date: "2026-08-21 09:14 AM",
    description: "Huge pothole filled with water near Sector 18 metro pillar 42. Extremely dangerous for two-wheelers.",
    aiSimilarity: 93,
    matchedDefectId: "RD-1042",
    status: "Duplicate (93% Match)"
  },
  {
    id: "C-2042",
    citizenName: "Priya Nair",
    location: "Outer Ring Road Flyover",
    image: "https://images.unsplash.com/photo-1584463699966-1c70e303768a?w=500&auto=format&fit=crop&q=60",
    date: "2026-08-21 10:05 AM",
    description: "Deep structural crack spreading across two lanes on outer ring road exit.",
    aiSimilarity: 89,
    matchedDefectId: "RD-1088",
    status: "Duplicate (89% Match)"
  },
  {
    id: "C-2043",
    citizenName: "Amit Kumar",
    location: "MG Road Commercial Corridor",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&auto=format&fit=crop&q=60",
    date: "2026-08-20 04:45 PM",
    description: "Sunken manhole cover causing traffic bottleneck during peak hours.",
    aiSimilarity: 95,
    matchedDefectId: "RD-1015",
    status: "Duplicate (95% Match)"
  },
  {
    id: "C-2044",
    citizenName: "Sanjay Patel",
    location: "Expressway Service Lane Sector 62",
    image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=500&auto=format&fit=crop&q=60",
    date: "2026-08-21 11:00 AM",
    description: "Fresh road surface cave-in after heavy rain morning storm.",
    aiSimilarity: 41,
    matchedDefectId: null,
    status: "Unique New Report"
  }
];

export const INITIAL_WORK_ORDERS = [
  {
    id: "WO-1042",
    defectId: "RD-1042",
    location: "Main Road (Km 4.2), Sector 18",
    defectType: "Pothole Filling & Drainage Seal",
    priority: "Critical",
    priorityScore: 94,
    contractor: "ABC Infrastructure Ltd.",
    assignedDate: "2026-08-20",
    targetCompletion: "2026-08-24",
    status: "Pending",
    estimatedCost: "₹45,000",
    waterloggingRisk: "High"
  },
  {
    id: "WO-1088",
    defectId: "RD-1088",
    location: "Outer Ring Road, Flyover Junction",
    defectType: "Structural Slab Overlay & Crack Infill",
    priority: "Critical",
    priorityScore: 91,
    contractor: "Apex Roadways Corp.",
    assignedDate: "2026-08-19",
    targetCompletion: "2026-08-23",
    status: "Assigned",
    estimatedCost: "₹1,20,000",
    waterloggingRisk: "High"
  },
  {
    id: "WO-1015",
    defectId: "RD-1015",
    location: "MG Road, Near Metro Station Gate 2",
    defectType: "Manhole Frame Leveling & Asphalt Patch",
    priority: "High",
    priorityScore: 82,
    contractor: "Urban Infra Works",
    assignedDate: "2026-08-18",
    targetCompletion: "2026-08-22",
    status: "In Progress",
    estimatedCost: "₹28,000",
    waterloggingRisk: "Medium"
  },
  {
    id: "WO-1072",
    defectId: "RD-1072",
    location: "Park Street Corridor, Sector 4",
    defectType: "Shoulder Edge Repair",
    priority: "Low",
    priorityScore: 42,
    contractor: "City Municipal Team B",
    assignedDate: "2026-08-10",
    targetCompletion: "2026-08-14",
    status: "Completed",
    estimatedCost: "₹12,500",
    waterloggingRisk: "Low"
  }
];

export const WATERLOGGING_RAINFALL_DATA = [
  { month: 'Mar', rainfall: 12, hotspots: 4, defects: 45 },
  { month: 'Apr', rainfall: 28, hotspots: 9, defects: 62 },
  { month: 'May', rainfall: 65, hotspots: 18, defects: 98 },
  { month: 'Jun', rainfall: 140, hotspots: 28, defects: 164 },
  { month: 'Jul', rainfall: 210, hotspots: 38, defects: 220 },
  { month: 'Aug', rainfall: 185, hotspots: 34, defects: 238 },
];

export const DEFECTS_BY_TYPE_DATA = [
  { name: 'Potholes', value: 112, color: '#ef4444' },
  { name: 'Structural Cracks', value: 58, color: '#f97316' },
  { name: 'Waterlogging Damage', value: 42, color: '#06b6d4' },
  { name: 'Manhole Subsidence', value: 26, color: '#eab308' },
];

export const SEVERITY_DISTRIBUTION_DATA = [
  { name: 'Critical', count: 19, color: '#ef4444' },
  { name: 'High', count: 48, color: '#f97316' },
  { name: 'Medium', count: 96, color: '#eab308' },
  { name: 'Low', count: 75, color: '#10b981' },
];
