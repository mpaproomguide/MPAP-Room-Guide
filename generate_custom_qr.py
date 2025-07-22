import qrcode
import sys
import os

def generate_qr(url, filename=None):
    """Generate a QR code for the given URL"""
    if not filename:
        # Extract a reasonable filename from the URL
        filename = "custom_qr.png"
    
    # Create output directory if it doesn't exist
    output_dir = 'qr_codes'
    os.makedirs(output_dir, exist_ok=True)
    
    # Generate QR code
    img = qrcode.make(url)
    filepath = os.path.join(output_dir, filename)
    img.save(filepath)
    
    print(f"Generated QR code for: {url}")
    print(f"Saved as: {filepath}")
    return filepath

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python generate_custom_qr.py <URL> [filename]")
        print("Example: python generate_custom_qr.py http://localhost:8000/room777.html")
        sys.exit(1)
    
    url = sys.argv[1]
    filename = sys.argv[2] if len(sys.argv) > 2 else "custom_qr.png"
    
    generate_qr(url, filename) 