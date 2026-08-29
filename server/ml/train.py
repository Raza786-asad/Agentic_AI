import numpy as np
import pandas as pd
import os
import sys
import json
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.model_selection import cross_val_score
from sklearn.metrics import classification_report, accuracy_score

# ── Add project root to sys.path ──────────────────────────────────────────────
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)
from dataset_generator import generate_dataset

# ── Feature columns ───────────────────────────────────────────────────────────
FEATURES = [
    'texture_variance', 'edge_density', 'dark_region_ratio',
    'bright_region_ratio', 'color_saturation_mean', 'gray_consistency',
    'local_contrast', 'skin_tone_ratio', 'uniform_color_ratio'
]

def train():
    print("=" * 60)
    print("  ROADNEX AI — Road Defect ML Model Training")
    print("  Training on 100,000 synthetic real-world samples")
    print("=" * 60)
    
    # ── Generate dataset ──────────────────────────────────────────────────────
    print("\n[1/5] Generating 100k realistic training samples...")
    df = generate_dataset(100000)
    
    X = df[FEATURES].values
    y_defect = (df['defect_type'] != 'None').astype(int)        # 1=Defect, 0=None
    y_location = (df['location_type'] == 'Road').astype(int)    # 1=Road, 0=Non-Road
    
    defect_pos = y_defect.sum()
    defect_neg = (y_defect == 0).sum()
    print(f"   Defect samples -> Defect: {defect_pos:,}  Clean/Non-Road: {defect_neg:,}")
    
    # ── Train Defect Classifier ───────────────────────────────────────────────
    print("\n[2/5] Training Defect Detector (RandomForest — fast, accurate)...")
    defect_model = Pipeline([
        ('scaler', StandardScaler()),
        ('clf', RandomForestClassifier(
            n_estimators=150,
            max_depth=10,
            min_samples_split=15,
            min_samples_leaf=8,
            n_jobs=-1,
            class_weight='balanced',
            random_state=42
        ))
    ])
    defect_scores = cross_val_score(defect_model, X, y_defect, cv=3, scoring='accuracy')
    print(f"   Cross-val accuracy: {defect_scores.mean():.4f} +/- {defect_scores.std():.4f}")
    defect_model.fit(X, y_defect)
    
    # ── Train Location Classifier ──────────────────────────────────────────────
    print("\n[3/5] Training Location/Context Classifier (RandomForest)...")
    location_model = Pipeline([
        ('scaler', StandardScaler()),
        ('clf', RandomForestClassifier(
            n_estimators=200,
            max_depth=8,
            min_samples_split=15,
            min_samples_leaf=8,
            n_jobs=-1,
            random_state=42
        ))
    ])
    loc_scores = cross_val_score(location_model, X, y_location, cv=3, scoring='accuracy')
    print(f"   Cross-val accuracy: {loc_scores.mean():.4f} +/- {loc_scores.std():.4f}")
    location_model.fit(X, y_location)
    
    # ── Print detailed evaluation ─────────────────────────────────────────────
    print("\n[4/5] Final evaluation on full training set:")
    defect_preds   = defect_model.predict(X)
    location_preds = location_model.predict(X)
    
    print("\n  Defect Classifier Report:")
    print(classification_report(y_defect, defect_preds, target_names=['No Defect', 'Defect']))
    print(f"  Location Classifier Accuracy: {accuracy_score(y_location, location_preds)*100:.2f}%")
    
    # ── Feature importance ─────────────────────────────────────────────────────
    print("\n  Feature Importances (Defect Model):")
    importances = defect_model.named_steps['clf'].feature_importances_
    for feat, imp in sorted(zip(FEATURES, importances), key=lambda x: -x[1]):
        bar = '|' * int(imp * 40)
        print(f"   {feat:<26} {bar} {imp:.4f}")
    
    # ── Save models ───────────────────────────────────────────────────────────
    print("\n[5/5] Saving trained models...")
    models_dir = os.path.join(current_dir, 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    joblib.dump(defect_model,   os.path.join(models_dir, 'defect_model.joblib'))
    joblib.dump(location_model, os.path.join(models_dir, 'location_model.joblib'))
    
    # Save feature names and metadata
    meta = {
        'features': FEATURES,
        'defect_accuracy': float(defect_scores.mean()),
        'location_accuracy': float(loc_scores.mean()),
        'trained_on': 100000
    }
    with open(os.path.join(models_dir, 'model_meta.json'), 'w') as f:
        json.dump(meta, f, indent=2)
    
    print(f"\n  ✅ Models saved to: {models_dir}")
    print(f"  ✅ Defect model accuracy:   {defect_scores.mean()*100:.2f}%")
    print(f"  ✅ Location model accuracy: {loc_scores.mean()*100:.2f}%")
    print("\n" + "=" * 60)
    print("  TRAINING COMPLETE — Models ready for deployment!")
    print("=" * 60)


if __name__ == '__main__':
    train()
