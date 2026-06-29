import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

interface DashboardProps {
    stats: {
        totalBookings: number;
        pendingBookings: number;
        confirmedBookings: number;
        totalRevenue: number;
        totalCustomers: number;
        totalVillas: number;
    };
    recentBookings: any[];
}

export default function Dashboard({ stats, recentBookings }: DashboardProps) {
    const statCards = [
        { label: 'Total Pesanan', value: stats.totalBookings, color: 'bg-blue-50 text-blue-600', icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
        )},
        { label: 'Menunggu Konfirmasi', value: stats.pendingBookings, color: 'bg-amber-50 text-amber-600', icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        )},
        { label: 'Dikonfirmasi', value: stats.confirmedBookings, color: 'bg-emerald-50 text-emerald-600', icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        )},
        { label: 'Total Pendapatan', value: `Rp ${stats.totalRevenue.toLocaleString('id-ID')}`, color: 'bg-luxury-gold/10 text-luxury-gold', icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        )},
    ];

    const statusBadge = (status: string) => {
        const map: Record<string, string> = {
            'Pending': 'bg-amber-100 text-amber-700',
            'Confirmed': 'bg-emerald-100 text-emerald-700',
            'Cancelled': 'bg-red-100 text-red-700',
            'Completed': 'bg-blue-100 text-blue-700',
        };
        return map[status] || 'bg-gray-100 text-gray-700';
    };

    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard Admin" />

            {/* Stat Cards */}
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
                {statCards.map((card, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-6 border border-luxury-sand/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-500">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-11 h-11 rounded-xl ${card.color} flex items-center justify-center`}>
                                {card.icon}
                            </div>
                        </div>
                        <p className="text-[11px] uppercase tracking-[0.15em] text-luxury-muted font-medium">{card.label}</p>
                        <p className="font-serif text-2xl mt-1 text-luxury-darkgreen">{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Recent Bookings Table */}
            <div className="bg-white rounded-2xl border border-luxury-sand/30 overflow-hidden">
                <div className="px-6 py-5 border-b border-luxury-sand/30 flex items-center justify-between">
                    <h2 className="font-serif text-lg text-luxury-darkgreen">Pesanan Terbaru</h2>
                    <Link href={(() => { try { return route('admin.bookings.index'); } catch { return '#'; } })()} className="text-[11px] uppercase tracking-[0.15em] text-luxury-gold hover:text-luxury-wood transition-colors font-medium">
                        Lihat Semua →
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-[#F8F7F4]">
                                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-[0.15em] text-luxury-muted font-bold">ID</th>
                                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-[0.15em] text-luxury-muted font-bold">Tamu</th>
                                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-[0.15em] text-luxury-muted font-bold">Check-in</th>
                                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-[0.15em] text-luxury-muted font-bold">Check-out</th>
                                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-[0.15em] text-luxury-muted font-bold">Total</th>
                                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-[0.15em] text-luxury-muted font-bold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentBookings && recentBookings.length > 0 ? recentBookings.map((b: any) => (
                                <tr key={b.id} className="border-t border-luxury-sand/20 hover:bg-luxury-cream/30 transition-colors">
                                    <td className="px-6 py-4 font-mono text-luxury-muted text-xs">#{b.id}</td>
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-luxury-darkgreen">{b.customer?.name || '—'}</span>
                                    </td>
                                    <td className="px-6 py-4 text-luxury-muted">{b.check_in}</td>
                                    <td className="px-6 py-4 text-luxury-muted">{b.check_out}</td>
                                    <td className="px-6 py-4 font-medium">Rp {parseInt(b.grand_total).toLocaleString('id-ID')}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${statusBadge(b.status)}`}>
                                            {b.status}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-luxury-muted">
                                        Belum ada pesanan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
