#!/usr/bin/env python3
"""
Script to check 16KB alignment of native libraries in APK.
Works on both macOS and Linux.
"""
import os
import sys
import struct
import zipfile
import tempfile
import shutil

REQUIRED_ALIGNMENT = 0x4000  # 16KB = 16384 = 0x4000

def is_elf_file(filepath):
    """Check if file is an ELF file."""
    try:
        with open(filepath, 'rb') as f:
            magic = f.read(4)
            return magic == b'\x7fELF'
    except:
        return False

def get_elf_alignment(filepath):
    """Get alignment from ELF file program headers."""
    if not is_elf_file(filepath):
        return None
    
    try:
        with open(filepath, 'rb') as f:
            data = bytearray(f.read())
        
        # Check ELF class (32-bit or 64-bit)
        if len(data) < 5:
            return None
        
        elf_class = data[4]  # EI_CLASS
        endian = '<'  # Assume little-endian (Android uses this)
        
        # Check endianness
        if data[5] == 2:  # ELFDATA2MSB (big-endian)
            endian = '>'
        
        # ELF header field offsets
        if elf_class == 1:  # 32-bit ELF
            e_phoff = 28
            e_phentsize = 42
            e_phnum = 44
            ph_p_align_offset = 28  # p_align is at offset 28 in 32-bit program header
        elif elf_class == 2:  # 64-bit ELF
            e_phoff = 32
            e_phentsize = 54
            e_phnum = 56
            ph_p_align_offset = 48  # p_align is at offset 48 in 64-bit program header
        else:
            return None
        
        if len(data) < (e_phnum + 2):
            return None
        
        # Get program header table info
        phoff = struct.unpack_from(endian + ('I' if elf_class == 1 else 'Q'), data, e_phoff)[0]
        phentsize = struct.unpack_from(endian + 'H', data, e_phentsize)[0]
        phnum = struct.unpack_from(endian + 'H', data, e_phnum)[0]
        
        if phoff == 0 or phnum == 0:
            return None
        
        if len(data) < (phoff + phnum * phentsize):
            return None
        
        # Get alignment from all LOAD segments (return the maximum alignment)
        max_align = 0
        found_load = False
        
        for i in range(phnum):
            ph_offset = phoff + (i * phentsize)
            
            if ph_offset + phentsize > len(data):
                continue
            
            # Read segment type (first field in program header)
            p_type = struct.unpack_from(endian + 'I', data, ph_offset)[0]
            
            if p_type == 1:  # PT_LOAD
                found_load = True
                p_align_offset = ph_offset + ph_p_align_offset
                
                if p_align_offset + 4 <= len(data):
                    alignment = struct.unpack_from(endian + 'I', data, p_align_offset)[0]
                    # For 64-bit, p_align is 8 bytes, but we only read 4 bytes
                    # That's okay, the lower 4 bytes should be enough for alignment values
                    if alignment > max_align:
                        max_align = alignment
        
        # Return the maximum alignment found, or None if no LOAD segments
        return max_align if found_load and max_align > 0 else None
        
    except Exception as e:
        # Debug: uncomment to see errors
        # print(f"Error reading {filepath}: {e}")
        return None

def check_apk(apk_path):
    """Check alignment of .so files in APK."""
    if not os.path.exists(apk_path):
        print(f"Error: APK file not found: {apk_path}")
        return False
    
    print(f"Checking 16KB alignment for native libraries in: {apk_path}")
    print("=" * 60)
    
    # Extract APK
    temp_dir = tempfile.mkdtemp()
    try:
        with zipfile.ZipFile(apk_path, 'r') as zip_ref:
            zip_ref.extractall(temp_dir)
        
        # Find all .so files
        so_files = []
        for root, dirs, files in os.walk(temp_dir):
            for file in files:
                if file.endswith('.so'):
                    so_files.append(os.path.join(root, file))
        
        if not so_files:
            print("No .so files found in APK")
            return True
        
        aligned_count = 0
        not_aligned_count = 0
        error_count = 0
        
        for so_file in sorted(so_files):
            rel_path = os.path.relpath(so_file, temp_dir)
            alignment = get_elf_alignment(so_file)
            
            if alignment is None:
                # Try to get more info about why it failed
                if is_elf_file(so_file):
                    file_size = os.path.getsize(so_file)
                    print(f"⚠️  Could not read alignment: {rel_path} (file size: {file_size} bytes)")
                else:
                    print(f"⚠️  Not a valid ELF file: {rel_path}")
                error_count += 1
            elif alignment >= REQUIRED_ALIGNMENT:
                # Alignment is >= 16KB, which is acceptable
                print(f"✅ OK: {rel_path} (alignment=0x{alignment:x})")
                aligned_count += 1
            else:
                print(f"❌ NOT 16KB aligned: {rel_path} (alignment=0x{alignment:x})")
                not_aligned_count += 1
        
        print("=" * 60)
        if not_aligned_count == 0 and error_count == 0:
            print(f"✅ All {aligned_count} native libraries are 16KB+ aligned!")
            return True
        else:
            if not_aligned_count > 0:
                print(f"❌ Found {not_aligned_count} libraries that are NOT 16KB aligned")
            if aligned_count > 0:
                print(f"✅ Found {aligned_count} libraries that are correctly aligned (>=16KB)")
            if error_count > 0:
                print(f"⚠️  Could not check {error_count} libraries")
            return not_aligned_count == 0
    
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python3 check_alignment.py <path-to-apk>")
        sys.exit(1)
    
    apk_path = sys.argv[1]
    success = check_apk(apk_path)
    sys.exit(0 if success else 1)

