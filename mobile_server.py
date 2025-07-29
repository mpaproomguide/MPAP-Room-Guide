#!/usr/bin/env python3
"""
Mobile Server for MPAP Room Guide
A simple HTTP server that serves the room guide files and can be accessed from mobile devices.
"""

import http.server
import socketserver
import socket
import os
import sys
from pathlib import Path

class MPAPRoomGuideHandler(http.server.SimpleHTTPRequestHandler):
    """Custom HTTP request handler for the MPAP Room Guide."""
    
    def __init__(self, *args, **kwargs):
        # Set the directory to serve from
        super().__init__(*args, directory=os.getcwd(), **kwargs)
    
    def end_headers(self):
        # Add CORS headers to allow mobile access
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def log_message(self, format, *args):
        # Custom logging to show requests
        print(f"[{self.log_date_time_string()}] {format % args}")

def get_local_ip():
    """Get the local IP address of the machine."""
    try:
        # Connect to a remote address to determine local IP
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.connect(("8.8.8.8", 80))
            return s.getsockname()[0]
    except Exception:
        return "127.0.0.1"

def main():
    """Main function to start the mobile server."""
    PORT = 8000
    
    # Get the current directory
    current_dir = os.getcwd()
    print(f"📁 Serving files from: {current_dir}")
    
    # Get local IP address
    local_ip = get_local_ip()
    
    # Check if index.html exists
    if not os.path.exists("index.html"):
        print("❌ Error: index.html not found in current directory")
        print("   Make sure you're running this script from the MPAP Room Guide directory")
        sys.exit(1)
    
    # Create server
    with socketserver.TCPServer(("", PORT), MPAPRoomGuideHandler) as httpd:
        print(f"🚀 Mobile Server Started!")
        print(f"📍 Local access: http://localhost:{PORT}")
        print(f"📱 Mobile access: http://{local_ip}:{PORT}")
        print(f"🔗 Main page: http://{local_ip}:{PORT}/index.html")
        print(f"📋 Available rooms:")
        
        # List available room files
        html_files = [f for f in os.listdir('.') if f.endswith('.html') and f != 'index.html']
        for file in sorted(html_files):
            room_name = file.replace('.html', '')
            print(f"   • {room_name}: http://{local_ip}:{PORT}/{file}")
        
        print(f"\n💡 Tips:")
        print(f"   • Make sure your mobile device is on the same WiFi network")
        print(f"   • Scan the QR codes in the qr_codes/ folder to access specific rooms")
        print(f"   • Press Ctrl+C to stop the server")
        print(f"\n🔄 Server running...")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print(f"\n🛑 Server stopped by user")
            httpd.shutdown()

if __name__ == "__main__":
    main() 