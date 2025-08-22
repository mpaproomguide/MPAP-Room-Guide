# MPAP Room Guide - QR Code Generator

This Python script generates QR codes for all rooms and studios in the MPAP Room Guide.

## 🚀 Quick Start

### 1. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run the Script
```bash
python generate_qr_codes.py
```

### 3. Find Your QR Codes
All QR codes will be saved in the `qr_codes/` folder.

## 📋 What Gets Generated

The script creates QR codes for:
- **8th Floor Studios**: A, C, D, E, F
- **All Numbered Rooms**: 302, 303, 304, 305, 306, 307, 560, 562, 570, 582, 620, 623, 624, 770, 771, 774, 777, 778, 779, 876, 879, 985, C205, C207
- **Special Rooms**: Acting Lab, Drama Therapy, 6th Floor

## 🔧 Customization

### Add/Remove Rooms
Edit the `ROOMS` array in `generate_qr_codes.py`:

```python
ROOMS = [
    {
        "name": "New Room",
        "url": "new-room.html",
        "description": "Description of the new room"
    },
    # ... existing rooms
]
```

### Change Base URL
If you ever change your GitHub Pages URL, just update the `BASE_URL` variable:

```python
BASE_URL = "https://your-new-domain.com/"
```

## 📱 QR Code Details

- **Format**: PNG images
- **Size**: High resolution (200x200 pixels)
- **Error Correction**: Low level (L) - good for small codes
- **Colors**: Black on white (standard for printing)

## 🖨️ Printing Tips

1. **Print on white paper** for best contrast
2. **Use adhesive labels** to stick codes to doors/equipment
3. **Test each code** by scanning with a phone before printing
4. **Keep original files** in case you need to reprint

## 🔒 URL Stability

**Your GitHub Pages URLs are extremely stable:**
- ✅ `mpaproomguide.github.io/MPAP-Room-Guide/` will always work
- ✅ File paths like `studio-a.html` are permanent
- ✅ No need to regenerate codes when you update site content
- ✅ Only breaks if you delete the repository (which you control)

## 🐛 Troubleshooting

### "Module not found" Error
```bash
pip install qrcode[pil]
```

### Permission Error
Make sure you have write access to the current directory.

### QR Code Too Small/Large
Edit the `box_size` parameter in the script (default: 10).

## 📁 File Structure

```
├── generate_qr_codes.py    # Main script
├── requirements.txt        # Python dependencies
├── QR_CODE_README.md      # This file
└── qr_codes/              # Generated QR codes (created when script runs)
    ├── Studio_A_QR.png
    ├── Studio_C_QR.png
    ├── Room_302_QR.png
    └── ...
```

## 🎯 Usage Workflow

1. **Generate codes** once using this script
2. **Print and distribute** QR codes to each room
3. **Users scan codes** to access room-specific guides
4. **Update site content** without touching QR codes
5. **Codes automatically stay current** - no regeneration needed!

## 💡 Pro Tips

- **Batch print** all codes at once for consistency
- **Use different colors** for different building sections
- **Include room numbers** on the printed codes for easy identification
- **Test in low light** to ensure codes are scannable
