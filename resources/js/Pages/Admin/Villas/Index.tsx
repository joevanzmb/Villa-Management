import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function VillasIndex({ villas }: { villas: any[] }) {
    return (
        <AdminLayout title="Manajemen Villa">
            <Head title="Villa" />

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {villas.map((v: any) => (
                    <div key={v.id} className="bg-white rounded-2xl border border-luxury-sand/30 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-500 group">
                        <div className="h-44 bg-luxury-beige relative overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                                alt={v.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        <div className="p-6">
                            <h3 className="font-serif text-lg text-luxury-darkgreen mb-2">{v.name}</h3>
                            <p className="text-sm text-luxury-muted line-clamp-2 mb-4">{v.description}</p>

                            <div className="flex gap-4 mb-4 text-[11px] text-luxury-muted">
                                <span>{v.bedrooms} Kamar</span>
                                <span>•</span>
                                <span>Maks {v.max_guests} Tamu</span>
                                <span>•</span>
                                <span>{v.bookings_count || 0} Pesanan</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="font-serif text-lg text-luxury-gold">Rp {parseInt(v.price_per_night).toLocaleString('id-ID')}<span className="text-xs text-luxury-muted font-sans">/malam</span></span>
                                <Link href={route('admin.villas.edit', v.id)} className="text-[11px] uppercase tracking-[0.1em] font-bold text-luxury-gold hover:text-luxury-wood transition-colors">
                                    Edit
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
