#!/usr/bin/env python3
import os
import re
from pathlib import Path

def find_all_images():
    """Find all image files in the images directory"""
    images_dir = Path("images")
    image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.avif'}
    all_images = set()
    
    for root, dirs, files in os.walk(images_dir):
        for file in files:
            if Path(file).suffix.lower() in image_extensions:
                # Get relative path from images directory
                rel_path = Path(root) / file
                all_images.add(str(rel_path))
    
    return all_images

def find_used_images():
    """Find all image references in HTML files"""
    used_images = set()
    
    # Find all HTML files
    html_files = list(Path(".").glob("*.html"))
    
    for html_file in html_files:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
            
            # Find all image references
            # Look for src="images/..." patterns
            img_patterns = [
                r'src="images/([^"]+)"',
                r'href="images/([^"]+)"',
                r"src='images/([^']+)'",
                r"href='images/([^']+)'"
            ]
            
            for pattern in img_patterns:
                matches = re.findall(pattern, content)
                for match in matches:
                    used_images.add(match)
    
    return used_images

def main():
    print("Analyzing image usage...")
    
    all_images = find_all_images()
    used_images = find_used_images()
    
    print(f"\nTotal images found: {len(all_images)}")
    print(f"Images referenced in HTML: {len(used_images)}")
    
    # Find unused images (exist but not referenced)
    unused_images = all_images - used_images
    
    print(f"\nUnused images ({len(unused_images)}):")
    for img in sorted(unused_images):
        print(f"  - {img}")
    
    # Find missing images (referenced but don't exist)
    missing_images = used_images - all_images
    
    if missing_images:
        print(f"\nMissing images ({len(missing_images)}):")
        for img in sorted(missing_images):
            print(f"  - {img}")
    
    # Show some statistics
    print(f"\nUsage statistics:")
    print(f"  - Used: {len(used_images)}")
    print(f"  - Unused: {len(unused_images)}")
    print(f"  - Usage rate: {len(used_images)/len(all_images)*100:.1f}%")
    
    # Show some examples of used images
    print(f"\nExamples of used images:")
    for img in sorted(list(used_images))[:10]:
        print(f"  - {img}")

if __name__ == "__main__":
    main() 