## 3rd year Computer Science Project for Software Engineering

Inkognito is a browser-based automated self service printing system, uses a credit system where users can top-up their accounts to be used on printing for auto deductions.
Automatic pricing is based on total amount of cmyk(colored) or grayscale(black and white) on one page

The document will be automatically converted to image

example of calculation for black and white:
```py
  8.5x11in US Letter @ 150 DPI = 2,103,750 pixels
  8.5 * 150 = 1275 pixels
  11 * 150 = 1650 pixels
  1275 * 1650 = 2,103,750 pixels


  B&W:
  L = grayscale value of a pixel (0–255), from img.convert("L")
      L=255 white, L=0 black # higher value is white for grayscale
  ink per pixel = 255 − L

  Loop over every pixel:
    for each pixel:
      L = pixel's grayscale value (0–255)
      total_ink += (255 − L)

  After the loop:
    total_ink = 26212725

  max = 2103750 × 1 × 255 = 536456250
  coverage = [ 26212725 / 536456250 ] × 100 = 4.89%
```
example calculation for colored
```py
US Letter @ 150 DPI = 2103750 pixels

Color:
Loop over every pixel:
  total_ink += (C + M + Y + K)

After the loop:
  total_C = 420750000
  total_M = 294525000
  total_Y = 336600000
  total_K = 189337500
  total_ink = 1241212500

max = 2103750 × 4 × 255 = 2145825000
coverage = [ 1241212500 / 2145825000 ] × 100 = 57.84%
```
