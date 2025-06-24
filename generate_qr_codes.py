import qrcode
import os

# List all room HTML files in the current directory
room_files = [
    f for f in os.listdir('.') if f.startswith('room') and f.endswith('.html')
]

# You can change this to your public URL if needed
base_url = 'http://10.17.215.31:8000/'

# Create output directory if it doesn't exist
output_dir = 'qr_codes'
os.makedirs(output_dir, exist_ok=True)

for room in room_files:
    url = base_url + room
    img = qrcode.make(url)
    img.save(os.path.join(output_dir, f"{room.replace('.html', '')}_qr.png"))
    print(f"Generated QR for {room}: {url}")

# Add QR code for support.html
support_url = base_url + 'support.html'
support_img = qrcode.make(support_url)
support_img.save(os.path.join(output_dir, 'support_qr.png'))
print(f"Generated QR for support: {support_url}") 