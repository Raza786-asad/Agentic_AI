import numpy as np
import pandas as pd
import os

def generate_dataset(num_samples=100000):
    """
    Generate a realistic synthetic dataset modeling real-world road photo features.
    
    Key insight: Real potholes look VERY different from textbook gray asphalt:
    - Potholes contain water (reflective/bright), gravel (warm tones), mud (brown)
    - Roads have varying lighting, shadows, lane markings, curbs
    - A cracked road has very high edge density but may look similar to asphalt
    - Non-road photos (selfies, indoor, AI art) have high RGB saturation variance
    
    Features extracted from 160x120 pixel analysis:
    - texture_variance: std deviation of pixel brightness (high = rough/cracked)
    - edge_density: rate of sharp brightness transitions (high = cracks/edges)
    - dark_region_ratio: fraction of very dark pixels (deep potholes, shadows)
    - bright_region_ratio: fraction of bright pixels (water reflection, sky)
    - color_saturation_mean: mean color saturation (high = non-road colorful content)
    - gray_consistency: how much of image is uniform neutral gray (true clean asphalt)
    - local_contrast: avg local brightness variance in 8x8 blocks (surface roughness)
    - skin_tone_ratio: estimated fraction of human skin tones (selfie detection)
    - uniform_color_ratio: fraction of very uniform color patches (AI art / indoor)
    """
    np.random.seed(42)
    
    data = []
    samples_per_class = num_samples // 6
    
    # ═══════════════════════════════════════════════════════════
    # CLASS 1: POTHOLE (deep cavity, water pooling, gravel edges)
    # ═══════════════════════════════════════════════════════════
    for _ in range(samples_per_class):
        # Texture: very high — rough broken asphalt edges, gravel, dirt
        texture_variance = np.random.normal(65, 15)
        # Edge density: high — many jagged break lines
        edge_density = np.random.normal(25, 7)
        # Dark regions: HIGH — the deep cavity/hole is very dark
        dark_region_ratio = np.random.normal(22, 8)
        # Bright regions: medium — water pooling reflects light
        bright_region_ratio = np.random.normal(12, 5)
        # Color saturation: LOW (most potholes are gray broken asphalt, occasionally warm mud)
        # Real world: pothole can be pure gray (sat~0) or slightly warm (sat~10-25)
        color_saturation_mean = np.random.choice([
            np.random.normal(2, 2),    # Pure gray asphalt pothole (60% of cases)
            np.random.normal(15, 6),   # Slightly warm with mud/gravel (40% of cases)
        ], p=[0.6, 0.4])
        # Gray consistency: MEDIUM-HIGH — asphalt surrounding the hole
        gray_consistency = np.random.normal(45, 12)
        # Local contrast: HIGH — big difference between dark hole and gray road
        local_contrast = np.random.normal(52, 12)
        # Skin tone: NEAR ZERO
        skin_tone_ratio = np.random.normal(0.3, 0.2)
        # Uniform color: VERY LOW — lots of texture variation
        uniform_color_ratio = np.random.normal(5, 3)
        
        data.append(_clip_and_label(
            texture_variance, edge_density, dark_region_ratio, bright_region_ratio,
            color_saturation_mean, gray_consistency, local_contrast, skin_tone_ratio,
            uniform_color_ratio, defect='Pothole', location='Road'
        ))
    
    # ═══════════════════════════════════════════════════════════
    # CLASS 2: CRACK (surface fracture lines, high edge density)
    # ═══════════════════════════════════════════════════════════
    for _ in range(samples_per_class):
        # Texture: MEDIUM-HIGH — rough but not as broken as pothole
        texture_variance = np.random.normal(50, 12)
        # Edge density: VERY HIGH — thin fracture lines = many sharp transitions
        edge_density = np.random.normal(30, 8)
        # Dark regions: MEDIUM — crack lines appear dark against gray asphalt
        dark_region_ratio = np.random.normal(15, 6)
        # Bright regions: LOW-MEDIUM
        bright_region_ratio = np.random.normal(8, 4)
        # Color saturation: NEAR ZERO — gray asphalt with dark gray cracks
        color_saturation_mean = np.random.choice([
            np.random.normal(1, 1),    # Pure gray cracks (70%)
            np.random.normal(10, 4),   # Slightly warm old asphalt (30%)
        ], p=[0.7, 0.3])
        # Gray consistency: HIGH — lots of gray asphalt visible
        gray_consistency = np.random.normal(55, 10)
        # Local contrast: MEDIUM — cracks create local contrast
        local_contrast = np.random.normal(35, 10)
        # Skin: NONE
        skin_tone_ratio = np.random.normal(0.2, 0.15)
        # Uniform: VERY LOW
        uniform_color_ratio = np.random.normal(4, 2)
        
        data.append(_clip_and_label(
            texture_variance, edge_density, dark_region_ratio, bright_region_ratio,
            color_saturation_mean, gray_consistency, local_contrast, skin_tone_ratio,
            uniform_color_ratio, defect='Crack', location='Road'
        ))
    
    # ═══════════════════════════════════════════════════════════
    # CLASS 3: CLEAN ROAD (no defect, well-maintained asphalt)
    # ═══════════════════════════════════════════════════════════
    for _ in range(samples_per_class):
        # Texture: LOW — smooth uniform surface, HARD CAP at 30
        texture_variance = np.random.normal(18, 6)
        # Edge density: LOW — very few edges (only lane markings)
        edge_density = np.random.normal(7, 3)
        # Dark regions: LOW — uniform gray
        dark_region_ratio = np.random.normal(7, 3)
        # Bright regions: LOW-MEDIUM — lane markings
        bright_region_ratio = np.random.normal(6, 3)
        # Color saturation: NEAR ZERO — clean gray asphalt
        color_saturation_mean = np.random.normal(2, 2)
        # Gray consistency: VERY HIGH — lots of consistent asphalt
        gray_consistency = np.random.normal(70, 8)
        # Local contrast: VERY LOW
        local_contrast = np.random.normal(12, 4)
        # Skin: NONE
        skin_tone_ratio = np.random.normal(0.1, 0.1)
        # Uniform: HIGH — smooth surface with uniform blocks
        uniform_color_ratio = np.random.normal(20, 5)
        
        data.append(_clip_and_label(
            texture_variance, edge_density, dark_region_ratio, bright_region_ratio,
            color_saturation_mean, gray_consistency, local_contrast, skin_tone_ratio,
            uniform_color_ratio, defect='None', location='Road'
        ))
    
    # ═══════════════════════════════════════════════════════════
    # CLASS 4: SELFIE / HUMAN PHOTO (face, portrait, person)
    # ═══════════════════════════════════════════════════════════
    for _ in range(samples_per_class):
        texture_variance = np.random.normal(35, 10)
        edge_density = np.random.normal(15, 5)
        dark_region_ratio = np.random.normal(10, 5)
        bright_region_ratio = np.random.normal(30, 10)
        # Color saturation: HIGH — skin, clothing, background colors
        color_saturation_mean = np.random.normal(45, 12)
        # Gray consistency: VERY LOW — not an asphalt surface
        gray_consistency = np.random.normal(8, 4)
        local_contrast = np.random.normal(28, 8)
        # Skin tone: HIGH — it's a face photo
        skin_tone_ratio = np.random.normal(35, 10)
        # Uniform color: MEDIUM — smooth skin areas
        uniform_color_ratio = np.random.normal(20, 7)
        
        data.append(_clip_and_label(
            texture_variance, edge_density, dark_region_ratio, bright_region_ratio,
            color_saturation_mean, gray_consistency, local_contrast, skin_tone_ratio,
            uniform_color_ratio, defect='None', location='Non-Road'
        ))
    
    # ═══════════════════════════════════════════════════════════
    # CLASS 5: INDOOR / NON-ROAD ENVIRONMENT (room, office, building)
    # ═══════════════════════════════════════════════════════════
    for _ in range(samples_per_class):
        texture_variance = np.random.normal(40, 12)
        edge_density = np.random.normal(20, 7)
        dark_region_ratio = np.random.normal(15, 7)
        bright_region_ratio = np.random.normal(25, 10)
        # Color saturation: HIGH — walls, furniture, decor
        color_saturation_mean = np.random.normal(38, 12)
        # Gray consistency: VERY LOW
        gray_consistency = np.random.normal(10, 5)
        local_contrast = np.random.normal(35, 10)
        skin_tone_ratio = np.random.normal(5, 3)
        # Uniform color: HIGH — walls, floors, ceilings
        uniform_color_ratio = np.random.normal(32, 10)
        
        data.append(_clip_and_label(
            texture_variance, edge_density, dark_region_ratio, bright_region_ratio,
            color_saturation_mean, gray_consistency, local_contrast, skin_tone_ratio,
            uniform_color_ratio, defect='None', location='Non-Road'
        ))
    
    # ═══════════════════════════════════════════════════════════
    # CLASS 6: AI-GENERATED / POSTER / DIGITAL ART (fake image)
    # ═══════════════════════════════════════════════════════════
    for _ in range(samples_per_class):
        texture_variance = np.random.normal(20, 8)
        edge_density = np.random.normal(18, 6)
        dark_region_ratio = np.random.normal(12, 6)
        bright_region_ratio = np.random.normal(20, 8)
        # Color saturation: VERY HIGH — AI art uses vivid, saturated colors
        color_saturation_mean = np.random.normal(60, 15)
        # Gray consistency: VERY LOW — not real asphalt
        gray_consistency = np.random.normal(6, 3)
        local_contrast = np.random.normal(22, 8)
        skin_tone_ratio = np.random.normal(8, 5)
        # Uniform color: VERY HIGH — AI images have large uniform color blocks
        uniform_color_ratio = np.random.normal(45, 12)
        
        data.append(_clip_and_label(
            texture_variance, edge_density, dark_region_ratio, bright_region_ratio,
            color_saturation_mean, gray_consistency, local_contrast, skin_tone_ratio,
            uniform_color_ratio, defect='None', location='Non-Road'
        ))
    
    df = pd.DataFrame(data)
    df = df.sample(frac=1).reset_index(drop=True)
    return df


def _clip_and_label(tv, ed, dr, br, cs, gc, lc, st, uc, defect, location):
    return {
        'texture_variance':     float(np.clip(tv, 0, 100)),
        'edge_density':         float(np.clip(ed, 0, 100)),
        'dark_region_ratio':    float(np.clip(dr, 0, 100)),
        'bright_region_ratio':  float(np.clip(br, 0, 100)),
        'color_saturation_mean':float(np.clip(cs, 0, 100)),
        'gray_consistency':     float(np.clip(gc, 0, 100)),
        'local_contrast':       float(np.clip(lc, 0, 100)),
        'skin_tone_ratio':      float(np.clip(st, 0, 100)),
        'uniform_color_ratio':  float(np.clip(uc, 0, 100)),
        'defect_type':          defect,
        'location_type':        location
    }


if __name__ == '__main__':
    print("Generating 100,000 realistic road defect detection samples...")
    current_dir = os.path.dirname(os.path.abspath(__file__))
    df = generate_dataset(100000)
    data_dir = os.path.join(current_dir, 'data')
    os.makedirs(data_dir, exist_ok=True)
    csv_path = os.path.join(data_dir, 'synthetic_dataset.csv')
    df.to_csv(csv_path, index=False)
    print(f"Dataset saved at {csv_path}. Shape: {df.shape}")
    print(f"\nClass distribution:\n{df['defect_type'].value_counts()}")
    print(f"\nLocation distribution:\n{df['location_type'].value_counts()}")
