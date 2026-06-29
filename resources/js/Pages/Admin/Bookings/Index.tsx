import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
    bookings: { data: any[]; links: any[]; current_page: number; last_page: number };
    filters: { status?: string; search?: string };
}

export default function BookingsIndex({ bookings, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const applyFilter = (key: string, value: string) => {
        router.get(route('admin.bookings.index'), { ...filters, [key]: value || undefined }, { preserveState: true, replace: true });
    };

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
        Pending: 'Menunggu',
        Confirmed: 'Dikonfirmasi',
        Cancelled: 'Dibatalkan',
        Completed: 'Selesai',
    };

    return (
        <AdminLayout title="Manajemen Pesanan">
            <Head title="Pesanan" />

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input
                        type="text"
                        placeholder="Cari nama atau email tamu..."
                        className="w-full pl-10 pr-4 py-3 bg-white border border-luxury-sand/50 rounded-xl text-sm focus:ring-luxury-gold focus:border-luxury-gold transition-colors"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && applyFilter('search', search)}
                    />
                </div>
                <div className="flex gap-2">
                    {['', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(s => (
                        <button
                            key={s}
                            onClick={() => applyFilter('status', s)}
                            className={`px-4 py-2 rounded-xl text-[11px] uppercase tracking-[0.1em] font-bold transition-all duration-300 ${
                                (filters.status || '') === s
                                    ? 'bg-luxury-darkgreen text-white shadow-lg'
                                    : 'bg-white text-luxury-muted border border-luxury-sand/50 hover:border-luxury-darkgreen'
                            }`}
                        >
                            {s ? (statusLabel[s] || s) : 'Semua'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-luxury-sand/30 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-[#F8F7F4]">
                                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-[0.15em] text-luxury-muted font-bold">ID</th>
                                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-[0.15em] text-luxury-muted font-bold">Tamu</th>
                                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-[0.15em] text-luxury-muted font-bold">Check-in</th>
                                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-[0.15em] text-luxury-muted font-bold">Check-out</th>
                                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-[0.15em] text-luxury-muted font-bold">Malam</th>
                                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-[0.15em] text-luxury-muted font-bold">Total</th>
                                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-[0.15em] text-luxury-muted font-bold">Status</th>
                                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-[0.15em] text-luxury-muted font-bold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.data.length > 0 ? bookings.data.map((b: any) => (
                                <tr key={b.id} className="border-t border-luxury-sand/20 hover:bg-luxury-cream/30 transition-colors">
                                    <td className="px-6 py-4 font-mono text-luxury-muted text-xs">#{b.id}</td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-luxury-darkgreen">{b.customer?.name || '—'}</p>
                                            <p className="text-[11px] text-luxury-muted">{b.customer?.email || ''}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-luxury-muted">{b.check_in}</td>
                                    <td className="px-6 py-4 text-luxury-muted">{b.check_out}</td>
                                    <td className="px-6 py-4 text-luxury-muted">{b.total_nights}</td>
                                    <td className="px-6 py-4 font-medium">Rp {parseInt(b.grand_total).toLocaleString('id-ID')}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${statusBadge(b.status)}`}>
                                            {statusLabel[b.status] || b.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={route('admin.bookings.show', b.id)} className="text-luxury-gold hover:text-luxury-wood text-[11px] uppercase tracking-[0.1em] font-bold transition-colors">
                                            Detail
                                        </Link>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={8} className="px-6 py-16 text-center text-luxury-muted">Tidak ada pesanan ditemukan.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {bookings.last_page > 1 && (
                    <div className="px-6 py-4 border-t border-luxury-sand/30 flex items-center justify-between">
                        <p className="text-[11px] text-luxury-muted">Halaman {bookings.current_page} dari {bookings.last_page}</p>
                        <div className="flex gap-1">
                            {bookings.links.map((link: any, i: number) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                                        link.active ? 'bg-luxury-darkgreen text-white' : 'text-luxury-muted hover:bg-luxury-sand/30'
                                    } ${!link.url ? 'opacity-30 pointer-events-none' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
