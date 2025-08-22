#!/usr/bin/env python3
"""
MPAP Room Guide QR Code Generator
Generates QR codes for all rooms and studios offline
"""

import qrcode
import os
from pathlib import Path

# Base URL for the GitHub Pages site
BASE_URL = "https://mpaproomguide.github.io/MPAP-Room-Guide/"

# Room configuration - easily editable
ROOMS = [
    {
        "name": "Studio A",
        "url": "studio-a.html",
        "description": "8th Floor Studio - Room PC setup with closet access"
    },
    {
        "name": "Studio C", 
        "url": "studio-c.html",
        "description": "8th Floor Studio - Room PC and Laptop video with carousels"
    },
    {
        "name": "Studio D",
        "url": "studio-d.html", 
        "description": "8th Floor Studio - Video and Sound setup with HDX audio"
    },
    {
        "name": "Studio E",
        "url": "studio-e.html",
        "description": "8th Floor Studio - Audio setup with Focusrite Surround"
    },
    {
        "name": "Studio F",
        "url": "studio-f.html",
        "description": "8th Floor Studio - Complete video and audio setup"
    },
    {
        "name": "Acting Lab",
        "url": "acting-lab.html",
        "description": "Acting Lab setup and configuration"
    },
    {
        "name": "Room 302",
        "url": "room302.html",
        "description": "Room 302 setup guide"
    },
    {
        "name": "Room 303",
        "url": "room303.html",
        "description": "Room 303 setup guide"
    },
    {
        "name": "Room 304",
        "url": "room304.html",
        "description": "Room 304 setup guide"
    },
    {
        "name": "Room 305",
        "url": "room305.html",
        "description": "Room 305 setup guide"
    },
    {
        "name": "Room 306",
        "url": "room306.html",
        "description": "Room 306 setup guide"
    },
    {
        "name": "Room 307",
        "url": "room307.html",
        "description": "Room 307 setup guide"
    },
    {
        "name": "Room 560",
        "url": "room560.html",
        "description": "Room 560 setup guide"
    },
    {
        "name": "Room 562",
        "url": "room562.html",
        "description": "Room 562 setup guide"
    },
    {
        "name": "Room 570",
        "url": "room570.html",
        "description": "Room 570 setup guide"
    },
    {
        "name": "Room 582",
        "url": "room582.html",
        "description": "Room 582 setup guide"
    },
    {
        "name": "Room 620",
        "url": "room620.html",
        "description": "Room 620 setup guide"
    },
    {
        "name": "Room 623",
        "url": "room623.html",
        "description": "Room 623 setup guide"
    },
    {
        "name": "Room 624",
        "url": "room624.html",
        "description": "Room 624 setup guide"
    },
    {
        "name": "6th Floor",
        "url": "room6thFloor.html",
        "description": "6th Floor room setup guide"
    },
    {
        "name": "Room 770",
        "url": "room770.html",
        "description": "Room 770 setup guide"
    },
    {
        "name": "Room 771",
        "url": "room771.html",
        "description": "Room 771 setup guide"
    },
    {
        "name": "Room 774",
        "url": "room774.html",
        "description": "Room 774 setup guide"
    },
    {
        "name": "Room 777",
        "url": "room777.html",
        "description": "Room 777 setup guide"
    },
    {
        "name": "Room 778",
        "url": "room778.html",
        "description": "Room 778 setup guide"
    },
    {
        "name": "Room 779",
        "url": "room779.html",
        "description": "Room 779 setup guide"
    },
    {
        "name": "Room 876",
        "url": "room876.html",
        "description": "Room 876 setup guide"
    },
    {
        "name": "Room 879",
        "url": "room879.html",
        "description": "Room 879 setup guide"
    },
    {
        "name": "Room 985",
        "url": "room985.html",
        "description": "Room 985 setup guide"
    },
    {
        "name": "Room C205",
        "url": "roomC205.html",
        "description": "Room C205 setup guide"
    },
    {
        "name": "Room C207",
        "url": "roomC207.html",
        "description": "Room C207 setup guide"
    },
    {
        "name": "Drama Therapy",
        "url": "drama-therapy.html",
        "description": "Drama Therapy room setup guide"
    }
]

def generate_qr_code(room_name, url, description, output_dir):
    """Generate a QR code for a specific room"""
    # Create QR code instance
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    
    # Add the full URL
    full_url = BASE_URL + url
    qr.add_data(full_url)
    qr.make(fit=True)
    
    # Create the image
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Save the image
    filename = f"{room_name.replace(' ', '_').replace('/', '_')}_QR.png"
    filepath = output_dir / filename
    img.save(filepath)
    
    print(f"✓ Generated QR code for {room_name}: {filepath}")
    print(f"  URL: {full_url}")
    print(f"  Description: {description}")
    print()
    
    return filepath

def generate_all_qr_codes():
    """Generate QR codes for all rooms"""
    # Create output directory
    output_dir = Path("qr_codes")
    output_dir.mkdir(exist_ok=True)
    
    print("🎯 MPAP Room Guide QR Code Generator")
    print("=" * 50)
    print(f"Base URL: {BASE_URL}")
    print(f"Output directory: {output_dir.absolute()}")
    print(f"Total rooms: {len(ROOMS)}")
    print("=" * 50)
    print()
    
    # Generate QR codes for each room
    generated_files = []
    for room in ROOMS:
        try:
            filepath = generate_qr_code(
                room["name"], 
                room["url"], 
                room["description"], 
                output_dir
            )
            generated_files.append(filepath)
        except Exception as e:
            print(f"❌ Error generating QR code for {room['name']}: {e}")
            print()
    
    # Summary
    print("=" * 50)
    print(f"✅ Successfully generated {len(generated_files)} QR codes")
    print(f"📁 All files saved to: {output_dir.absolute()}")
    print()
    print("📋 Files generated:")
    for filepath in generated_files:
        print(f"  • {filepath.name}")
    
    print()
    print("💡 Tips:")
    print("  • Print these QR codes and tape them to each room's door/equipment")
    print("  • The URLs will always work as long as your GitHub Pages site is active")
    print("  • No need to regenerate codes when you update the site content")

if __name__ == "__main__":
    try:
        generate_all_qr_codes()
    except KeyboardInterrupt:
        print("\n\n⚠️  QR code generation cancelled by user")
    except Exception as e:
        print(f"\n\n❌ Unexpected error: {e}")
        print("Make sure you have the 'qrcode' package installed:")
        print("pip install qrcode[pil]")
