import cv2
import numpy as np

img = cv2.imread('C:\\Universty Projects\\Computer Vision\\3.png')
original = img.copy()

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# separate objects
_, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

# Find contours
contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# To order objects by size 
sorted_contours = sorted(contours, key=cv2.contourArea, reverse=True)

object_count = 0

distinct_colors = [
    (0, 255, 0),      # Green
    (255, 0, 0),      # Blue
    (0, 0, 255),      # Red
    (255, 0, 255),    # Magenta
    (255, 255, 0),    # Cyan
    (128, 0, 128),    # Purple
    (0, 200, 190),    # Yellow
    (255, 165, 0),    # Orange
    (0, 128, 255),    # Light Blue
    (128, 255, 0)     # Lime
]

colors = []

for i, cnt in enumerate(sorted_contours):
    area = cv2.contourArea(cnt)
    object_count += 1

    # The outline detection of each object
    x, y, w, h = cv2.boundingRect(cnt)

    # Pick color 
    color = distinct_colors[i % len(distinct_colors)]
    colors.append(color)

    cv2.rectangle(img, (x, y), (x + w, y + h), color, 2)

    # Shape detection
    shape = "Unknown"
    approx = cv2.approxPolyDP(cnt, 0.01 * cv2.arcLength(cnt, True), True)
    vertices = len(approx)

    if vertices == 3:
        shape = "Triangle"
    elif vertices == 4:
        aspect_ratio = float(w) / h
        shape = "Square" if 0.95 <= aspect_ratio <= 1.05 else "Rectangle"
    elif vertices == 5:
        shape = "Pentagon"
    elif vertices == 6:
        shape = "Hexagon"
    elif vertices == 7:
        shape = "Heptagon"
    elif vertices == 8:
        shape = "Octagon"
    elif vertices == 9:
        shape = "Nonagon"
    elif vertices == 10:
        shape = "Decagon"
    elif vertices > 10:
        shape = "Circle"

    # The information above each object
    label = f"{i+1}. {shape} - {int(area)} px"
    cv2.putText(img, label, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

cv2.putText(img, f"Total Objects: {object_count}", (10, img.shape[0] - 20),
            cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)

# The list of objects on the left
legend_y = 40
for idx, color in enumerate(colors):
    cv2.rectangle(img, (10, legend_y), (30, legend_y + 20), color, -1)
    cv2.putText(img, f"Object {idx+1}", (40, legend_y + 20), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 0, 0), 1)
    legend_y += 40

cv2.imshow("Advanced Object Analyzer", img)
cv2.waitKey(0)
cv2.destroyAllWindows()
