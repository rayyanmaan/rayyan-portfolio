import cv2
import numpy as np

# Load the image
img = cv2.imread('doodle_raw.jpg')

# Convert to grayscale
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Threshold to separate black lines from white background
# 255 is white, 0 is black. So we invert it: < 200 becomes 255 (alpha)
_, alpha = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY_INV)

# Convert grayscale to BGRA (4 channels)
b, g, r = cv2.split(img)

# We want the lines to be black (0,0,0) and the background to be transparent (alpha=0).
new_b = np.zeros_like(b)
new_g = np.zeros_like(g)
new_r = np.zeros_like(r)

# Merge the channels
bgra = cv2.merge([new_b, new_g, new_r, alpha])

# Save as PNG
cv2.imwrite('doodle.png', bgra)
print("Doodle processed and saved as doodle.png")
