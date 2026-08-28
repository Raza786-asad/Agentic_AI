/**
 * RoadGuard AI - Mock Dataset
 * Urban Road Infrastructure & Smart City GIS Data
 */

export const INITIAL_DEFECTS = [];

export const INITIAL_COMPLAINTS = [];

export const INITIAL_WORK_ORDERS = [];

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
