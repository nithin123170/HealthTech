import subprocess
import sys
import os
import argparse
import numpy as np

# --------------------------
# AUTO INSTALL LIBRARIES
# --------------------------
def install(package):
    """Install package if not available"""
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])
        print(f"✅ Installed {package}")
    except subprocess.CalledProcessError:
        print(f"❌ Failed to install {package}")

# Install required packages
try:
    from ultralytics import YOLO
    print("✅ YOLO available")
except ImportError:
    print("Installing ultralytics...")
    install("ultralytics")
    from ultralytics import YOLO

try:
    import cv2
    print("✅ OpenCV available")
except ImportError:
    print("Installing opencv-python...")
    install("opencv-python")
    import cv2

try:
    from skimage import morphology
    print("✅ Scikit-image available")
except ImportError:
    print("Installing scikit-image...")
    install("scikit-image")
    from skimage import morphology

# --------------------------
# LOAD YOLO MODEL
# --------------------------
print("\n🔄 Loading YOLOv8 model...")
try:
    model = YOLO("yolov8n.pt")
    print("✅ YOLOv8 model loaded successfully")
except Exception as e:
    print(f"❌ Failed to load YOLO model: {e}")
    sys.exit(1)

# --------------------------
# WATER RELATED OBJECTS
# --------------------------
water_objects = [
    "boat", "ship", "surfboard", "kiteboard", "jetski",
    "canoe", "kayak", "paddleboard", "sailboat", "motorboat",
    "lifeboat", "speedboat", "catamaran", "yacht", "ferry",
    "swimmer", "diver"  # People in water
]

# --------------------------
# REJECTED OBJECTS (Documents, Selfies, etc.)
# --------------------------
reject_objects = [
    "person", "cell phone", "book", "laptop", "tv", "tvmonitor",
    "keyboard", "mouse", "remote", "car", "motorcycle", "bus", "truck",
    "bicycle", "airplane", "train", "traffic light", "fire hydrant",
    "stop sign", "parking meter", "bench", "bird", "cat", "dog",
    "horse", "sheep", "cow", "elephant", "bear", "zebra", "giraffe",
    "backpack", "umbrella", "handbag", "tie", "suitcase", "frisbee",
    "skis", "snowboard", "sports ball", "kite", "baseball bat",
    "baseball glove", "skateboard", "tennis racket", "bottle",
    "wine glass", "cup", "fork", "knife", "spoon", "bowl", "banana",
    "apple", "sandwich", "orange", "broccoli", "carrot", "hot dog",
    "pizza", "donut", "cake", "chair", "couch", "potted plant",
    "bed", "dining table", "toilet", "sink", "refrigerator", "book",
    "clock", "vase", "scissors", "teddy bear", "hair drier", "toothbrush"
]

# --------------------------
# ADVANCED WATER SURFACE DETECTOR
# --------------------------
class WaterSurfaceDetector:
    def __init__(self):
        self.min_water_area = 0.05  # 5% minimum water area

    def detect_water_surface(self, image_path):
        """Advanced water surface detection using computer vision"""
        try:
            image = cv2.imread(image_path)
            if image is None:
                return False, 0.0

            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            height, width = image.shape[:2]

            # Multi-method water detection
            water_score = self._calculate_water_score(image_rgb)

            # Validate water characteristics
            is_valid_water = self._validate_water_properties(image_rgb, water_score)

            water_percentage = water_score * 100

            # Strict criteria for water acceptance
            has_water = (water_percentage >= (self.min_water_area * 100) and
                        is_valid_water and
                        water_score > 0.08)  # Additional threshold

            return has_water, water_percentage

        except Exception as e:
            print(f"❌ Surface detection error: {e}")
            return False, 0.0

    def _calculate_water_score(self, image_rgb):
        """Calculate comprehensive water score"""
        # Color-based detection
        color_score = self._color_based_water_detection(image_rgb)

        # Texture-based detection
        texture_score = self._texture_based_water_detection(image_rgb)

        # Edge-based detection
        edge_score = self._edge_based_water_detection(image_rgb)

        # Combine scores with weights
        combined_score = (color_score * 0.5 + texture_score * 0.3 + edge_score * 0.2)

        return combined_score

    def _color_based_water_detection(self, image_rgb):
        """Detect water by color analysis"""
        hsv = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2HSV)

        # Strict water color ranges
        lower_water = np.array([85, 20, 20])
        upper_water = np.array([140, 255, 200])

        water_mask = cv2.inRange(hsv, lower_water, upper_water)

        # Clean up mask
        kernel = np.ones((5,5), np.uint8)
        water_mask = cv2.morphologyEx(water_mask, cv2.MORPH_OPEN, kernel)
        water_mask = cv2.morphologyEx(water_mask, cv2.MORPH_CLOSE, kernel)

        water_pixels = np.sum(water_mask > 0)
        total_pixels = image_rgb.shape[0] * image_rgb.shape[1]

        return water_pixels / total_pixels

    def _texture_based_water_detection(self, image_rgb):
        """Detect water by texture smoothness"""
        gray = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2GRAY)

        # Calculate local variance (water is smooth)
        kernel_size = 11
        local_mean = cv2.blur(gray, (kernel_size, kernel_size))
        local_sq_mean = cv2.blur(gray.astype(np.float32)**2, (kernel_size, kernel_size))
        local_var = local_sq_mean - local_mean**2

        # Low variance = smooth texture (water)
        _, smooth_mask = cv2.threshold(local_var.astype(np.uint8), 30, 255, cv2.THRESH_BINARY_INV)

        smooth_pixels = np.sum(smooth_mask > 0)
        total_pixels = image_rgb.shape[0] * image_rgb.shape[1]

        return smooth_pixels / total_pixels

    def _edge_based_water_detection(self, image_rgb):
        """Detect water by edge characteristics"""
        gray = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2GRAY)
        blurred = cv2.GaussianBlur(gray, (3, 3), 0)
        edges = cv2.Canny(blurred, 20, 100)

        # Water typically has fewer, smoother edges
        edge_density = np.sum(edges > 0) / edges.size

        # Low edge density often indicates water
        if edge_density < 0.1:  # Less than 10% edges
            return 0.8  # High water probability
        elif edge_density < 0.2:
            return 0.4
        else:
            return 0.1  # Low water probability

    def _validate_water_properties(self, image_rgb, water_score):
        """Validate that detected areas have water-like properties"""
        if water_score < 0.05:
            return False

        # Check color consistency
        hsv = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2HSV)
        mean_hue = np.mean(hsv[:, :, 0])
        std_hue = np.std(hsv[:, :, 0])

        # Water should have consistent blue-ish hues
        if not (80 <= mean_hue <= 140):  # Blue range
            return False

        if std_hue > 30:  # Too much hue variation
            return False

        return True

# --------------------------
# COMPREHENSIVE WATER IMAGE VALIDATOR
# --------------------------
def validate_water_image(image_path):
    """
    Complete water image validation:
    1. Reject documents/selfies using YOLO
    2. Accept water-related objects using YOLO
    3. Detect actual water surfaces using CV
    """
    print("🔍 Step 1: Object Detection Analysis...")

    # YOLO object detection
    try:
        results = model(image_path, verbose=False)
    except Exception as e:
        print(f"❌ YOLO detection failed: {e}")
        return False

    detected_objects = []
    for r in results:
        for box in r.boxes:
            class_id = int(box.cls[0])
            label = model.names[class_id]
            confidence = float(box.conf[0])
            if confidence > 0.3:  # 30% confidence threshold
                detected_objects.append(label)

    print(f"📋 Detected objects: {detected_objects}")

    # RULE 1: Reject if forbidden objects are detected
    rejected_found = [obj for obj in detected_objects if obj in reject_objects]
    if rejected_found:
        print(f"🚫 REJECTED: Found non-water objects: {rejected_found}")
        print("   This appears to be a document, selfie, or urban scene")
        return False

    # RULE 2: Accept if water-related objects are detected
    water_objects_found = [obj for obj in detected_objects if obj in water_objects]
    if water_objects_found:
        print(f"✅ ACCEPTED: Found water-related objects: {water_objects_found}")
        return True

    # RULE 3: If no clear objects, check for water surfaces
    print("🔍 Step 2: Water Surface Analysis...")
    surface_detector = WaterSurfaceDetector()
    has_water_surface, water_percentage = surface_detector.detect_water_surface(image_path)

    if has_water_surface:
        print(f"✅ ACCEPTED: Water surface detected ({water_percentage:.1f}% of image)")
        return True
    else:
        print(f"⚠️ No significant water surface found ({water_percentage:.1f}% of image)")
        print("❌ REJECTED: No water bodies or water-related objects detected")
        return False

# --------------------------
# MAIN EXECUTION
# --------------------------
def main():
    # Check if arguments are provided (excluding script name)
    if len(sys.argv) == 1:
        # Interactive mode - no command line arguments
        print("🌊 Water Image Validator for Heatwave Sentinel")
        print("=" * 50)

        while True:
            try:
                image_path = input("\nEnter image path (or 'quit' to exit): ").strip()
            except (EOFError, KeyboardInterrupt):
                print("\n👋 Goodbye!")
                break

            if image_path.lower() in ['quit', 'exit', 'q']:
                break

            if not os.path.exists(image_path):
                print("❌ Image not found. Please check the path.")
                continue

            print(f"\n🔍 Analyzing: {image_path}")
            print("-" * 40)

            if validate_water_image(image_path):
                print("\n✅ ACCEPTED: Valid water image!")
            else:
                print("\n❌ REJECTED: Not a water image")
    else:
        # Command line mode
        parser = argparse.ArgumentParser(description="Complete Water Image Validator for Heatwave Sentinel")
        parser.add_argument("image_path", help="Path to image file to analyze")

        try:
            args = parser.parse_args()

            image_path = args.image_path
            if not os.path.exists(image_path):
                print(f"❌ Image not found: {image_path}")
                return

            print(f"\n🌊 WATER IMAGE VALIDATOR")
            print("=" * 50)
            print(f"📁 Image: {image_path}")
            print("=" * 50)

            if validate_water_image(image_path):
                print("\n🎉 FINAL RESULT: ✅ ACCEPTED - Valid water image!")
                print("   Suitable for heatwave monitoring and flood assessment")
            else:
                print("\n💥 FINAL RESULT: ❌ REJECTED - Not a water image")
                print("   Please upload images of lakes, rivers, floods, or water activities")
        except SystemExit:
            # Handle argparse help/error exits gracefully
            pass

if __name__ == "__main__":
    main()

# ---------------------------
# MAIN FUNCTION
# ---------------------------
def main():
    parser = argparse.ArgumentParser(description="Strict Water Body Detection for Heatwave Sentinel")
    parser.add_argument("image_path", help="Path to image file to analyze")
    parser.add_argument("--min-area", type=float, default=0.08,
                       help="Minimum water area as fraction of image (default: 0.08 = 8%%)")
    parser.add_argument("--show-result", action="store_true",
                       help="Display the detection result visually")

    args = parser.parse_args()

    image_path = args.image_path

    if not os.path.exists(image_path):
        print(f"❌ Image not found: {image_path}")
        return

    print(f"\n🌊 STRICT Water Body Analysis: {image_path}")
    print("=" * 60)

    # Initialize detector
    detector = WaterDetector()

    # Detect water
    has_water, water_percentage, confidence = detector.detect_water_bodies(
        image_path, args.min_area
    )

    print(".2f")
    print(".2f")

    if has_water:
        print("✅ ACCEPTED: Genuine water body detected!")
        print("   This image contains authentic water surfaces (lakes, rivers, reservoirs)")
        print("   📍 Suitable for: Heatwave water monitoring, flood assessment")
    else:
        print("❌ REJECTED: No authentic water bodies detected")
        print("   🚫 Rejected types: Documents, cards, buildings, artificial images")
        print("   ✅ Required: Natural water bodies (lakes, rivers, oceans) covering >8% of image")
        print("   💡 Tip: Upload photos of actual water bodies, not documents or urban scenes")

    # Show result if requested
    if args.show_result:
        try:
            image = cv2.imread(image_path)
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

            # Create visualization
            plt.figure(figsize=(15, 5))

            plt.subplot(1, 4, 1)
            plt.imshow(image_rgb)
            plt.title("Original Image")
            plt.axis('off')

            # Generate water mask for visualization
            water_mask = detector._strict_water_color_detection(image_rgb)

            plt.subplot(1, 4, 2)
            plt.imshow(water_mask, cmap='Blues')
            plt.title("Water Color Detection")
            plt.axis('off')

            plt.subplot(1, 4, 3)
            texture_mask = detector._water_texture_analysis(image_rgb)
            plt.imshow(texture_mask, cmap='Greens')
            plt.title("Texture Analysis")
            plt.axis('off')

            plt.subplot(1, 4, 4)
            overlay = image_rgb.copy()
            overlay[water_mask > 127] = [0, 255, 255]  # Cyan overlay
            plt.imshow(overlay)
            plt.title("Final Detection")
            plt.axis('off')

            plt.tight_layout()
            plt.show()

        except Exception as e:
            print(f"⚠️ Could not display result: {e}")

if __name__ == "__main__":
    main()