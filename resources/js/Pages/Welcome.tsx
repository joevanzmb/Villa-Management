import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useRef, useState, ReactNode } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { BedDouble, Bath, Tv, Mic, Utensils, Droplet, Sun, Coffee, Car, Waves, Wifi, Leaf, Footprints, FerrisWheel } from 'lucide-react';
import DateRangePicker from '@/Components/DateRangePicker';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Scroll-reveal wrapper ─── */
function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
    const { ref, isVisible } = useScrollReveal<HTMLDivElement>();
    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                transition: `opacity 0.9s cubic-bezier(.16,1,.3,1) ${delay}s, transform 0.9s cubic-bezier(.16,1,.3,1) ${delay}s`,
            }}
        >
            {children}
        </div>
    );
}

/* ─── Navigation ─── */
interface NavbarProps {
    auth: {
        user: any;
    };
}
function Navbar({ auth }: NavbarProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [visible, setVisible] = useState(true);
    const prevScrollPos = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY;

            setScrolled(currentScrollPos > 60);

            if (currentScrollPos > 60) {
                setVisible(prevScrollPos.current > currentScrollPos);
            } else {
                setVisible(true);
            }

            prevScrollPos.current = currentScrollPos;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 bg-luxury-cream shadow-md ${scrolled ? 'py-2' : 'py-3'
            } ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
                <Link href="/" className="flex items-center">
                    <img src="/images/sani-logo.png" alt="De Villa Sani" className="h-12 md:h-16 w-auto transition-all duration-500" />
                </Link>

                {/* Desktop menu */}
                <div className="hidden md:flex items-center gap-10">
                    {[
                        { label: 'Lokasi', href: '#lokasi' },
                        { label: 'Fasilitas', href: '#fasilitas' },
                        { label: 'Galeri', href: '#galeri' },
                        { label: 'Ulasan', href: '#ulasan' },
                    ].map(link => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-[14px] capitalize tracking-wider font-semibold text-luxury-olive hover:text-luxury-gold transition-colors duration-300"
                        >
                            {link.label}
                        </a>
                    ))}
                    <Link
                        href="/book"
                        className="px-7 py-3 bg-luxury-olive text-white text-[13px] capitalize tracking-widest font-semibold rounded-full hover:bg-luxury-wood hover:shadow-lg transition-all duration-500 hover:-translate-y-0.5"
                    >
                        Pesan Sekarang
                    </Link>
                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden text-luxury-olive p-2 -mr-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isMobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            <div className={`md:hidden absolute top-full left-0 w-full bg-luxury-cream border-t border-luxury-sand/20 shadow-xl overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-[400px] py-4' : 'max-h-0 py-0 border-t-0'}`}>
                <div className="px-6 flex flex-col gap-4">
                    {[
                        { label: 'Lokasi', href: '#lokasi' },
                        { label: 'Fasilitas', href: '#fasilitas' },
                        { label: 'Galeri', href: '#galeri' },
                        { label: 'Ulasan', href: '#ulasan' },
                    ].map(link => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-[15px] capitalize tracking-wide font-medium text-luxury-olive border-b border-luxury-sand/20 pb-3"
                        >
                            {link.label}
                        </a>
                    ))}
                    <Link
                        href="/book"
                        className="w-full text-center px-7 py-3 mt-2 bg-luxury-olive text-white text-[14px] capitalize tracking-wide font-medium rounded-full hover:bg-luxury-wood transition-all duration-500"
                    >
                        Pesan Sekarang
                    </Link>
                </div>
            </div>
        </nav>
    );
}

/* ─── Main Page ─── */
const GALLERY_IMAGES = [
    { src: '/images/cover.jpeg', alt: 'Area Carport Privat yang Luas & Aman (Muat 2 Mobil)', span: 'md:col-span-2 md:row-span-2' },
    { src: '/images/dapur.jpeg', alt: 'Dapur Modern & Aesthetic Lengkap dengan Peralatan Memasak', span: 'md:col-span-1 md:row-span-1' },
    { src: '/images/kamar1.jpeg', alt: 'Kamar Tidur Utama yang Nyaman & Tenang (Lantai 1)', span: 'md:col-span-1 md:row-span-2' },
    { src: '/images/kamar.jpeg', alt: 'Kamar Tidur Kedua dengan Suasana Hangat (Lantai 2)', span: 'md:col-span-1 md:row-span-1' },
    { src: '/images/kamar3.jpeg', alt: 'Kamar Tidur Ketiga yang Sejuk & Nyaman (Lantai 2)', span: 'md:col-span-1 md:row-span-1' },
    { src: '/images/kamarmandi.jpeg', alt: 'Kamar Mandi Bersih Dilengkapi Water Heater / Air Panas', span: 'md:col-span-1 md:row-span-1' },
    { src: '/images/lt2.jpeg', alt: 'Area Koridor Lantai 2 yang Terang & Estetik', span: 'md:col-span-2 md:row-span-1' },
    { src: '/images/ruangmakan.jpeg', alt: 'Ruang Makan Keluarga yang Hangat & Nyaman', span: 'md:col-span-1 md:row-span-1' },
    { src: '/images/ruangtamu.jpeg', alt: 'Ruang Tamu Utama dengan Desain Elegan & Menyambut', span: 'md:col-span-1 md:row-span-2' },
    { src: '/images/sofatv.jpeg', alt: 'Ruang TV & Keluarga yang Luas Dilengkapi Smart TV & Karaoke', span: 'md:col-span-2 md:row-span-2' },
    { src: '/images/ruangtv.jpeg', alt: 'Sudut Bersantai Keluarga yang Lapang & Menenangkan', span: 'md:col-span-1 md:row-span-1' },
];

const FAQ_ITEMS = [
    { q: "Bagaimana lokasi De Villa Sani? Apakah benar dekat dengan Alun-Alun Batu?", a: "Ya, De Villa Sani berada di lokasi yang sangat strategis (0 KM Pusat Kota Batu). Anda hanya perlu berjalan kaki santai sekitar 3-5 menit saja untuk sampai ke Alun-Alun Kota Batu. Sangat praktis, bebas macet, dan tidak perlu pusing mencari tempat parkir." },
    { q: "Berapa kapasitas maksimal tamu di De Villa Sani?", a: "Kapasitas ideal villa kami adalah untuk 6-8 orang (tersedia 3 kamar tidur luas). Namun, kami dapat menampung maksimal hingga 10 tamu rombongan keluarga dengan penambahan ekstra bed (biaya Rp 100.000/malam per bed)." },
    { q: "Apakah ada fasilitas hiburan seperti Karaoke dan Smart TV?", a: "Tentu saja! Kami menyediakan fasilitas Smart TV layar lebar yang sudah terhubung dengan WiFi cepat gratis, lengkap dengan perangkat Karaoke berkualitas untuk menciptakan kehangatan dan keseruan bersama rombongan Anda di malam hari." },
    { q: "Apakah dapur bisa digunakan untuk memasak dan bagaimana dengan area parkirnya?", a: "Dapur kami sudah dilengkapi peralatan masak lengkap, kulkas, penanak nasi, kompor, water dispenser gratis galon, serta complimentary corner (teh, kopi, gula, indomie gratis). Untuk parkir, tersedia area carport privat dan aman di dalam gerbang yang muat hingga 2 mobil keluarga." },
    { q: "Jam berapa ketentuan Check-In dan Check-Out?", a: "Waktu Check-In dimulai dari pukul 14:00 WIB dan waktu Check-Out maksimal pukul 12:00 WIB. Jika Anda memerlukan check-in lebih awal atau check-out lebih lambat (early check-in/late check-out), silakan koordinasikan dengan kami terlebih dahulu (tergantung ketersediaan)." },
    { q: "Apakah diperbolehkan membawa hewan peliharaan (pets) atau merokok di dalam villa?", a: "Mohon maaf, demi menjaga kebersihan lingkungan villa dan kenyamanan tamu berikutnya, kami tidak mengizinkan adanya hewan peliharaan (pets). Merokok juga hanya diperbolehkan di area luar ruangan (teras/balkon), dan dilarang keras merokok di dalam kamar tidur." }
];

export default function Welcome({ auth }: PageProps) {
    const heroRef = useRef<HTMLDivElement>(null);

    // Lightbox state
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    // FAQ state
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    // Access tab state (mobile only)
    const [activeAccessTab, setActiveAccessTab] = useState<'walk' | 'drive'>('walk');

    // Booking states
    const [checkIn, setCheckIn] = useState<string | null>(null);
    const [checkOut, setCheckOut] = useState<string | null>(null);
    const [guests, setGuests] = useState<string>("1-3 Orang");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [availability, setAvailability] = useState<{ available: boolean, price_per_night?: number, total_nights?: number, grand_total?: number, booked_dates?: string[], message?: string } | null>(null);

    const handleCheckAvailability = async (e: React.MouseEvent) => {
        e.preventDefault();
        setError(null);
        setAvailability(null);

        if (!checkIn || !checkOut) {
            setError("Mohon lengkapi tanggal Check-In dan Check-Out terlebih dahulu.");
            return;
        }

        const ci = new Date(checkIn);
        const co = new Date(checkOut);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (ci < today) {
            setError("Tanggal Check-In tidak boleh di masa lalu.");
            return;
        }

        if (co <= ci) {
            setError("Tanggal Check-Out harus setelah Check-In.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('/check-availability', {
                check_in: checkIn,
                check_out: checkOut,
                guests: guests
            });
            setAvailability(response.data);

            // Auto scroll down slightly if available
            if (response.data.available) {
                window.scrollBy({ top: 200, behavior: 'smooth' });
            }
        } catch (err) {
            setError("Terjadi kesalahan sistem saat mengecek ketersediaan.");
        } finally {
            setLoading(false);
        }
    };

    // Parallax effect on hero
    useEffect(() => {
        const onScroll = () => {
            if (heroRef.current) {
                const y = window.scrollY;
                heroRef.current.style.transform = `translateY(${y * 0.35}px) scale(${1 + y * 0.0002})`;
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            <Head>
                <title>De Villa Sani - Villa Keluarga Premium 0 KM Alun-Alun Batu</title>
                <meta name="description" content="Sewa villa keluarga premium di jantung Kota Wisata Batu. Hanya berjalan kaki (0 KM) ke Alun-Alun Batu, fasilitas super lengkap, bersih, mewah, dan anti macet." />
                <meta name="keywords" content="villa batu, sewa villa batu, villa dekat alun alun batu, villa keluarga batu, villa premium batu, penginapan batu, de villa sani, penginapan dekat jatim park" />
                <meta property="og:title" content="De Villa Sani - Villa Premium 0 KM Alun-Alun Batu" />
                <meta property="og:description" content="Sewa villa mewah di pusat Kota Batu. Akses jalan kaki ke Alun-Alun, bebas macet, fasilitas super lengkap untuk keluarga Anda!" />
                <meta property="og:image" content="/images/cover.png" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            <div className="min-h-screen bg-luxury-cream text-luxury-darkgreen overflow-x-hidden selection:bg-luxury-gold/40 selection:text-luxury-darkgreen">

                <Navbar auth={auth} />

                {/* ═══════════════════════════════════════════════════
                    HERO
                ═══════════════════════════════════════════════════ */}
                <header className="relative min-h-[100dvh] flex flex-col justify-end pt-32 pb-12 md:pb-32">
                    {/* Background */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div ref={heroRef} className="absolute inset-0 -top-20 will-change-transform">
                            <img
                                src="/images/batuview.png"
                                alt="De Villa Sani"
                                className="w-full h-[120%] object-cover"
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-b from-luxury-cream/0 via-luxury-cream/80 via-60% to-luxury-cream to-95%" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
                        <h1 className="font-serif font-bold text-5xl sm:text-6xl md:text-6xl lg:text-[6.5rem] text-luxury-olive leading-[1.1] mb-6 md:mb-8 animate-fade-in-up-delay-1 opacity-0 drop-shadow-[0_4px_12px_rgba(255,255,255,0.9)] [text-shadow:0_0_20px_rgba(255,255,255,0.8)]">
                            Vila <span className="text-luxury-gold drop-shadow-[0_0_20px_rgba(201,165,92,0.9)]">0 Km</span> <br />
                            <span className="italic font-bold">Pusat Kota Batu!</span>
                        </h1>
                        <p className="text-luxury-wood text-xs sm:text-sm md:text-lg font-light max-w-4xl leading-relaxed mb-8 md:mb-12 animate-fade-in-up-delay-2 opacity-0 drop-shadow-[0_2px_10px_rgba(255,255,255,0.5)]">
                            Nikmati pengalaman menginap yang tenang di pusat Kota Batu. Hanya beberapa langkah menuju Alun-Alun Batu dengan kenyamanan vila eksklusif untuk keluarga dan sahabat.
                        </p>

                        {/* Booking Widget */}
                        <div className="animate-fade-in-up-delay-3 opacity-0 w-full mt-4 md:mt-16 relative z-50">
                            <div className="bg-white/95 md:bg-white/80 backdrop-blur-xl p-2 md:p-3 rounded-[2rem] md:rounded-full shadow-2xl flex flex-col md:flex-row items-stretch md:items-center border border-white/50 relative">
                                <DateRangePicker
                                    checkIn={checkIn}
                                    checkOut={checkOut}
                                    onChange={(ci, co) => { setCheckIn(ci); setCheckOut(co); setAvailability(null); setError(null); }}
                                    bookedDates={availability?.booked_dates || []}
                                />
                                <div className="flex-1 w-full flex items-center px-5 py-4 border-t md:border-t-0 md:border-l border-luxury-sand/40">
                                    <svg className="w-5 h-5 text-luxury-gold mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                    <div className="flex flex-col w-full">
                                        <span className="text-[10px] uppercase font-bold text-luxury-muted tracking-widest">Tamu</span>
                                        <select
                                            value={guests}
                                            onChange={e => setGuests(e.target.value)}
                                            className="bg-transparent border-none p-0 focus:ring-0 text-sm font-bold text-luxury-darkgreen cursor-pointer w-full appearance-none outline-none"
                                        >
                                            <option value="1-3 Orang">1-3 Orang</option>
                                            <option value="4-6 Orang">4-6 Orang</option>
                                            <option value="7-10 Orang">7-10 Orang</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex-1 w-full flex items-center px-5 py-4 hidden md:flex md:border-l border-luxury-sand/40">
                                    <svg className="w-5 h-5 text-luxury-gold mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <div className="flex flex-col w-full">
                                        <span className="text-[10px] uppercase font-bold text-luxury-muted tracking-widest">Durasi</span>
                                        <div className="text-sm font-bold text-luxury-darkgreen mt-0.5">
                                            {checkIn && checkOut && new Date(checkOut) > new Date(checkIn) ? (
                                                `${Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24)) + 1} Hari ${Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24))} Malam`
                                            ) : (
                                                <span className="text-luxury-darkgreen/40 font-medium">Pilih Tanggal</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-auto p-2 md:p-0">
                                    <button
                                        onClick={handleCheckAvailability}
                                        disabled={loading}
                                        className="w-full bg-luxury-olive text-white px-8 py-4 md:py-5 rounded-2xl md:rounded-full text-[14px] font-medium tracking-wide capitalize hover:bg-luxury-wood transition-all shadow-xl whitespace-nowrap text-center disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Mengecek...' : 'Cek Ketersediaan'}
                                    </button>
                                </div>
                            </div>

                            {/* Error & Scenario Display */}
                            <div className="mt-4 px-4 w-full max-w-3xl mx-auto">
                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/20 text-red-600 px-4 py-2 rounded-lg text-sm flex items-center gap-2 animate-fade-in-up">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        {error}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* ═══════════════════════════════════════════════════
                    LOKASI
                ═══════════════════════════════════════════════════ */}
                <section id="lokasi" className="scroll-mt-16 pt-16 pb-28 md:pt-20 md:pb-36 bg-luxury-cream">
                    <div className="max-w-7xl mx-auto px-6 md:px-12">
                        <Reveal>
                            <div className="text-center mb-16">
                                <span className="text-luxury-gold text-[11px] uppercase tracking-[0.35em] font-bold">Lokasi Kami</span>
                                <h2 className="font-serif text-4xl md:text-5xl mt-4 text-luxury-darkgreen font-bold">Hanya 50m dari Alun-Alun Batu</h2>
                            </div>
                        </Reveal>

                        <Reveal delay={0.2}>
                            <div className="bg-white rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 shadow-xl border border-luxury-sand/50">
                                <div className="flex-1 space-y-6 text-center md:text-left">
                                    <img src="/images/sani-logo.png" alt="De Villa Sani Logo" className="h-16 md:h-20 w-auto mx-auto md:mx-0 mb-2" />
                                    <p className="text-sm text-luxury-charcoal/60 leading-relaxed max-w-lg mx-auto md:mx-0 text-justify md:text-left">
                                        Terletak strategis di pusat Kota Wisata Batu (Jl. Panderman 9A). Nikmati kemudahan akses ke puluhan destinasi ikonik, alun-alun kota, hingga pusat kuliner legendaris hanya dengan berjalan kaki.
                                    </p>
                                    <div className="space-y-3 max-w-lg mx-auto md:mx-0 pt-2 text-left">
                                        {[
                                            { text: "1 Menit (50m) ke Taman & Bianglala Alun-Alun", icon: <FerrisWheel className="w-4 h-4 text-luxury-gold" /> },
                                            { text: "2 Menit ke Pos Ketan Legenda & Sentra Kuliner Malam", icon: <Utensils className="w-4 h-4 text-luxury-gold" /> },
                                            { text: "2 Menit ke Masjid Agung An-Nuur Kota Batu", icon: <svg className="w-4 h-4 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v2" /><path d="M12 4C8.5 4 6 7 6 12v1h12v-1c0-5-2.5-8-6-8z" /><path d="M10 21v-3a2 2 0 1 1 4 0v3" /><path d="M6 21v-4a2 2 0 1 0-4 0v4" /><path d="M22 21v-4a2 2 0 1 0-4 0v4" /><path d="M2 21h20" /></svg> }
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-3 text-xs text-luxury-charcoal/80 font-medium">
                                                <span className="w-7 h-7 rounded-full bg-luxury-gold/10 flex items-center justify-center shrink-0">
                                                    {item.icon}
                                                </span>
                                                <span>{item.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 relative group mt-8 md:mt-0">
                                    <a
                                        href="https://maps.app.goo.gl/XSLxDBriXdieQFz46"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute top-2 right-2 z-20 inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 px-3.5 py-2 text-[10px] font-bold rounded-lg transition-all duration-300 hover:scale-105 shadow-md border border-gray-100 pointer-events-auto"
                                    >
                                        <img src="/images/gmaps.png" alt="Google Maps" className="w-5 h-5 shrink-0 object-contain" />
                                        Buka di Google Maps
                                    </a>
                                    <div className="aspect-video bg-luxury-sand rounded-xl overflow-hidden shadow-inner w-full h-full relative">
                                        <img src="/images/lokasi.png" alt="Area Parkir" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mt-6 md:mt-16">
                            {/* Walking Distance */}
                            <Reveal delay={0.1} className={`[grid-area:1/1] md:[grid-area:auto] ${activeAccessTab === 'walk' ? 'z-10 pointer-events-auto' : 'z-0 pointer-events-none md:pointer-events-auto md:z-auto'}`}>
                                <div className={`bg-white rounded-[2rem] p-8 lg:p-10 shadow-lg border border-luxury-sand/50 h-full flex flex-col transition-opacity duration-500 ${activeAccessTab === 'walk' ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}>
                                    {/* Mobile Toggle inside card */}
                                    <div className="md:hidden flex justify-center mb-8 w-full">
                                        <div className="bg-luxury-sand/30 p-1 rounded-full flex w-full border border-luxury-gold/20 shadow-inner">
                                            <button
                                                onClick={() => setActiveAccessTab('walk')}
                                                className={`flex-1 py-2.5 rounded-full text-[10px] sm:text-[11px] uppercase tracking-widest font-bold transition-all duration-300 ${activeAccessTab === 'walk' ? 'bg-luxury-gold text-luxury-darkgreen shadow-md' : 'text-luxury-charcoal/60 hover:text-luxury-darkgreen'}`}
                                            >
                                                Jalan Kaki
                                            </button>
                                            <button
                                                onClick={() => setActiveAccessTab('drive')}
                                                className={`flex-1 py-2.5 rounded-full text-[10px] sm:text-[11px] uppercase tracking-widest font-bold transition-all duration-300 ${activeAccessTab === 'drive' ? 'bg-luxury-gold text-luxury-darkgreen shadow-md' : 'text-luxury-charcoal/60 hover:text-luxury-darkgreen'}`}
                                            >
                                                Berkendara
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 bg-luxury-gold/10 rounded-full flex items-center justify-center">
                                            <Footprints className="w-6 h-6 text-luxury-gold" strokeWidth={1.5} />
                                        </div>
                                        <h3 className="font-serif text-2xl text-luxury-darkgreen">Akses Jalan Kaki</h3>
                                    </div>
                                    <p className="text-sm text-luxury-olive font-medium mb-6 uppercase tracking-wider">(Walking Distance - Anti Macet & Bebas Parkir)</p>

                                    <ul className="space-y-5 text-luxury-charcoal/80">
                                        <li className="flex justify-between items-start border-b border-luxury-sand/30 pb-3">
                                            <span className="font-medium">Alun-Alun Kota Batu</span>
                                            <span className="text-luxury-gold font-bold text-right ml-4">1 Menit <span className="block text-[10px] font-normal text-luxury-muted">(hanya 50m)</span></span>
                                        </li>
                                        <li className="flex justify-between items-start border-b border-luxury-sand/30 pb-3">
                                            <span className="font-medium">Bianglala & Taman Bermain</span>
                                            <span className="text-luxury-gold font-bold text-right ml-4">1 Menit</span>
                                        </li>
                                        <li className="flex justify-between items-start border-b border-luxury-sand/30 pb-3">
                                            <span className="font-medium">Pos Ketan Legenda 1967</span>
                                            <span className="text-luxury-gold font-bold text-right ml-4">2 Menit</span>
                                        </li>
                                        <li className="flex justify-between items-start border-b border-luxury-sand/30 pb-3">
                                            <span className="font-medium">Masjid Agung An-Nur Batu</span>
                                            <span className="text-luxury-gold font-bold text-right ml-4">2 Menit</span>
                                        </li>
                                        <li className="flex justify-between items-start border-b border-luxury-sand/30 pb-3">
                                            <span className="font-medium">Sentra Kuliner Malam</span>
                                            <span className="text-luxury-gold font-bold text-right ml-4">2 Menit</span>
                                        </li>
                                        <li className="flex justify-between items-start border-b border-luxury-sand/30 pb-3">
                                            <span className="font-medium">Pasar Induk Among Tani</span>
                                            <span className="text-luxury-gold font-bold text-right ml-4">10 Menit <span className="block text-[10px] font-normal text-luxury-muted">(3mnt berkendara)</span></span>
                                        </li>
                                    </ul>
                                </div>
                            </Reveal>

                            {/* Driving Distance */}
                            <Reveal delay={0.2} className={`[grid-area:1/1] md:[grid-area:auto] ${activeAccessTab === 'drive' ? 'z-10 pointer-events-auto' : 'z-0 pointer-events-none md:pointer-events-auto md:z-auto'}`}>
                                <div className={`bg-white rounded-[2rem] p-8 lg:p-10 shadow-lg border border-luxury-sand/50 h-full flex flex-col transition-opacity duration-500 ${activeAccessTab === 'drive' ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}>
                                    {/* Mobile Toggle inside card */}
                                    <div className="md:hidden flex justify-center mb-8 w-full">
                                        <div className="bg-luxury-sand/30 p-1 rounded-full flex w-full border border-luxury-gold/20 shadow-inner">
                                            <button
                                                onClick={() => setActiveAccessTab('walk')}
                                                className={`flex-1 py-2.5 rounded-full text-[10px] sm:text-[11px] uppercase tracking-widest font-bold transition-all duration-300 ${activeAccessTab === 'walk' ? 'bg-luxury-gold text-luxury-darkgreen shadow-md' : 'text-luxury-charcoal/60 hover:text-luxury-darkgreen'}`}
                                            >
                                                Jalan Kaki
                                            </button>
                                            <button
                                                onClick={() => setActiveAccessTab('drive')}
                                                className={`flex-1 py-2.5 rounded-full text-[10px] sm:text-[11px] uppercase tracking-widest font-bold transition-all duration-300 ${activeAccessTab === 'drive' ? 'bg-luxury-gold text-luxury-darkgreen shadow-md' : 'text-luxury-charcoal/60 hover:text-luxury-darkgreen'}`}
                                            >
                                                Berkendara
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 bg-luxury-gold/10 rounded-full flex items-center justify-center">
                                            <Car className="w-6 h-6 text-luxury-gold" strokeWidth={1.5} />
                                        </div>
                                        <h3 className="font-serif text-2xl text-luxury-darkgreen">Akses Berkendara</h3>
                                    </div>
                                    <p className="text-sm text-luxury-olive font-medium mb-6 uppercase tracking-wider">(Driving Distance - Titik Tengah Kota)</p>

                                    <ul className="space-y-4 text-luxury-charcoal/80 text-sm">
                                        <li className="flex justify-between border-b border-luxury-sand/30 pb-2">
                                            <span>Lippo Plaza Batu (Batos)</span>
                                            <span className="text-luxury-gold font-bold">3-5 Menit <span className="font-normal text-luxury-muted text-[10px]">(± 1 km)</span></span>
                                        </li>
                                        <li className="flex justify-between border-b border-luxury-sand/30 pb-2">
                                            <span>Museum Angkut</span>
                                            <span className="text-luxury-gold font-bold">5-7 Menit <span className="font-normal text-luxury-muted text-[10px]">(± 1.5 km)</span></span>
                                        </li>
                                        <li className="flex justify-between border-b border-luxury-sand/30 pb-2">
                                            <span>Jatim Park 1 & D'Topeng</span>
                                            <span className="text-luxury-gold font-bold">5-7 Menit <span className="font-normal text-luxury-muted text-[10px]">(± 1.5 km)</span></span>
                                        </li>
                                        <li className="flex justify-between border-b border-luxury-sand/30 pb-2">
                                            <span>Klub Bunga Butik Resort</span>
                                            <span className="text-luxury-gold font-bold">7 Menit <span className="font-normal text-luxury-muted text-[10px]">(± 2 km)</span></span>
                                        </li>
                                        <li className="flex justify-between border-b border-luxury-sand/30 pb-2">
                                            <span>Jatim Park 2 & Eco Green</span>
                                            <span className="text-luxury-gold font-bold">8-10 Menit <span className="font-normal text-luxury-muted text-[10px]">(± 2.5 km)</span></span>
                                        </li>
                                        <li className="flex justify-between border-b border-luxury-sand/30 pb-2">
                                            <span>Kusuma Agrowisata</span>
                                            <span className="text-luxury-gold font-bold">10-12 Menit <span className="font-normal text-luxury-muted text-[10px]">(± 3 km)</span></span>
                                        </li>
                                        <li className="flex justify-between border-b border-luxury-sand/30 pb-2">
                                            <span>Batu Night Spectacular</span>
                                            <span className="text-luxury-gold font-bold">10-12 Menit <span className="font-normal text-luxury-muted text-[10px]">(± 3.5 km)</span></span>
                                        </li>
                                        <li className="flex justify-between border-b border-luxury-sand/30 pb-2">
                                            <span>Air Panas Songgoriti</span>
                                            <span className="text-luxury-gold font-bold">10-15 Menit <span className="font-normal text-luxury-muted text-[10px]">(± 3.5 km)</span></span>
                                        </li>
                                        <li className="flex justify-between border-b border-luxury-sand/30 pb-2">
                                            <span>Jatim Park 3 (Dino Park)</span>
                                            <span className="text-luxury-gold font-bold">15-20 Menit <span className="font-normal text-luxury-muted text-[10px]">(± 5 km)</span></span>
                                        </li>
                                        <li className="flex justify-between border-b border-luxury-sand/30 pb-2">
                                            <span>Taman Rekreasi Selecta</span>
                                            <span className="text-luxury-gold font-bold">20 Menit <span className="font-normal text-luxury-muted text-[10px]">(± 6.5 km)</span></span>
                                        </li>
                                    </ul>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════
                    FASILITAS
                ═══════════════════════════════════════════════════ */}
                <section id="fasilitas" className="scroll-mt-16 pt-16 pb-28 md:pt-20 md:pb-36 bg-white rounded-t-[3rem] md:rounded-t-[4rem] relative z-10">
                    <div className="max-w-7xl mx-auto px-6 md:px-12">
                        <Reveal>
                            <div className="text-center mb-20 flex flex-col items-center">
                                <div className="w-16 h-[2px] bg-luxury-gold mb-6" />
                                <h2 className="font-serif text-4xl md:text-5xl font-bold">
                                    <span className="text-luxury-olive">Fasilitas Lengkap</span>
                                    <span className="text-luxury-charcoal/20">, </span>
                                    <span className="text-luxury-wood">Staycation Nyaman</span>
                                </h2>
                            </div>
                        </Reveal>

                        <div className="grid md:grid-cols-2 gap-8">
                            {[
                                {
                                    title: "Kamar & Relaksasi",
                                    icon: <BedDouble className="w-6 h-6 text-luxury-gold" strokeWidth={1.5} />,
                                    items: [
                                        "3 Kamar Tidur Luas untuk istirahat yang optimal.",
                                        "3 Kamar Mandi Air Panas (Water Heater) untuk melawan dinginnya udara Batu.",
                                        "Balkon Santai Lantai 2, titik pas untuk menikmati udara segar pagi hari."
                                    ]
                                },
                                {
                                    title: "Hiburan & Konektivitas",
                                    icon: <Mic className="w-6 h-6 text-luxury-gold" strokeWidth={1.5} />,
                                    items: [
                                        "Smart TV & WiFi bebas akses untuk streaming film favorit.",
                                        "Fasilitas Karaoke, ciptakan kehangatan dan keseruan bersama."
                                    ]
                                },
                                {
                                    title: "Dapur & Ruang Makan",
                                    icon: <Utensils className="w-6 h-6 text-luxury-gold" strokeWidth={1.5} />,
                                    items: [
                                        "Dapur Lengkap beserta seluruh peralatan masak dan makan.",
                                        "Water Dispenser (Gratis 1 Galon).",
                                        "Complimentary Corner: Tersedia kopi, teh, gula, dan sajian instan (Indomie) gratis untuk menemani waktu santai Anda."
                                    ]
                                },
                                {
                                    title: "Area Parkir (Carport)",
                                    icon: <Car className="w-6 h-6 text-luxury-gold" strokeWidth={1.5} />,
                                    items: [
                                        "Tersedia area carport privat dengan kapasitas hingga 2 mobil.",
                                        "Area parkir ini dirancang tertutup/aman, memberikan ketenangan ekstra bagi Anda yang membawa kendaraan pribadi selama masa liburan di Kota Batu."
                                    ]
                                }
                            ].map((card, idx) => (
                                <Reveal key={idx} delay={idx * 0.1}>
                                    <div className="bg-luxury-cream/40 p-8 rounded-[2rem] border border-luxury-sand/30 hover:bg-white hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col h-full">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                {card.icon}
                                            </div>
                                            <h3 className="font-serif text-xl text-luxury-darkgreen font-bold">{card.title}</h3>
                                        </div>
                                        <ul className="space-y-4 flex-1">
                                            {card.items.map((item, itemIdx) => (
                                                <li key={itemIdx} className="flex gap-3 text-sm text-luxury-charcoal/70 leading-relaxed font-light">
                                                    <svg className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="bg-white">
                    <section id="galeri" className="scroll-mt-16 pt-16 pb-28 md:pt-20 md:pb-36 bg-luxury-beige rounded-t-[3rem] md:rounded-t-[4rem] relative z-10">
                        <div className="max-w-7xl mx-auto px-6 md:px-12">
                            <Reveal>
                                <div className="text-center mb-16 flex flex-col items-center">
                                    <div className="w-16 h-[2px] bg-luxury-gold mb-6" />
                                    <h2 className="font-serif text-4xl md:text-5xl font-bold flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
                                        <span className="text-luxury-darkgreen">Sudut Nyaman di</span>
                                        <img src="/images/sani-logo.png" alt="De Villa Sani Logo" className="h-20 md:h-32 w-auto" />
                                    </h2>
                                </div>
                            </Reveal>

                            {/* Bento Grid Layout */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[140px] sm:auto-rows-[160px] md:auto-rows-[200px] lg:auto-rows-[240px]">
                                {GALLERY_IMAGES.map((img, idx) => (
                                    <Reveal key={idx} delay={idx * 0.08} className={`${img.span} overflow-hidden rounded-2xl shadow-md`}>
                                        <div
                                            className="relative w-full h-full group cursor-pointer"
                                            onClick={() => setLightboxIndex(idx)}
                                        >
                                            <img
                                                src={img.src}
                                                alt={img.alt}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.2s] ease-out"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-500 flex items-center justify-center">
                                                <span className="text-white text-xs uppercase tracking-[0.2em] font-bold border border-white/40 px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">Zoom Foto</span>
                                            </div>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

                {/* Lightbox Modal */}
                {lightboxIndex !== null && (
                    <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 md:p-8 select-none">
                        {/* Close Button */}
                        <button
                            className="absolute top-4 right-4 text-white/75 hover:text-white p-2 text-3xl font-light focus:outline-none transition-colors duration-300"
                            onClick={() => setLightboxIndex(null)}
                        >
                            &times;
                        </button>

                        {/* Prev Arrow */}
                        <button
                            className="absolute left-4 md:left-8 text-white/50 hover:text-white p-3 text-4xl focus:outline-none transition-colors duration-300"
                            onClick={() => setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : GALLERY_IMAGES.length - 1))}
                        >
                            &#10094;
                        </button>

                        {/* Image & Thumbnails container */}
                        <div className="max-w-5xl max-h-[85vh] flex flex-col items-center gap-4 w-full">
                            <img
                                src={GALLERY_IMAGES[lightboxIndex].src}
                                alt={GALLERY_IMAGES[lightboxIndex].alt}
                                className="max-w-full max-h-[55vh] md:max-h-[60vh] object-contain rounded-lg shadow-2xl"
                            />
                            <div className="text-center">
                                <p className="text-white/80 text-sm tracking-wide font-light">
                                    {GALLERY_IMAGES[lightboxIndex].alt} ({lightboxIndex + 1} / {GALLERY_IMAGES.length})
                                </p>
                            </div>

                            {/* Horizontal Thumbnails List */}
                            <div className="flex gap-2 overflow-x-auto py-2 px-4 max-w-full justify-start md:justify-center scrollbar-none w-full">
                                {GALLERY_IMAGES.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setLightboxIndex(idx)}
                                        className={`relative w-14 h-10 md:w-20 md:h-14 rounded-lg overflow-hidden shrink-0 transition-all duration-300 border-2 ${lightboxIndex === idx
                                                ? 'border-luxury-gold scale-105 opacity-100 shadow-md'
                                                : 'border-transparent opacity-40 hover:opacity-80'
                                            }`}
                                    >
                                        <img src={img.src} alt={img.alt} className="w-full h-full object-cover pointer-events-none" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Next Arrow */}
                        <button
                            className="absolute right-4 md:right-8 text-white/50 hover:text-white p-3 text-4xl focus:outline-none transition-colors duration-300"
                            onClick={() => setLightboxIndex((prev) => (prev !== null && prev < GALLERY_IMAGES.length - 1 ? prev + 1 : 0))}
                        >
                            &#10095;
                        </button>
                    </div>
                )}

                <div className="bg-luxury-beige">
                    <section id="ulasan" className="scroll-mt-16 pt-16 pb-28 md:pt-20 md:pb-36 bg-white rounded-t-[3rem] md:rounded-t-[4rem] relative z-10">
                        <div className="max-w-7xl mx-auto px-6 md:px-12">
                            <Reveal>
                                <div className="text-center mb-16">
                                    <span className="text-luxury-gold text-[11px] uppercase tracking-[0.35em] font-bold">Ulasan Tamu</span>
                                    <h2 className="font-serif text-4xl md:text-5xl mt-4 text-luxury-darkgreen font-bold">Kata Mereka Tentang Kami</h2>
                                </div>
                            </Reveal>
                            <div className="grid md:grid-cols-3 gap-8">
                                {[
                                    { name: "Budi Santoso", text: "Villa nya nyaman banget, bersih, dan lokasinya beneran strategis. Cocok buat bawa keluarga besar liburan ke Batu!", rate: 5 },
                                    { name: "Siti Aminah", text: "Fasilitas lengkap, anak-anak betah sekali bernyanyi pakai fasilitas Karaoke dan Smart TV. Hawanya sejuk, bersih, dan bikin betah.", rate: 5 },
                                    { name: "Andi Wijaya", text: "Pengalaman menginap yang luar biasa. Akses ke alun-alun gampang banget, tinggal jalan kaki. Recommended!", rate: 5 }
                                ].map((review, idx) => (
                                    <Reveal key={idx} delay={idx * 0.15}>
                                        <div className="bg-luxury-cream/40 p-8 rounded-[2rem] border border-luxury-sand/30 hover:bg-white hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                                            <div className="flex gap-1 mb-4">
                                                {[...Array(review.rate)].map((_, i) => (
                                                    <svg key={i} className="w-5 h-5 text-luxury-gold" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
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
                </div>

                {/* ═══════════════════════════════════════════════════
                    FAQ
                ═══════════════════════════════════════════════════ */}
                <div className="bg-white">
                    <section id="faq" className="scroll-mt-16 pt-16 pb-28 md:pt-20 md:pb-36 bg-luxury-beige rounded-t-[3rem] md:rounded-t-[4rem] relative z-10">
                        <div className="max-w-4xl mx-auto px-6 md:px-12">
                            <Reveal>
                                <div className="text-center mb-16 flex flex-col items-center justify-center w-full">
                                    <span className="text-luxury-gold text-[11px] uppercase tracking-[0.35em] font-bold">FAQ</span>
                                    <h2 className="font-serif text-xl sm:text-2xl md:text-4xl lg:text-5xl mt-4 text-luxury-darkgreen font-bold sm:whitespace-nowrap text-center">
                                        Pertanyaan yang Sering Diajukan
                                    </h2>
                                </div>
                            </Reveal>
                            <div className="space-y-4">
                                {FAQ_ITEMS.map((faq, idx) => {
                                    const isOpen = openFaqIndex === idx;
                                    return (
                                        <Reveal key={idx} delay={idx * 0.08}>
                                            <div className="bg-white rounded-2xl border border-luxury-sand/50 shadow-sm overflow-hidden transition-all duration-300">
                                                <button
                                                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                                                    className="w-full flex items-center justify-between text-left p-6 font-serif text-base md:text-lg text-luxury-darkgreen font-bold focus:outline-none"
                                                >
                                                    <span className="pr-4">{faq.q}</span>
                                                    <span className={`transform transition-transform duration-300 bg-luxury-cream p-2 rounded-full text-luxury-olive shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                    </span>
                                                </button>
                                                <AnimatePresence initial={false}>
                                                    {isOpen && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                                                        >
                                                            <div className="px-6 pb-6 text-sm md:text-base text-luxury-charcoal/70 leading-relaxed border-t border-luxury-sand/20 pt-4">
                                                                {faq.a}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </Reveal>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                </div>
                {/* ═══════════════════════════════════════════════════
                    CTA (Pre-Footer)
                ═══════════════════════════════════════════════════ */}
                <section className="relative py-24 md:py-32 overflow-hidden bg-luxury-olive">
                    <div className="absolute inset-0">
                        <img
                            src="/images/ruangtamu.jpeg"
                            alt=""
                            className="w-full h-full object-cover object-center opacity-30 mix-blend-overlay"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-luxury-olive via-transparent to-luxury-olive/50" />
                    </div>

                    <Reveal>
                        <div className="relative z-10 max-w-5xl mx-auto px-6 flex flex-col items-center text-center">
                            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-white mb-6 leading-tight md:whitespace-nowrap">
                                Siap Menikmati Liburan Terbaik <span className="italic font-bold text-luxury-gold">di Kota Batu?</span>
                            </h2>
                            <p className="text-white/70 font-light text-base md:text-lg mb-12 max-w-2xl leading-relaxed">
                                Pilih tanggal menginap Anda sekarang dan rasakan kenyamanan vila keluarga yang berlokasi hanya selangkah dari Alun-Alun Batu.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                                <Link
                                    href="/book"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-luxury-gold text-luxury-darkgreen px-8 py-4 text-xs md:text-sm uppercase tracking-widest font-bold rounded-full hover:bg-white hover:text-luxury-darkgreen hover:shadow-lg transition-all duration-300"
                                >
                                    Pesan Sekarang
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </Link>
                                <a
                                    href="https://wa.me/6281231150451"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-transparent border-2 border-luxury-gold text-luxury-gold px-8 py-4 text-xs md:text-sm uppercase tracking-widest font-bold rounded-full hover:bg-luxury-gold hover:text-luxury-darkgreen transition-all duration-300"
                                >
                                    Chat Admin
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                                </a>
                            </div>
                        </div>
                    </Reveal>
                </section>

                {/* ═══════════════════════════════════════════════════
                    FOOTER
                ═══════════════════════════════════════════════════ */}
                <footer className="bg-luxury-cream text-luxury-darkgreen py-16 border-t border-luxury-sand/30 relative z-10">
                    <div className="max-w-7xl mx-auto px-6 md:px-12">
                        <div className="grid md:grid-cols-3 gap-12 mb-12">
                            <div>
                                <img src="/images/sani-logo.png" alt="De Villa Sani" className="h-12 w-auto mb-6" />
                                <h3 className="font-serif text-lg text-luxury-darkgreen mb-2 leading-tight">
                                    Vila 0 Km <br /> Pusat Kota Batu!
                                </h3>
                                <p className="text-sm font-light leading-relaxed text-luxury-olive">
                                    Nikmati pengalaman menginap yang tenang di pusat Kota Batu. Hanya beberapa langkah menuju Alun-Alun Batu dengan kenyamanan vila eksklusif untuk keluarga dan sahabat.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-[11px] uppercase tracking-[0.25em] text-luxury-gold font-bold mb-4">Navigasi</h4>
                                <div className="flex flex-col gap-3">
                                    <a href="#lokasi" className="text-sm hover:text-luxury-gold transition-colors text-luxury-olive">Lokasi</a>
                                    <a href="#fasilitas" className="text-sm hover:text-luxury-gold transition-colors text-luxury-olive">Fasilitas</a>
                                    <a href="#galeri" className="text-sm hover:text-luxury-gold transition-colors text-luxury-olive">Galeri</a>
                                    <a href="#ulasan" className="text-sm hover:text-luxury-gold transition-colors text-luxury-olive">Ulasan</a>
                                    <Link href="/book" className="text-sm hover:text-luxury-gold transition-colors text-luxury-olive">Cek Ketersediaan</Link>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-[11px] uppercase tracking-[0.25em] text-luxury-gold font-bold mb-4">Kontak</h4>
                                <div className="flex flex-col gap-3 text-sm text-luxury-charcoal/80">
                                    <span>Jl. Panderman 9A, Kota Batu</span>
                                    <span>Jawa Timur, Indonesia</span>
                                    <span>0812-3115-0451</span>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-luxury-sand/30 pt-8 text-center text-xs text-luxury-muted flex flex-col gap-2">
                            <span>© {new Date().getFullYear()} De Villa Sani. Hak Cipta Dilindungi.</span>
                            <span className="text-[11px] opacity-75">
                                <span className="italic">Website designed & developed by</span> <span className="font-bold">sitezet.com</span>
                            </span>
                        </div>
                    </div>
                </footer>

                {/* ═══════════════════════════════════════════════════
                    MODAL KETERSEDIAAN VILA
                ═══════════════════════════════════════════════════ */}
                {availability && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-fade-in" onClick={() => setAvailability(null)} />

                        <div className={`relative w-full max-w-[600px] rounded-[32px] p-8 md:p-10 shadow-2xl animate-scale-in ${availability.available ? 'bg-gradient-to-br from-[#FAF6ED] via-white to-[#FDFBF7] border border-luxury-gold/30' : 'bg-red-50 border border-red-200'}`}>
                            {/* Tombol Tutup */}
                            <button
                                onClick={() => setAvailability(null)}
                                className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/5 text-luxury-muted hover:text-luxury-charcoal transition-colors z-20"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>

                            {availability.available ? (
                                <div className="flex flex-col gap-8 relative group">

                                    <div className="flex flex-col items-center text-center gap-5 relative z-10">
                                        <div className="w-20 h-20 bg-luxury-olive/10 rounded-full flex items-center justify-center relative shrink-0">
                                            <div className="absolute inset-0 bg-luxury-olive rounded-full animate-ping opacity-20"></div>
                                            <svg className="w-10 h-10 text-luxury-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        </div>

                                        <div>
                                            <h3 className="text-2xl md:text-3xl font-serif font-bold text-luxury-darkgreen mb-3">
                                                Kabar Baik! Vila Tersedia.
                                            </h3>
                                            <p className="text-luxury-charcoal text-[10px] md:text-sm flex items-center justify-center gap-1 md:gap-2">
                                                <span className="shrink-0 inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                                <span>Pesan sekarang sebelum tanggal ini diambil orang lain!</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-luxury-sand/20 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-5 border border-luxury-sand/40 relative z-10">
                                        <div className="text-center md:text-left">
                                            <span className="text-[11px] uppercase tracking-widest font-bold text-luxury-muted block mb-1">Total Biaya ({availability.total_nights} Malam)</span>
                                            <span className="text-2xl md:text-3xl font-bold text-luxury-gold">Rp {availability.grand_total?.toLocaleString('id-ID')}</span>
                                        </div>

                                        <Link
                                            href={`/book?check_in=${checkIn}&check_out=${checkOut}&guests=${encodeURIComponent(guests)}`}
                                            className="relative overflow-hidden bg-luxury-olive text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[11px] hover:bg-luxury-wood transition-all shadow-xl shadow-luxury-olive/30 w-full md:w-auto text-center group/btn hover:-translate-y-1"
                                        >
                                            <div className="absolute top-0 -left-[100%] h-full w-full z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                                            Amankan Tanggal Ini
                                            <svg className="w-4 h-4 inline-block ml-2 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-center gap-6 p-4">
                                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center">
                                        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl md:text-3xl font-serif font-bold text-red-700 mb-3">
                                            Oops, {availability.message}
                                        </h3>
                                        <p className="text-luxury-charcoal text-sm leading-relaxed">
                                            Silakan tutup pesan ini dan buka kembali kalender. Tanggal yang ditandai <b>coretan abu-abu</b> berarti sudah penuh. Silakan pilih kombinasi tanggal lain yang masih tersedia.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setAvailability(null)}
                                        className="bg-red-50 border border-red-200 text-red-700 px-10 py-4 rounded-full font-bold uppercase tracking-widest text-[11px] hover:bg-red-100 hover:border-red-300 transition-all w-full md:w-auto text-center mt-2"
                                    >
                                        Tutup & Coba Lagi
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
