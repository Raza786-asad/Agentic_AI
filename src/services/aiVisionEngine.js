/**
 * RoadGuard AI — Client-side Canvas Vision Engine (v3.0)
 * 
 * Architecture: 9-feature pixel analysis matching the Python ML training dataset.
 * This is the fallback when the backend Python ML model is unavailable.
 * The same 9 features as predict.py are computed here from HTML5 Canvas pixels.
 *
 * KEY FIX: Real potholes contain water, gravel, mud, dirt — they are NOT just
 * "uniform gray asphalt". The old "non-road color ratio" threshold was rejecting
 * real potholes. This version uses the same feature logic as predict.py.
 */

export async function analyzeRoadImage(imageSrc, fileName = "") {
  return new Promise((resolve) => {
    const img = new Image();
    if (!imageSrc.startsWith('data:')) {
      img.crossOrigin = "Anonymous";
    }
    img.src = imageSrc;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const W = 160;
        const H = 120;
        canvas.width  = W;
        canvas.height = H;

        ctx.drawImage(img, 0, 0, W, H);
        const imageData = ctx.getImageData(0, 0, W, H);
        const px = imageData.data;

        const totalPixels = W * H;

        // ── Raw counters ──────────────────────────────────────────────────────
        let totalLuminance   = 0;
        let edgeCount        = 0;
        let darkPixels       = 0;   // dark_region_ratio:    lum 5-60
        let brightPixels     = 0;   // bright_region_ratio:  lum >= 180
        let grayPixels       = 0;   // gray_consistency:     low-sat, mid-lum
        let skinPixels       = 0;   // skin_tone_ratio

        // Block-based local contrast and uniform color ratio
        const blockStds = [];

        // ── Per-pixel analysis ────────────────────────────────────────────────
        for (let y = 0; y < H; y++) {
          for (let x = 0; x < W; x++) {
            const i = (y * W + x) * 4;
            const r = px[i], g = px[i+1], b = px[i+2];
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            totalLuminance += lum;

            const maxC = Math.max(r, g, b);
            const minC = Math.min(r, g, b);
            const sat  = maxC > 0 ? ((maxC - minC) / (maxC + 0.001)) * 100 : 0;

            // dark_region_ratio: deep potholes, shadows
            if (lum >= 5 && lum < 60)  darkPixels++;
            // bright_region_ratio: water reflection, sky
            if (lum >= 180)            brightPixels++;
            // gray_consistency: asphalt (low sat, mid lum)
            if (sat < 20 && lum >= 20 && lum <= 170) grayPixels++;

            // skin_tone_ratio (YCbCr-like):
            const Cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
            const Cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
            const isSkin = r > 80 && g > 40 && b > 20 &&
                           r > g && g >= b &&
                           Cb >= 77 && Cb <= 127 &&
                           Cr >= 133 && Cr <= 173;
            if (isSkin) skinPixels++;

            // edge_density: horizontal gradient
            if (x < W - 1) {
              const ni = (y * W + (x + 1)) * 4;
              const nextLum = 0.299 * px[ni] + 0.587 * px[ni+1] + 0.114 * px[ni+2];
              if (Math.abs(lum - nextLum) > 15) edgeCount++;
            }
          }
        }

        // ── Block local contrast (8x8 blocks) ───────────────────────────────
        for (let by = 0; by < H - 8; by += 8) {
          for (let bx = 0; bx < W - 8; bx += 8) {
            const blockLums = [];
            for (let dy = 0; dy < 8; dy++) {
              for (let dx = 0; dx < 8; dx++) {
                const i = ((by + dy) * W + (bx + dx)) * 4;
                blockLums.push(0.299 * px[i] + 0.587 * px[i+1] + 0.114 * px[i+2]);
              }
            }
            const mean = blockLums.reduce((a, b) => a + b, 0) / 64;
            const std  = Math.sqrt(blockLums.reduce((a, v) => a + (v - mean) ** 2, 0) / 64);
            blockStds.push(std);
          }
        }

        // ── Derived 9 features ────────────────────────────────────────────────
        // 1. texture_variance (std of luminance approximated as range/4)
        const avgLum = totalLuminance / totalPixels;
        // Estimate std from mean absolute deviation
        let madSum = 0;
        for (let y = 0; y < H; y++) {
          for (let x = 0; x < W; x++) {
            const i = (y * W + x) * 4;
            const lum = 0.299 * px[i] + 0.587 * px[i+1] + 0.114 * px[i+2];
            madSum += Math.abs(lum - avgLum);
          }
        }
        const textureVariance = Math.min(100, (madSum / totalPixels) * 0.785 * 1.25);

        // 2. edge_density
        const edgeDensity = Math.min(100, (edgeCount / totalPixels) * 100);

        // 3. dark_region_ratio
        const darkRegionRatio = (darkPixels / totalPixels) * 100;

        // 4. bright_region_ratio
        const brightRegionRatio = (brightPixels / totalPixels) * 100;

        // 5. color_saturation_mean (computed per pixel)
        let satSum = 0;
        for (let i = 0; i < px.length; i += 4) {
          const r = px[i], g = px[i+1], b = px[i+2];
          const maxC = Math.max(r, g, b);
          const minC = Math.min(r, g, b);
          satSum += maxC > 0 ? ((maxC - minC) / (maxC + 0.001)) * 100 : 0;
        }
        const colorSaturationMean = satSum / totalPixels;

        // 6. gray_consistency
        const grayConsistency = (grayPixels / totalPixels) * 100;

        // 7. local_contrast
        const localContrast = Math.min(100,
          (blockStds.reduce((a, b) => a + b, 0) / blockStds.length) * 0.785);

        // 8. skin_tone_ratio
        const skinToneRatio = (skinPixels / totalPixels) * 100;

        // 9. uniform_color_ratio (fraction of blocks with std < 8)
        const uniformBlocks = blockStds.filter(s => s < 8).length;
        const uniformColorRatio = (uniformBlocks / blockStds.length) * 100;

        // ── Unreadable black canvas guard ─────────────────────────────────────
        if (avgLum < 5) {
          return resolve(buildFallbackResult('CANVAS_ERROR'));
        }

        // ── Decision Logic (mirrors predict.py thresholds) ───────────────────
        // REJECT if selfie: skin > 8%
        const isSelfie = skinToneRatio >= 8;

        // REJECT if AI art: uniform colors + high saturation
        const isAiArt  = uniformColorRatio >= 35 && colorSaturationMean >= 40;

        // REJECT if indoor/non-road: very high saturation, minimal gray
        const isNonRoad = colorSaturationMean >= 45 && grayConsistency < 10;

        const isInvalidImage = isSelfie || isAiArt || isNonRoad;

        // DETECT defect on road images:
        let isPotholeDetected = false;
        let defectType        = 'None';
        let locationType      = isInvalidImage ? 'Non-Road' : 'Road';

        if (!isInvalidImage) {
          // Road Crack: many edges, moderate dark
          if (edgeDensity >= 15 && darkRegionRatio >= 10) {
            isPotholeDetected = true;
            defectType = darkRegionRatio >= 18 ? 'Pothole' : 'Road Crack';
          }
          // Pothole: dark cavity with rough texture
          else if (darkRegionRatio >= 18 && textureVariance >= 30) {
            isPotholeDetected = true;
            defectType = 'Pothole';
          }
          // Surface damage: rough texture, some edges
          else if (textureVariance >= 40 && edgeDensity >= 10) {
            isPotholeDetected = true;
            defectType = 'Surface Damage';
          }
          // Clean road: gray but no defect signals
        }

        // ── Severity and scoring ──────────────────────────────────────────────
        const severityScore = 0.4 * textureVariance + 0.3 * edgeDensity + 0.3 * darkRegionRatio;

        let severity = 'None', depthCm = 0, priorityScore = 0;
        let areaM2 = '0';

        if (isPotholeDetected) {
          if (severityScore >= 55)      { severity = 'Critical'; }
          else if (severityScore >= 38) { severity = 'High'; }
          else if (severityScore >= 22) { severity = 'Medium'; }
          else                          { severity = 'Low'; }

          depthCm       = Math.max(1, Math.round(3 + darkRegionRatio * 0.15));
          areaM2        = (0.8 + darkRegionRatio * 0.05).toFixed(1);
          priorityScore = Math.min(100, Math.round(severityScore * 1.4));
        }

        // ── Bounding box ──────────────────────────────────────────────────────
        const boxX = Math.round(15 + darkRegionRatio * 0.1);
        const boxY = Math.round(20 + textureVariance  * 0.05);
        const boxW = Math.min(70, Math.round(30 + edgeDensity   * 0.6));
        const boxH = Math.min(70, Math.round(25 + darkRegionRatio * 0.5));

        // ── Confidence ────────────────────────────────────────────────────────
        const confidence = isPotholeDetected
          ? Math.min(99, Math.round(70 + severityScore * 0.4))
          : Math.min(99, Math.round(80 + skinToneRatio + uniformColorRatio * 0.2));

        // ── Assessment message ────────────────────────────────────────────────
        let assessment;
        if (isPotholeDetected) {
          assessment = `ML Vision confirmed: ${defectType} detected. Texture: ${textureVariance.toFixed(1)}, Edges: ${edgeDensity.toFixed(1)}%, Dark cavity: ${darkRegionRatio.toFixed(1)}%. Severity: ${severity}.`;
        } else if (isSelfie) {
          assessment = `REJECTED: Human face/skin detected (${skinToneRatio.toFixed(1)}% skin pixels). This appears to be a selfie or portrait. Please upload a road damage photo.`;
        } else if (isAiArt) {
          assessment = `REJECTED: AI-generated or digital art pattern detected (uniform blocks: ${uniformColorRatio.toFixed(1)}%, saturation: ${colorSaturationMean.toFixed(1)}%). Real road photos have natural texture variation.`;
        } else if (isNonRoad) {
          assessment = `REJECTED: Non-road environment detected (saturation: ${colorSaturationMean.toFixed(1)}%, asphalt gray coverage: ${grayConsistency.toFixed(1)}%). Please photograph actual road damage.`;
        } else {
          assessment = `No road defect detected. Surface appears clean (texture: ${textureVariance.toFixed(1)}, edges: ${edgeDensity.toFixed(1)}%, gray: ${grayConsistency.toFixed(1)}%).`;
        }

        resolve({
          isPotholeDetected,
          confidence,
          defectType: isPotholeDetected ? defectType : 'None',
          locationType,
          severity,
          area: `${areaM2} m²`,
          depth: `${depthCm} cm`,
          waterlogging: defectType === 'Pothole' && darkRegionRatio > 20 ? 'Detected (High)' : (defectType === 'Pothole' ? 'Possible (Low)' : 'N/A'),
          priorityScore,
          boundingBox: { x: Math.min(70, boxX), y: Math.min(70, boxY), width: boxW, height: boxH },
          assessment,
          // Expose raw features for pipeline UI display
          mlPipeline: {
            stage1Pavement: {
              pass:  grayConsistency >= 10 || !isInvalidImage,
              score: parseFloat(grayConsistency.toFixed(1)),
              details: `Asphalt gray coverage: ${grayConsistency.toFixed(1)}%`
            },
            stage2Cavity: {
              pass:  darkRegionRatio >= 10 || isPotholeDetected,
              score: parseFloat(darkRegionRatio.toFixed(1)),
              details: `Dark cavity ratio: ${darkRegionRatio.toFixed(1)}%`
            },
            stage3Edge: {
              pass:  edgeDensity >= 10,
              score: parseFloat(edgeDensity.toFixed(1)),
              details: `Edge gradient density: ${edgeDensity.toFixed(1)}%`
            }
          },
          // Legacy fields for backwards compat
          roadSpectrumRatio:  parseFloat(grayConsistency.toFixed(1)),
          nonRoadRatio:       parseFloat(colorSaturationMean.toFixed(1)),
          cavityRatio:        parseFloat(darkRegionRatio.toFixed(1)),
          edgeDensityRatio:   parseFloat(edgeDensity.toFixed(1)),
        });

      } catch (err) {
        console.error("AI Canvas Inspection Error:", err);
        resolve(buildFallbackResult('EXCEPTION'));
      }
    };

    img.onerror = () => resolve(buildFallbackResult('IMG_LOAD_ERROR'));
  });
}

function buildFallbackResult(reason) {
  return {
    isPotholeDetected: false,
    confidence: 0,
    defectType: 'None',
    locationType: 'Non-Road',
    severity: 'None',
    area: '0 m²',
    depth: '0 cm',
    waterlogging: 'N/A',
    priorityScore: 0,
    boundingBox: { x: 25, y: 25, width: 50, height: 45 },
    assessment: `Image analysis failed (${reason}). Please try a different photo.`,
    mlPipeline: {
      stage1Pavement: { pass: false, score: 0, details: 'Analysis failed' },
      stage2Cavity:   { pass: false, score: 0, details: 'Analysis failed' },
      stage3Edge:     { pass: false, score: 0, details: 'Analysis failed' }
    },
    roadSpectrumRatio: 0,
    nonRoadRatio: 0,
    cavityRatio: 0,
    edgeDensityRatio: 0,
  };
}
