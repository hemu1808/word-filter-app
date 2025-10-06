#!/usr/bin/env python3
"""Test script to check if Oxford Dictionary returns synonyms"""

import requests
from bs4 import BeautifulSoup

def test_oxford_synonyms(word):
    """Test synonym extraction from Oxford Dictionary"""
    url = f"https://www.oxfordlearnersdictionaries.com/definition/english/{word}"
    
    print(f"\n{'='*60}")
    print(f"Testing word: {word}")
    print(f"URL: {url}")
    print(f"{'='*60}\n")
    
    try:
        response = requests.get(url, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Try different selectors
            synonym_selectors = [
                ('span.syn', 'span.syn'),
                ('div.synonyms span', 'div.synonyms span'),
                ('span[class*="syn"]', 'span with "syn" in class'),
                ('div[class*="synonym"] span', 'div with "synonym" in class'),
                ('span.x', 'span.x (cross-reference)'),
                ('span.xr-gs', 'span.xr-gs (cross-reference group)'),
            ]
            
            print("Searching for synonyms with different selectors:\n")
            
            for selector, description in synonym_selectors:
                elements = soup.select(selector)
                if elements:
                    print(f"✓ Found {len(elements)} elements with selector: {description}")
                    for i, elem in enumerate(elements[:5], 1):
                        text = elem.get_text(strip=True)
                        print(f"  {i}. '{text}'")
                else:
                    print(f"✗ No elements found with selector: {description}")
            
            # Check for any element with "synonym" in class or text
            print("\n" + "="*60)
            print("Searching for any element containing 'synonym':")
            print("="*60 + "\n")
            
            all_elements = soup.find_all(class_=lambda x: x and 'syn' in x.lower())
            if all_elements:
                print(f"Found {len(all_elements)} elements with 'syn' in class:")
                for elem in all_elements[:10]:
                    print(f"  Tag: {elem.name}, Class: {elem.get('class')}, Text: {elem.get_text(strip=True)[:50]}")
            else:
                print("No elements found with 'syn' in class name")
            
        else:
            print(f"Failed to fetch page: HTTP {response.status_code}")
            
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    # Test with common words that should have synonyms
    test_words = ["happy", "good", "beautiful", "sad", "big"]
    
    for word in test_words:
        test_oxford_synonyms(word)
        print("\n" + "="*60 + "\n")
