#!/usr/bin/env python3
"""
Image Download Script for CSE310 Module 3 Inventory System
Downloads all images referenced by readdy.ai URLs and replaces them with local files
"""

import os
import re
import json
import requests
from pathlib import Path
from urllib.parse import parse_qs, urlparse
import time
from typing import Dict, List, Tuple

class ImageDownloader:
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.src_dir = self.project_root / "src"
        self.public_dir = self.project_root / "public"
        self.images_dir = self.public_dir / "images"
        self.downloaded_images: Dict[str, str] = {}
        
        # Ensure directories exist
        self.public_dir.mkdir(exist_ok=True)
        self.images_dir.mkdir(exist_ok=True)
        
    def find_readdy_urls(self) -> List[Tuple[str, str, str]]:
        """Find all readdy.ai URLs in the src directory"""
        readdy_pattern = r'https://readdy\.ai/api/search-image\?[^\'"\s]+'
        files_with_urls = []
        
        # Search in all TypeScript/JavaScript files
        for file_path in self.src_dir.rglob("*.ts"):
            if file_path.is_file():
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        urls = re.findall(readdy_pattern, content)
                        for url in urls:
                            files_with_urls.append((str(file_path), url, content))
                except Exception as e:
                    print(f"Error reading {file_path}: {e}")
                    
        for file_path in self.src_dir.rglob("*.tsx"):
            if file_path.is_file():
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        urls = re.findall(readdy_pattern, content)
                        for url in urls:
                            files_with_urls.append((str(file_path), url, content))
                except Exception as e:
                    print(f"Error reading {file_path}: {e}")
        
        return files_with_urls
    
    def extract_query_info(self, url: str) -> Dict[str, str]:
        """Extract query information from readdy.ai URL"""
        parsed = urlparse(url)
        params = parse_qs(parsed.query)
        
        return {
            'query': params.get('query', [''])[0],
            'width': params.get('width', ['400'])[0],
            'height': params.get('height', ['300'])[0],
            'seq': params.get('seq', ['image'])[0],
            'orientation': params.get('orientation', ['landscape'])[0]
        }
    
    def generate_filename(self, query_info: Dict[str, str]) -> str:
        """Generate a clean filename from query info"""
        seq = query_info.get('seq', 'image')
        width = query_info.get('width', '400')
        height = query_info.get('height', '300')
        
        # Clean sequence name
        clean_seq = re.sub(r'[^a-zA-Z0-9]', '_', seq)
        return f"{clean_seq}_{width}x{height}.jpg"
    
    def get_unsplash_url(self, query_info: Dict[str, str]) -> str:
        """Generate Unsplash URL as alternative"""
        width = query_info.get('width', '400')
        height = query_info.get('height', '300')
        query = query_info.get('query', 'product')
        
        # Map common product types to better Unsplash search terms
        unsplash_queries = {
            'laptop': 'laptop-computer',
            'phone': 'smartphone-mobile',
            'mouse': 'computer-mouse',
            'macbook': 'macbook-laptop',
            'iphone': 'iphone-smartphone',
            'business': 'business-person',
            'professional': 'professional-headshot',
            'monitor': 'computer-monitor',
            'keyboard': 'computer-keyboard'
        }
        
        # Extract key terms from query
        query_lower = query.lower()
        search_term = 'technology'
        for key, value in unsplash_queries.items():
            if key in query_lower:
                search_term = value
                break
        
        return f"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w={width}&h={height}&fit=crop&auto=format&q=80"
    
    def download_image(self, url: str, filename: str) -> bool:
        """Download image from URL"""
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            
            file_path = self.images_dir / filename
            with open(file_path, 'wb') as f:
                f.write(response.content)
                
            print(f"Downloaded: {filename}")
            return True
            
        except Exception as e:
            print(f"Failed to download {url}: {e}")
            return False
    
    def create_placeholder_image(self, filename: str, query_info: Dict[str, str]) -> bool:
        """Create a placeholder image using HTML canvas approach"""
        width = int(query_info.get('width', '400'))
        height = int(query_info.get('height', '300'))
        query = query_info.get('query', 'Product Image')
        
        # Create a simple SVG placeholder
        svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">
  <rect width="100%" height="100%" fill="#f3f4f6"/>
  <rect x="10" y="10" width="{width-20}" height="{height-20}" fill="#e5e7eb" stroke="#d1d5db" stroke-width="2"/>
  <text x="50%" y="45%" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#6b7280">Product Image</text>
  <text x="50%" y="60%" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#9ca3af">{width}x{height}</text>
</svg>'''
        
        file_path = self.images_dir / filename.replace('.jpg', '.svg')
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(svg_content)
            print(f"Created placeholder: {filename.replace('.jpg', '.svg')}")
            return True
        except Exception as e:
            print(f"Failed to create placeholder {filename}: {e}")
            return False
    
    def replace_url_in_file(self, file_path: str, old_url: str, new_url: str):
        """Replace URL in file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            updated_content = content.replace(old_url, new_url)
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(updated_content)
                
            print(f"Updated {file_path}")
            
        except Exception as e:
            print(f"Error updating {file_path}: {e}")
    
    def process_all_images(self):
        """Main process to download and replace all images"""
        print("🔍 Scanning for readdy.ai URLs...")
        files_with_urls = self.find_readdy_urls()
        
        if not files_with_urls:
            print("✅ No readdy.ai URLs found!")
            return
        
        print(f"📁 Found {len(files_with_urls)} readdy.ai URLs")
        
        # Process each URL
        for file_path, url, content in files_with_urls:
            print(f"\n🔗 Processing: {url}")
            
            # Extract query information
            query_info = self.extract_query_info(url)
            filename = self.generate_filename(query_info)
            
            print(f"📝 Query: {query_info.get('query', 'N/A')[:50]}...")
            print(f"📁 Filename: {filename}")
            
            # Check if already downloaded
            if filename in self.downloaded_images:
                local_url = self.downloaded_images[filename]
                print(f"♻️  Already downloaded, using: {local_url}")
                self.replace_url_in_file(file_path, url, local_url)
                continue
            
            # Try to download from Unsplash alternative
            unsplash_url = self.get_unsplash_url(query_info)
            local_url = f"/images/{filename}"
            
            if self.download_image(unsplash_url, filename):
                self.downloaded_images[filename] = local_url
                self.replace_url_in_file(file_path, url, local_url)
                print(f"✅ Successfully replaced with: {local_url}")
            else:
                # Create placeholder
                if self.create_placeholder_image(filename, query_info):
                    placeholder_url = f"/images/{filename.replace('.jpg', '.svg')}"
                    self.downloaded_images[filename] = placeholder_url
                    self.replace_url_in_file(file_path, url, placeholder_url)
                    print(f"📄 Created placeholder: {placeholder_url}")
            
            # Rate limiting
            time.sleep(0.5)
        
        # Save download log
        self.save_download_log()
        print(f"\n🎉 Process complete! Downloaded {len(self.downloaded_images)} images")
        print(f"📁 Images saved to: {self.images_dir}")
    
    def save_download_log(self):
        """Save a log of downloaded images"""
        log_file = self.project_root / "image_download_log.json"
        log_data = {
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "images_downloaded": len(self.downloaded_images),
            "images": self.downloaded_images
        }
        
        with open(log_file, 'w', encoding='utf-8') as f:
            json.dump(log_data, f, indent=2)
        
        print(f"📊 Download log saved: {log_file}")

def main():
    """Main function"""
    print("🖼️  CSE310 Image Download Script")
    print("=" * 50)
    
    # Get project root (assumes script is run from project root)
    project_root = os.getcwd()
    
    # Verify we're in the right directory
    if not os.path.exists(os.path.join(project_root, "src")):
        print("❌ Error: Please run this script from the project root directory")
        print("   (The directory containing the 'src' folder)")
        return
    
    # Create downloader and process
    downloader = ImageDownloader(project_root)
    downloader.process_all_images()
    
    print("\n📋 Next steps:")
    print("1. Review the downloaded images in public/images/")
    print("2. Replace any placeholder SVGs with actual product images if needed")
    print("3. Run 'npm run build' to verify everything works")
    print("4. Commit the changes to git")

if __name__ == "__main__":
    main()
