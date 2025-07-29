# MPAP Room Guide - Mobile Server

This mobile server allows you to access the MPAP Room Guide from any device on your local network, including mobile phones and tablets.

## Quick Start

### Option 1: Using the Shell Script (Recommended)
```bash
./start_mobile_server.sh
```

### Option 2: Using Python Directly
```bash
python3 mobile_server.py
```

## How It Works

1. **Start the server** using one of the methods above
2. **Get your local IP address** - the server will display it automatically
3. **Connect your mobile device** to the same WiFi network as your computer
4. **Open your mobile browser** and navigate to the displayed URL
5. **Access any room guide** by clicking on the room links

## Features

- ✅ **Mobile-friendly**: Optimized for touch devices
- ✅ **Network access**: Accessible from any device on your local network
- ✅ **QR code support**: Use existing QR codes to access specific rooms
- ✅ **Real-time logging**: See which pages are being accessed
- ✅ **CORS enabled**: Works with modern web browsers
- ✅ **Easy to use**: Simple start/stop commands

## Example URLs

When the server starts, you'll see URLs like:
- Main page: `http://192.168.1.100:8000/index.html`
- Room 777: `http://192.168.1.100:8000/room777.html`
- Room 302: `http://192.168.1.100:8000/room302.html`

## Troubleshooting

### Can't access from mobile device?
1. Make sure both devices are on the same WiFi network
2. Check if your firewall is blocking port 8000
3. Try using the local IP address shown by the server

### Server won't start?
1. Make sure you're in the MPAP Room Guide directory
2. Check that Python 3 is installed: `python3 --version`
3. Ensure `index.html` exists in the current directory

### Port 8000 is in use?
Edit `mobile_server.py` and change the `PORT = 8000` line to use a different port (e.g., `PORT = 8080`)

## Stopping the Server

Press `Ctrl+C` in the terminal where the server is running.

## Security Note

This server is designed for local network use only. It's not suitable for public internet access as it serves files without authentication. 