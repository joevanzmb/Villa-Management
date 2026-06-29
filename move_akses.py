import re

with open('resources/js/Pages/Welcome.tsx', 'r') as f:
    content = f.read()

# The file contains sections separated by {/* ════════...
parts = content.split('{/* ════════')

header_part = parts[0]
section_parts = {}
section_order = []

for p in parts[1:]:
    lines = p.split('\n')
    name_line = lines[1].strip()
    section_parts[name_line] = '{/* ════════' + p
    section_order.append(name_line)

lokasi = section_parts['LOKASI']
akses = section_parts['AKSES LOKASI / BRANDING']

# Extract the grid containing the two cards from AKSES
# It starts with <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
grid_start_idx = akses.find('<div className="grid md:grid-cols-2 gap-12 lg:gap-16">')
grid_end_idx = akses.rfind('</div>\n                    </div>\n                </section>')

if grid_start_idx != -1 and grid_end_idx != -1:
    cards_content = akses[grid_start_idx:grid_end_idx + 6] # include the closing </div> of the grid
    
    # modify the class to add top margin
    cards_content = cards_content.replace('<div className="grid md:grid-cols-2 gap-12 lg:gap-16">', '<div className="grid md:grid-cols-2 gap-12 lg:gap-16 mt-16">')
    
    # Now insert into LOKASI section, right before the closing </div>\n                </section>
    lokasi_end_idx = lokasi.rfind('</div>\n                </section>')
    if lokasi_end_idx != -1:
        new_lokasi = lokasi[:lokasi_end_idx] + '    ' + cards_content + '\n                    ' + lokasi[lokasi_end_idx:]
        section_parts['LOKASI'] = new_lokasi
        
        # Remove AKSES from section_order
        section_order.remove('AKSES LOKASI / BRANDING')
        
        # Rebuild file
        new_content = [header_part]
        for name in section_order:
            new_content.append(section_parts[name])
            
        with open('resources/js/Pages/Welcome.tsx', 'w') as f:
            f.write(''.join(new_content))
        print("Success")
    else:
        print("Lokasi end not found")
else:
    print("Akses grid not found")

