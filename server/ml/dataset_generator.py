import numpy as np
import pandas as pd
import os

def generate_dataset(num_samples=50000):
    np.random.seed(42)
    
    # We will generate distributions for the following classes
    classes = [
        ('Pothole', 'Road'),
        ('Crack', 'Road'),
        ('Damage', 'Road'),
        ('None', 'Road'),
        ('Pothole', 'Non-Road'),
        ('Crack', 'Non-Road'),
        ('Damage', 'Non-Road'),
        ('None', 'Non-Road')
    ]
    
    samples_per_class = num_samples // len(classes)
    
    data = []
    
    for defect, location in classes:
        for _ in range(samples_per_class):
            # Define normal distributions for each class to mimic physical measurements
            if location == 'Road':
                # Road context: high road spectrum, low non-road spectrum
                road_spectrum_ratio = np.random.normal(70, 8)
                non_road_ratio = np.random.normal(8, 4)
            else:
                # Non-Road context: low road spectrum, high non-road spectrum
                road_spectrum_ratio = np.random.normal(12, 6)
                non_road_ratio = np.random.normal(65, 12)
                
            if defect == 'Pothole':
                # Pothole: high cavity ratio, high-medium edge density
                cavity_ratio = np.random.normal(20, 4)
                edge_density = np.random.normal(14, 3)
            elif defect == 'Crack':
                # Crack: low cavity, very high edge density
                cavity_ratio = np.random.normal(2, 1)
                edge_density = np.random.normal(32, 5)
            elif defect == 'Damage':
                # General Wear/Damage: moderate cavity, moderate edge density
                cavity_ratio = np.random.normal(8, 2)
                edge_density = np.random.normal(12, 3)
            else: # None
                # None: very low cavity, low edge density
                cavity_ratio = np.random.normal(1, 0.5)
                edge_density = np.random.normal(2, 1)
                
            average_brightness = np.random.normal(110, 30)
            
            # Clip values to valid percentages / brightness ranges
            road_spectrum_ratio = np.clip(road_spectrum_ratio, 0, 100)
            cavity_ratio = np.clip(cavity_ratio, 0, 100)
            edge_density = np.clip(edge_density, 0, 100)
            non_road_ratio = np.clip(non_road_ratio, 0, 100)
            average_brightness = np.clip(average_brightness, 0, 255)
            
            data.append({
                'road_spectrum_ratio': round(road_spectrum_ratio, 2),
                'cavity_ratio': round(cavity_ratio, 2),
                'edge_density': round(edge_density, 2),
                'non_road_ratio': round(non_road_ratio, 2),
                'average_brightness': round(average_brightness, 2),
                'defect_type': defect,
                'location_type': location
            })
            
    df = pd.DataFrame(data)
    # Shuffle dataset
    df = df.sample(frac=1).reset_index(drop=True)
    return df

if __name__ == '__main__':
    print("Generating 50,000 synthetic defect detection samples...")
    # Get the directory of the current script
    current_dir = os.path.dirname(os.path.abspath(__file__))
    df = generate_dataset(50000)
    data_dir = os.path.join(current_dir, 'data')
    os.makedirs(data_dir, exist_ok=True)
    csv_path = os.path.join(data_dir, 'synthetic_dataset.csv')
    df.to_csv(csv_path, index=False)
    print(f"Dataset generated and saved at {csv_path}. Shape: {df.shape}")
