import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

interface Props {
    customers: { data: any[]; links: any[]; current_page: number; last_page: number };
}

export default function CustomersIndex({ customers }: Props) {
    return (
        <AdminLayout title="Daftar Pelanggan">
            <Head title="Pelanggan" />

            <div className="bg-white rounded-2xl border border-luxury-sand/30 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-[#F8F7F4]">
                                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-[0.15em] text-luxury-muted font-bold">ID</th>
                                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-[0.15em] text-luxury-muted font-bold">Nama</th>
                                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-[0.15em] text-luxury-muted font-bold">Email</th>
                                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-[0.15em] text-luxury-muted font-bold">Telepon</th>
                                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-[0.15em] text-luxury-muted font-bold">Total Pesanan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.data.length > 0 ? customers.data.map((c: any) => (
                                <tr key={c.id} className="border-t border-luxury-sand/20 hover:bg-luxury-cream/30 transition-colors">
                                    <td className="px-6 py-4 font-mono text-luxury-muted text-xs">#{c.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-luxury-gold/20 flex items-center justify-center text-luxury-gold font-bold text-xs">
                                                {c.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-luxury-darkgreen">{c.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-luxury-muted">{c.email}</td>
                                    <td className="px-6 py-4 text-luxury-muted">{c.phone}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-block px-3 py-1 rounded-full bg-luxury-cream text-luxury-darkgreen text-[10px] uppercase tracking-wider font-bold">
                                            {c.bookings_count || 0} pesanan
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center text-luxury-muted">Belum ada pelanggan.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
