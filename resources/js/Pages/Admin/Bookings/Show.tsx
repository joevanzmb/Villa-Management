import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function BookingShow({ booking }: { booking: any }) {
    const statusBadge = (status: string) => {
        const m: Record<string, string> = {
            Pending: 'bg-amber-100 text-amber-700',
            Confirmed: 'bg-emerald-100 text-emerald-700',
            Cancelled: 'bg-red-100 text-red-700',
            Completed: 'bg-blue-100 text-blue-700',
        };
        return m[status] || 'bg-gray-100 text-gray-600';
    };

    const statusLabel: Record<string, string> = {
        Pending: 'Menunggu', Confirmed: 'Dikonfirmasi', Cancelled: 'Dibatalkan', Completed: 'Selesai',
    };

    const updateStatus = (status: string) => {
        if (confirm(`Ubah status pesanan menjadi "${statusLabel[status]}"?`)) {
            router.patch(route('admin.bookings.updateStatus', booking.id), { status });
        }
    };

    const Row = ({ label, value }: { label: string; value: string }) => (
        <div className="flex justify-between py-3 border-b border-luxury-sand/20 last:border-0">
            <span className="text-luxury-muted text-sm">{label}</span>
            <span className="text-sm font-medium text-luxury-darkgreen">{value}</span>
        </div>
    );

    return (
        <AdminLayout title={`Pesanan #${booking.id}`}>
            <Head title={`Pesanan #${booking.id}`} />

            <Link href={route('admin.bookings.index')} className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.15em] text-luxury-muted hover:text-luxury-darkgreen mb-8 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Kembali ke Daftar Pesanan
            </Link>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl p-8 border border-luxury-sand/30">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-serif text-xl">Detail Reservasi</h2>
                            <span className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-bold ${statusBadge(booking.status)}`}>
                                {statusLabel[booking.status] || booking.status}
                            </span>
                        </div>
                        <Row label="Tanggal Check-in" value={booking.check_in} />
                        <Row label="Tanggal Check-out" value={booking.check_out} />
                        <Row label="Jumlah Malam" value={`${booking.total_nights} malam`} />
                        <Row label="Jumlah Tamu" value={`${booking.guest_count} orang`} />
                        <Row label="Harga per Malam" value={`Rp ${parseInt(booking.price_per_night).toLocaleString('id-ID')}`} />
                        <Row label="Total Pembayaran" value={`Rp ${parseInt(booking.grand_total).toLocaleString('id-ID')}`} />
                        {booking.special_request && (
                            <div className="pt-4">
                                <p className="text-[11px] uppercase tracking-[0.15em] text-luxury-muted font-bold mb-2">Permintaan Khusus</p>
                                <p className="text-sm text-luxury-charcoal/70 italic bg-luxury-cream/50 rounded-xl p-4">{booking.special_request}</p>
                            </div>
                        )}
                    </div>

                    {/* Customer Info */}
                    <div className="bg-white rounded-2xl p-8 border border-luxury-sand/30">
                        <h2 className="font-serif text-xl mb-6">Informasi Tamu</h2>
                        <Row label="Nama" value={booking.customer?.name || '—'} />
                        <Row label="Email" value={booking.customer?.email || '—'} />
                        <Row label="Telepon" value={booking.customer?.phone || '—'} />
                    </div>
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-6">
                    {/* Payment Info */}
                    <div className="bg-white rounded-2xl p-6 border border-luxury-sand/30">
                        <h3 className="font-serif text-lg mb-4">Pembayaran</h3>
                        {booking.payment ? (
                            <>
                                <Row label="ID Transaksi" value={booking.payment.transaction_id || '—'} />
                                <Row label="Jumlah" value={`Rp ${parseInt(booking.payment.amount).toLocaleString('id-ID')}`} />
                                <Row label="Status" value={booking.payment.status} />
                                <Row label="Metode" value={booking.payment.payment_type || '—'} />
                            </>
                        ) : (
                            <p className="text-sm text-luxury-muted">Belum ada data pembayaran.</p>
                        )}
                    </div>

                    {/* Status Actions */}
                    <div className="bg-white rounded-2xl p-6 border border-luxury-sand/30">
                        <h3 className="font-serif text-lg mb-4">Ubah Status</h3>
                        <div className="space-y-2">
                            {(['Confirmed', 'Completed', 'Cancelled'] as const).map(s => (
                                <button
                                    key={s}
                                    onClick={() => updateStatus(s)}
                                    disabled={booking.status === s}
                                    className={`w-full py-3 rounded-xl text-[11px] uppercase tracking-[0.15em] font-bold transition-all duration-300 ${
                                        booking.status === s
                                            ? 'bg-luxury-sand/30 text-luxury-muted cursor-not-allowed'
                                            : s === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                            : s === 'Completed' ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                                            : 'bg-red-50 text-red-700 hover:bg-red-100'
                                    }`}
                                >
                                    {statusLabel[s]}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
