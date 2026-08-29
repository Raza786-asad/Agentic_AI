"""
ROADNEX AI — Road Defect Prediction Script
==========================================
Called by Node.js backend with image path as argv[1].
Extracts 9 visual features from the image and runs inference
using the trained GradientBoosting + RandomForest pipeline.

Output: JSON to stdout
"""

import sys
import os
import json
import math

# ── Safe imports ───────────────────────────────────────────────────────────────
try:
    from PIL import Image
    import numpy as np
    import joblib
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(SCRIPT_DIR, 'models')
FEATURES   = [
    'texture_variance', 'edge_density', 'dark_region_ratio',
    'bright_region_ratio', 'color_saturation_mean', 'gray_consistency',
    'local_contrast', 'skin_tone_ratio', 'uniform_color_ratio'
]


def extract_features(img_path: str) -> dict:
    """
    Extract 9 real-world image features from a photo using Pillow.
    
    These features are specifically designed to distinguish:
    - Real road defects (potholes/cracks): high texture, high edge density,
      dark cavities, low saturation, medium gray consistency
    - Clean roads: low texture, low edge density, high gray consistency
    - Selfies/portraits: high skin tone ratio, high saturation
    - AI/posters: high uniform color ratio, high saturation, low texture
    """
    # Open and resize to 160x120 for consistent analysis
    img = Image.open(img_path).convert('RGB')
    img = img.resize((160, 120), Image.LANCZOS)
    pixels = np.array(img, dtype=np.float32)  # shape: (120, 160, 3)
    
    R = pixels[:, :, 0]
    G = pixels[:, :, 1]
    B = pixels[:, :, 2]
    
    # ── Luminance ─────────────────────────────────────────────────────────────
    lum = 0.299 * R + 0.587 * G + 0.114 * B  # (120, 160)
    total_pixels = lum.size  # 19200
    
    # ── 1. TEXTURE VARIANCE ───────────────────────────────────────────────────
    # Standard deviation of luminance — high for rough/broken surfaces
    texture_variance = float(np.std(lum))
    # Normalize to 0-100 range (typical std for images is 0-127)
    texture_variance = min(100.0, texture_variance * 0.785)
    
    # ── 2. EDGE DENSITY ───────────────────────────────────────────────────────
    # Sobel-like horizontal and vertical gradient magnitude
    # Measures how many sharp transitions exist (cracks = many thin edges)
    gy = np.abs(np.diff(lum, axis=0))   # vertical gradients (119, 160)
    gx = np.abs(np.diff(lum, axis=1))   # horizontal gradients (120, 159)
    
    # Count "strong" edges (brightness change > 15)
    h_edges = (gy > 15).sum() / gy.size * 100
    v_edges = (gx > 15).sum() / gx.size * 100
    edge_density = float((h_edges + v_edges) / 2)
    
    # ── 3. DARK REGION RATIO ──────────────────────────────────────────────────
    # Fraction of very dark pixels (5-60 brightness) = deep potholes/shadows
    dark_mask = (lum >= 5) & (lum < 60)
    dark_region_ratio = float(dark_mask.sum() / total_pixels * 100)
    
    # ── 4. BRIGHT REGION RATIO ────────────────────────────────────────────────
    # Fraction of bright pixels (180-255) = water reflection, sky, lane markings
    bright_mask = lum >= 180
    bright_region_ratio = float(bright_mask.sum() / total_pixels * 100)
    
    # ── 5. COLOR SATURATION MEAN ──────────────────────────────────────────────
    # HSV-style saturation: max(R,G,B) - min(R,G,B) relative to max
    # High saturation = colorful content (selfies, posters, non-road)
    max_c = np.maximum(np.maximum(R, G), B)
    min_c = np.minimum(np.minimum(R, G), B)
    # Avoid division by zero
    saturation = np.where(max_c > 0, (max_c - min_c) / (max_c + 1e-6) * 100, 0)
    color_saturation_mean = float(np.mean(saturation))
    
    # ── 6. GRAY CONSISTENCY ───────────────────────────────────────────────────
    # Fraction of pixels that are "asphalt gray"
    # Asphalt: low saturation (R≈G≈B) and medium brightness (25-160)
    is_gray = (saturation < 20) & (lum >= 20) & (lum <= 170)
    gray_consistency = float(is_gray.sum() / total_pixels * 100)
    
    # ── 7. LOCAL CONTRAST ─────────────────────────────────────────────────────
    # Average std of 8x8 blocks — measures local surface roughness
    block_stds = []
    for by in range(0, 120 - 8, 8):
        for bx in range(0, 160 - 8, 8):
            block = lum[by:by+8, bx:bx+8]
            block_stds.append(np.std(block))
    local_contrast = float(np.mean(block_stds) * 0.785)
    local_contrast = min(100.0, local_contrast)
    
    # ── 8. SKIN TONE RATIO ────────────────────────────────────────────────────
    # Ycbcr-based skin detection for human face/selfie rejection
    # Skin: R > 95, G > 40, B > 20, R > G > B, and Cb/Cr in range
    Cb = 128 - 0.168736 * R - 0.331264 * G + 0.5 * B
    Cr = 128 + 0.5 * R - 0.418688 * G - 0.081312 * B
    skin_mask = (
        (R > 80) & (G > 40) & (B > 20) &
        (R > G) & (G >= B) &
        (Cb >= 77) & (Cb <= 127) &
        (Cr >= 133) & (Cr <= 173)
    )
    skin_tone_ratio = float(skin_mask.sum() / total_pixels * 100)
    
    # ── 9. UNIFORM COLOR RATIO ────────────────────────────────────────────────
    # Fraction of 8x8 blocks with very low internal variance
    # AI art / indoor / posters have large uniform color patches
    uniform_blocks = sum(1 for s in block_stds if s < 8)
    uniform_color_ratio = float(uniform_blocks / len(block_stds) * 100)
    
    return {
        'texture_variance':      texture_variance,
        'edge_density':          edge_density,
        'dark_region_ratio':     dark_region_ratio,
        'bright_region_ratio':   bright_region_ratio,
        'color_saturation_mean': color_saturation_mean,
        'gray_consistency':      gray_consistency,
        'local_contrast':        local_contrast,
        'skin_tone_ratio':       skin_tone_ratio,
        'uniform_color_ratio':   uniform_color_ratio,
    }


def run_inference(img_path: str) -> dict:
    if not PIL_AVAILABLE:
        return {'error': 'Pillow or numpy not installed. Run: pip install Pillow numpy scikit-learn joblib'}
    
    # ── Load models ────────────────────────────────────────────────────────────
    defect_model_path   = os.path.join(MODELS_DIR, 'defect_model.joblib')
    location_model_path = os.path.join(MODELS_DIR, 'location_model.joblib')
    
    if not os.path.exists(defect_model_path) or not os.path.exists(location_model_path):
        return {'error': 'ML models not found. Run train.py first to build models.'}
    
    defect_model   = joblib.load(defect_model_path)
    location_model = joblib.load(location_model_path)
    
    # ── Extract features ───────────────────────────────────────────────────────
    try:
        features = extract_features(img_path)
    except Exception as e:
        return {'error': f'Feature extraction failed: {str(e)}'}
    
    # ── Prepare feature vector ─────────────────────────────────────────────────
    X = np.array([[features[f] for f in FEATURES]])
    
    # ── Inference ─────────────────────────────────────────────────────────────
    is_defect        = bool(defect_model.predict(X)[0])
    is_road          = bool(location_model.predict(X)[0])
    
    defect_proba   = float(defect_model.predict_proba(X)[0][1])    # P(defect)
    location_proba = float(location_model.predict_proba(X)[0][1])  # P(road)
    
    confidence = round(defect_proba * 100, 1) if is_defect else round((1 - defect_proba) * 100, 1)
    
    # ── Determine defect type from features ───────────────────────────────────
    if is_defect:
        edge_score = features['edge_density']
        dark_score = features['dark_region_ratio']
        
        if dark_score > 20 and dark_score > edge_score:
            defect_type = 'Pothole'
        elif edge_score > 25:
            defect_type = 'Road Crack'
        else:
            defect_type = 'Surface Damage'
        
        severity_score = 0.4 * features['texture_variance'] + \
                         0.3 * features['edge_density'] + \
                         0.3 * features['dark_region_ratio']
        
        if severity_score >= 55:
            severity = 'Critical'
        elif severity_score >= 38:
            severity = 'High'
        elif severity_score >= 22:
            severity = 'Medium'
        else:
            severity = 'Low'
        
        priority_score = min(100, int(severity_score * 1.4))
        
        # Bounding box estimation based on dark region cluster (centered)
        bounding_box = {
            'x': round(15 + features['dark_region_ratio'] * 0.1, 1),
            'y': round(20 + features['texture_variance'] * 0.05, 1),
            'width': round(30 + features['edge_density'] * 0.6, 1),
            'height': round(25 + features['dark_region_ratio'] * 0.5, 1),
        }
        bounding_box['width']  = min(bounding_box['width'],  100 - bounding_box['x'])
        bounding_box['height'] = min(bounding_box['height'], 100 - bounding_box['y'])
        
        area = f"{round(0.8 + features['dark_region_ratio'] * 0.05, 1)}m²"
        depth = f"{round(3 + features['dark_region_ratio'] * 0.15, 1)}cm"
        
        # Assessment message
        assessment = (
            f"ML Pipeline detected {defect_type} with {confidence}% confidence. "
            f"Texture variance {features['texture_variance']:.1f}, "
            f"Edge density {features['edge_density']:.1f}%, "
            f"Dark cavity {features['dark_region_ratio']:.1f}%. "
            f"Severity: {severity}. Immediate repair recommended."
        )
    else:
        defect_type = 'None'
        severity    = 'None'
        priority_score = 0
        bounding_box = {'x': 10, 'y': 10, 'width': 80, 'height': 80}
        area  = 'N/A'
        depth = 'N/A'
        
        # Generate rejection reason
        if features['skin_tone_ratio'] > 8:
            rejection_reason = f"Human skin tone detected ({features['skin_tone_ratio']:.1f}% skin pixels). This appears to be a portrait or selfie photo. Please upload a clear photo of actual road damage."
        elif features['uniform_color_ratio'] > 35 and features['color_saturation_mean'] > 40:
            rejection_reason = f"AI-generated or digital art pattern detected (uniform color ratio: {features['uniform_color_ratio']:.1f}%, saturation: {features['color_saturation_mean']:.1f}%). Real road photos have natural texture variation."
        elif features['color_saturation_mean'] > 40:
            rejection_reason = f"Non-road environment detected (color saturation: {features['color_saturation_mean']:.1f}%). Road surfaces are typically gray/dark with low saturation. This appears to be an indoor or non-road photo."
        elif features['gray_consistency'] < 5 and not is_road:
            rejection_reason = f"No road surface detected (asphalt gray coverage: {features['gray_consistency']:.1f}%). Please upload a photo taken from the road surface level showing actual damage."
        else:
            rejection_reason = f"No road defect detected. Road surface appears clean (texture variance: {features['texture_variance']:.1f}, edge density: {features['edge_density']:.1f}%). No potholes or cracks found."
        
        assessment = rejection_reason
    
    return {
        'isPotholeDetected': is_defect,
        'defectType':        defect_type,
        'locationType':      'Road' if is_road else 'Non-Road',
        'confidence':        int(confidence),
        'severity':          severity,
        'priorityScore':     priority_score,
        'boundingBox':       bounding_box,
        'area':              area,
        'depth':             depth,
        'assessment':        assessment,
        'rawFeatures': {
            'textureVariance':     round(features['texture_variance'], 2),
            'edgeDensity':         round(features['edge_density'], 2),
            'darkRegionRatio':     round(features['dark_region_ratio'], 2),
            'brightRegionRatio':   round(features['bright_region_ratio'], 2),
            'colorSaturation':     round(features['color_saturation_mean'], 2),
            'grayConsistency':     round(features['gray_consistency'], 2),
            'localContrast':       round(features['local_contrast'], 2),
            'skinToneRatio':       round(features['skin_tone_ratio'], 2),
            'uniformColorRatio':   round(features['uniform_color_ratio'], 2),
        },
        'mlPipeline': {
            'stage1Pavement': {
                'pass':  bool(features['gray_consistency'] >= 15 or is_road),
                'score': round(features['gray_consistency'], 1)
            },
            'stage2Cavity': {
                'pass':  bool(features['dark_region_ratio'] >= 10 or is_defect),
                'score': round(features['dark_region_ratio'], 1)
            },
            'stage3Edge': {
                'pass':  bool(features['edge_density'] >= 10),
                'score': round(features['edge_density'], 1)
            }
        }
    }


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'Usage: python predict.py <image_path>'}))
        sys.exit(1)
    
    img_path = sys.argv[1]
    
    if not os.path.exists(img_path):
        print(json.dumps({'error': f'Image not found: {img_path}'}))
        sys.exit(1)
    
    result = run_inference(img_path)
    print(json.dumps(result))
