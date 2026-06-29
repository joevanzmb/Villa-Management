import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import DateRangePicker from '@/Components/DateRangePicker';

declare global {
    interface Window { snap: any; }
}

export default function Book({ villa }: { villa: any }) {
    const [data, setData] = useState({
        name: '', email: '', phone: '',
        check_in: '', check_out: '',
        guest_count: '1-3 Orang', special_request: '',
    });
    const [totalNights, setTotalNights] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: dates, 2: info, 3: confirm

    // Pre-fill data from query params if available
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const ci = params.get('check_in');
        const co = params.get('check_out');
        const gcRaw = params.get('guests');

        let gc = '1-3 Orang';
        if (gcRaw && ['1-3 Orang', '4-6 Orang', '7-10 Orang'].includes(gcRaw)) {
            gc = gcRaw;
        }

        if (ci || co || gcRaw) {
            setData(prev => ({
                ...prev,
                check_in: ci || prev.check_in,
                check_out: co || prev.check_out,
                guest_count: gc
            }));
        }
    }, []);

    useEffect(() => {
        if (data.check_in && data.check_out) {
            const inD = new Date(data.check_in);
            const outD = new Date(data.check_out);

            inD.setHours(0, 0, 0, 0);
            outD.setHours(0, 0, 0, 0);

            if (outD > inD) {
                const diff = Math.ceil(Math.abs(outD.getTime() - inD.getTime()) / 86400000);
                setTotalNights(diff);

                let total = 0;
                let current = new Date(inD);

                while (current < outD) {
                    const day = current.getDay(); // 0 = Sunday, 1 = Monday, ... 6 = Saturday
                    // Jumat(5), Sabtu(6), Minggu(0) = 600rb
                    let nightPrice = (day === 5 || day === 6 || day === 0) ? 600000 : 400000;

                    if (data.guest_count === '7-10 Orang') {
                        nightPrice += 100000;
                    }

                    total += nightPrice;
                    current.setDate(current.getDate() + 1);
                }

                setGrandTotal(total);
            } else { setTotalNights(0); setGrandTotal(0); }
        }
    }, [data.check_in, data.check_out, data.guest_count]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('/book', data);
            window.snap.pay(res.data.snap_token, {
                onSuccess: () => { alert('Pembayaran Berhasil!'); window.location.href = '/'; },
                onPending: () => { alert('Menunggu pembayaran Anda!'); window.location.href = '/'; },
                onError: () => alert('Pembayaran gagal!'),
                onClose: () => alert('Popup ditutup sebelum pembayaran selesai'),
            });
        } catch { alert('Terjadi kesalahan'); }
        finally { setLoading(false); }
    };

    const inputClass = "w-full bg-[#FAF6ED]/50 border border-luxury-sand/50 focus:bg-white focus:border-luxury-gold focus:ring-4 focus:ring-luxury-gold/10 rounded-2xl px-5 py-4 text-luxury-darkgreen placeholder:text-luxury-muted/50 transition-all duration-300 text-sm outline-none";
    const labelClass = "block text-xs font-bold text-luxury-darkgreen mb-3 ml-1";

    const canProceedStep1 = data.check_in && data.check_out && totalNights > 0;
    const canProceedStep2 = data.name && data.email && data.phone;

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans text-luxury-darkgreen">
            <Head title="Pesan Penginapan — Villa Murah 0KM Batu" />

            {/* Top Bar */}
            <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-700 bg-luxury-cream shadow-md py-3">
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
                    <Link href="/" className="flex items-center">
                        <img src="/images/sani-logo.png" alt="De Villa Sani" className="h-12 md:h-16 w-auto transition-all duration-500" />
                    </Link>
                    <div className="flex items-center">
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-5 py-2.5 md:px-7 md:py-3 bg-luxury-olive text-white text-[13px] md:text-[14px] capitalize tracking-wide font-medium rounded-full hover:bg-luxury-wood hover:shadow-xl transition-all duration-500 hover:-translate-y-0.5"
                        >
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            <span className="hidden md:inline">Kembali ke Home</span>
                            <span className="inline md:hidden">Kembali</span>
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto pt-32 pb-16 px-6 md:px-12">

                <div className="grid lg:grid-cols-5 gap-10 lg:gap-14">

                    {/* Form Area (3 cols) */}
                    <div className="lg:col-span-3">
                        <form onSubmit={handleSubmit}>
                            {/* Step 1: Pemesanan */}
                            <div className={`transition-all duration-500 ${step === 1 ? 'opacity-100' : 'hidden'}`}>
                                <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-xl shadow-black/5 border border-luxury-sand/20 space-y-12">

                                    {/* Section 1: Dates */}
                                    <div>
                                        <h2 className="font-serif text-2xl md:text-4xl font-bold mb-2 md:mb-3">Pilih Tanggal Menginap</h2>
                                        <p className="text-luxury-muted text-xs md:text-sm mb-8 md:mb-10">Tentukan kapan Anda ingin berlibur di De Villa Sani.</p>

                                        <div className="w-full">
                                            <div className="border border-luxury-sand/40 rounded-3xl flex flex-col md:flex-row items-center bg-white shadow-sm">
                                                <DateRangePicker
                                                    checkIn={data.check_in}
                                                    checkOut={data.check_out}
                                                    onChange={(ci, co) => setData({ ...data, check_in: ci || '', check_out: co || '' })}
                                                    bookedDates={villa?.booked_dates || []}
                                                    popupPosition="bottom"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-8">
                                            <label className={labelClass}>Jumlah Tamu</label>
                                            <select required className={inputClass}
                                                value={data.guest_count} onChange={e => setData({ ...data, guest_count: e.target.value })}
                                            >
                                                <option value="1-3 Orang">1-3 Orang</option>
                                                <option value="4-6 Orang">4-6 Orang</option>
                                                <option value="7-10 Orang">7-10 Orang</option>
                                            </select>
                                            <div className="flex gap-2 mt-3 p-3 md:p-4 bg-luxury-olive/5 rounded-2xl border border-luxury-olive/10 text-[10px] md:text-xs text-luxury-charcoal">
                                                <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-luxury-olive shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                <p>Maksimal 6 tamu. Ada tambahan ekstra bed Rp 100.000/malam untuk opsi 7-10 Orang.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="border-luxury-sand/30" />

                                    {/* Section 2: Guest Info */}
                                    <div>
                                        <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2 md:mb-3">Informasi Pemesan</h2>
                                        <p className="text-luxury-muted text-xs md:text-sm mb-8 md:mb-10">Isi data diri Anda untuk proses reservasi.</p>

                                        <div className="space-y-6">
                                            <div>
                                                <label className={labelClass}>Nama Lengkap</label>
                                                <input type="text" required placeholder="Sesuai KTP/Paspor" className={inputClass}
                                                    value={data.name} onChange={e => setData({ ...data, name: e.target.value })} />
                                            </div>
                                            <div className="grid sm:grid-cols-2 gap-8">
                                                <div>
                                                    <label className={labelClass}>Email</label>
                                                    <input type="email" required placeholder="email@contoh.com" className={inputClass}
                                                        value={data.email} onChange={e => setData({ ...data, email: e.target.value })} />
                                                </div>
                                                <div>
                                                    <label className={labelClass}>Nomor Telepon / WhatsApp</label>
                                                    <input type="tel" required placeholder="08xxxxxxxxxx" className={inputClass}
                                                        value={data.phone} onChange={e => setData({ ...data, phone: e.target.value })} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        disabled={!canProceedStep1 || !canProceedStep2}
                                        onClick={() => setStep(2)}
                                        className="mt-12 w-full bg-luxury-olive text-white py-5 text-xs uppercase tracking-widest font-bold rounded-full hover:bg-luxury-wood transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-luxury-olive/30 hover:-translate-y-1 flex items-center justify-center gap-2"
                                    >
                                        Lanjutkan Konfirmasi <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                    </button>
                                </div>
                            </div>

                            {/* Step 2: Konfirmasi */}
                            <div className={`transition-all duration-500 ${step === 2 ? 'opacity-100' : 'hidden'}`}>
                                <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-xl shadow-black/5 border border-luxury-sand/20">
                                    <button type="button" onClick={() => setStep(1)} className="text-luxury-muted text-xs font-bold uppercase tracking-widest hover:text-luxury-darkgreen transition-colors mb-8 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                        Kembali ke Pemesanan
                                    </button>
                                    <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3">Konfirmasi Pesanan</h2>
                                    <p className="text-luxury-muted text-sm mb-10">Pastikan semua data sudah benar sebelum melanjutkan ke pembayaran.</p>

                                    <div className="space-y-4 text-sm bg-[#FAF6ED]/50 p-6 rounded-2xl border border-luxury-sand/50">
                                        {[
                                            { label: 'Nama', value: data.name },
                                            { label: 'Email', value: data.email },
                                            { label: 'Telepon', value: data.phone },
                                            { label: 'Check-in', value: data.check_in ? new Date(data.check_in).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '' },
                                            { label: 'Check-out', value: data.check_out ? new Date(data.check_out).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '' },
                                            { label: 'Jumlah Tamu', value: data.guest_count },
                                        ].map(row => (
                                            <div key={row.label} className="flex justify-between py-3 border-b border-luxury-sand/30 last:border-0">
                                                <span className="text-luxury-muted">{row.label}</span>
                                                <span className="font-bold">{row.value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="relative overflow-hidden mt-12 w-full bg-luxury-olive text-white py-5 text-xs uppercase tracking-widest font-bold rounded-full hover:bg-luxury-wood transition-all duration-300 disabled:opacity-50 shadow-xl shadow-luxury-olive/30 hover:-translate-y-1 group/btn"
                                    >
                                        <div className="absolute top-0 -left-[100%] h-full w-full z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                                                Memproses...
                                            </span>
                                        ) : 'Bayar Sekarang'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Sidebar Summary (2 cols) */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-luxury-sand/30 sticky top-32">
                            <div className="relative h-48">
                                <img src="/images/cover.jpeg" alt="Villa" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-4 left-6 right-6">
                                    <h3 className="font-serif text-xl text-white">{villa.name}</h3>
                                    <p className="text-white/60 text-xs flex items-center gap-1 mt-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                                        Kota Batu, Jawa Timur
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 space-y-5">

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-luxury-muted">Tanggal</span>
                                        <span className="font-medium text-right">{data.check_in && data.check_out ? `${new Date(data.check_in).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - ${new Date(data.check_out).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}` : '—'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-luxury-muted">Durasi Menginap</span>
                                        <span className="font-medium">{totalNights > 0 ? `${totalNights + 1} Hari ${totalNights} Malam` : '—'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-luxury-muted">Opsi Tamu</span>
                                        <span className="font-medium">{data.guest_count}</span>
                                    </div>
                                    {(data.name || data.email || data.phone) && (
                                        <>
                                            <div className="h-[1px] bg-luxury-sand/30 my-1" />
                                            {data.name && (
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-luxury-muted whitespace-nowrap">Pemesan</span>
                                                    <span className="font-medium text-right break-words">{data.name}</span>
                                                </div>
                                            )}
                                            {data.email && (
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-luxury-muted whitespace-nowrap">Email</span>
                                                    <span className="font-medium text-right break-all">{data.email}</span>
                                                </div>
                                            )}
                                            {data.phone && (
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-luxury-muted whitespace-nowrap">Telepon</span>
                                                    <span className="font-medium text-right break-words">{data.phone}</span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                <div className="h-[1px] bg-luxury-sand/50" />

                                <div className="flex justify-between items-end">
                                    <div>
                                        <span className="text-[10px] uppercase tracking-[0.15em] text-luxury-muted block">Total Pembayaran</span>
                                    </div>
                                    <span className="font-serif text-2xl text-luxury-gold font-bold">
                                        {grandTotal > 0 ? `Rp ${grandTotal.toLocaleString('id-ID')}` : '—'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
