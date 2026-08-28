import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import joblib

def train_models():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(current_dir, 'data', 'synthetic_dataset.csv')
    
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Dataset not found at {csv_path}. Please run dataset_generator.py first.")
        
    print("Loading synthetic dataset...")
    df = pd.read_csv(csv_path, keep_default_na=False)
    
    # Feature columns
    feature_cols = [
        'road_spectrum_ratio',
        'cavity_ratio',
        'edge_density',
        'non_road_ratio',
        'average_brightness'
    ]
    
    X = df[feature_cols]
    y_defect = df['defect_type']
    y_location = df['location_type']
    
    # Split dataset
    X_train, X_test, y_defect_train, y_defect_test, y_loc_train, y_loc_test = train_test_split(
        X, y_defect, y_location, test_size=0.2, random_state=42
    )
    
    # 1. Train Defect Classifier
    print("\nTraining Defect Type Classifier (Pothole vs Crack vs Damage vs None)...")
    defect_model = RandomForestClassifier(n_estimators=100, max_depth=12, random_state=42)
    defect_model.fit(X_train, y_defect_train)
    
    # Evaluate
    y_defect_pred = defect_model.predict(X_test)
    defect_acc = accuracy_score(y_defect_test, y_defect_pred)
    print(f"Defect Classifier Accuracy: {defect_acc:.4f}")
    print("\nDefect Classifier Report:")
    print(classification_report(y_defect_test, y_defect_pred))
    
    # 2. Train Location Classifier
    print("\nTraining Location Classifier (Road vs Non-Road)...")
    location_model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    location_model.fit(X_train, y_loc_train)
    
    # Evaluate
    y_loc_pred = location_model.predict(X_test)
    loc_acc = accuracy_score(y_loc_test, y_loc_pred)
    print(f"Location Classifier Accuracy: {loc_acc:.4f}")
    print("\nLocation Classifier Report:")
    print(classification_report(y_loc_test, y_loc_pred))
    
    # Save models
    models_dir = os.path.join(current_dir, 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    defect_model_path = os.path.join(models_dir, 'defect_model.joblib')
    location_model_path = os.path.join(models_dir, 'location_model.joblib')
    
    print(f"\nSaving models to {models_dir}...")
    joblib.dump(defect_model, defect_model_path)
    joblib.dump(location_model, location_model_path)
    print("Models saved successfully!")

if __name__ == '__main__':
    train_models()
