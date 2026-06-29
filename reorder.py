import re

with open('resources/js/Pages/Welcome.tsx', 'r') as f:
    content = f.read()

parts = content.split('{/* ════════')

header_part = parts[0]
section_parts = {}

for p in parts[1:]:
    lines = p.split('\n')
    name_line = lines[1].strip()
    section_parts[name_line] = '{/* ════════' + p

# Modify Lokasi
section_parts['LOKASI'] = section_parts['LOKASI'].replace('/images/garasi.jpeg', '/images/lokasi.png')

ulasan_section = """{/* ═══════════════════════════════════════════════════
                    ULASAN
                ═══════════════════════════════════════════════════ */}
                <section id="ulasan" className="scroll-mt-24 py-28 md:py-36 bg-white">
                    <div className="max-w-7xl mx-auto px-6 md:px-12">
                        <Reveal>
                            <div className="text-center mb-16">
                                <span className="text-luxury-gold text-[11px] uppercase tracking-[0.35em] font-bold">Ulasan Tamu</span>
                                <h2 className="font-serif text-4xl md:text-5xl mt-4 text-luxury-darkgreen">Kata Mereka Tentang Kami</h2>
                            </div>
                        </Reveal>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { name: "Budi Santoso", text: "Villa nya nyaman banget, bersih, dan lokasinya beneran strategis. Cocok buat bawa keluarga besar liburan ke Batu!", rate: 5 },
                                { name: "Siti Aminah", text: "Fasilitas lengkap, anak-anak suka banget main di kolam renangnya. Hawanya sejuk dan bikin betah.", rate: 5 },
                                { name: "Andi Wijaya", text: "Pengalaman menginap yang luar biasa. Akses ke alun-alun gampang banget, tinggal jalan kaki. Recommended!", rate: 5 }
                            ].map((review, idx) => (
                                <Reveal key={idx} delay={idx * 0.15}>
                                    <div className="bg-luxury-cream/40 p-8 rounded-[2rem] border border-luxury-sand/30 hover:bg-white hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                                        <div className="flex gap-1 mb-4">
                                            {[...Array(review.rate)].map((_, i) => (
                                                <svg key={i} className="w-5 h-5 text-luxury-gold" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                            ))}
                                        </div>
                                        <p className="text-luxury-charcoal/70 italic mb-6">"{review.text}"</p>
                                        <div className="font-bold text-luxury-darkgreen">- {review.name}</div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>
"""

faq_section = """{/* ═══════════════════════════════════════════════════
                    FAQ
                ═══════════════════════════════════════════════════ */}
                <section id="faq" className="scroll-mt-24 py-28 md:py-36 bg-luxury-beige">
                    <div className="max-w-4xl mx-auto px-6 md:px-12">
                        <Reveal>
                            <div className="text-center mb-16">
                                <span className="text-luxury-gold text-[11px] uppercase tracking-[0.35em] font-bold">FAQ</span>
                                <h2 className="font-serif text-4xl md:text-5xl mt-4 text-luxury-darkgreen">Pertanyaan yang Sering Diajukan</h2>
                            </div>
                        </Reveal>
                        <div className="space-y-4">
                            {[
                                { q: "Berapa kapasitas maksimal tamu di De Villa Sani?", a: "Kapasitas standar adalah 6 orang. Namun, villa kami dapat menampung hingga maksimal 10 orang dengan tambahan biaya ekstra bed sebesar Rp 100.000/malam untuk tamu ke-7 hingga ke-10." },
                                { q: "Apakah ada fasilitas kolam renang?", a: "Ya, kami menyediakan kolam renang anak yang bersih dan terawat untuk bersantai bersama keluarga." },
                                { q: "Jam berapa waktu check-in dan check-out?", a: "Waktu check-in dimulai dari pukul 14:00 WIB, dan waktu check-out maksimal pukul 12:00 WIB." },
                                { q: "Apakah diperbolehkan membawa hewan peliharaan (pets)?", a: "Mohon maaf, demi kenyamanan seluruh tamu dan menjaga kebersihan villa, kami belum mengizinkan tamu untuk membawa hewan peliharaan." }
                            ].map((faq, idx) => (
                                <Reveal key={idx} delay={idx * 0.1}>
                                    <details className="group bg-white rounded-2xl border border-luxury-sand/50 shadow-sm [&_summary::-webkit-details-marker]:hidden">
                                        <summary className="flex items-center justify-between cursor-pointer p-6 font-serif text-lg text-luxury-darkgreen font-bold">
                                            {faq.q}
                                            <span className="transition group-open:rotate-180 bg-luxury-cream p-2 rounded-full text-luxury-olive">
                                                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                            </span>
                                        </summary>
                                        <div className="px-6 pb-6 text-luxury-charcoal/70 leading-relaxed">
                                            {faq.a}
                                        </div>
                                    </details>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>
"""

# Now assemble
new_content = [
    header_part,
    section_parts['HERO'],
    section_parts['LOKASI'],
    section_parts['AKSES LOKASI / BRANDING'],
    section_parts['FASILITAS'],
    section_parts['GALERI'],
    ulasan_section,
    faq_section,
    section_parts['CTA'],
    section_parts['FOOTER'],
    section_parts['MODAL KETERSEDIAAN VILA']
]

# Note: We omit 'TENTANG KAMI'

final_content = ''.join(new_content)

with open('resources/js/Pages/Welcome.tsx', 'w') as f:
    f.write(final_content)

