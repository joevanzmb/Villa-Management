import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VillaEdit({ villa }: { villa: any }) {
    const { data, setData, patch, processing, errors } = useForm({
        name: villa.name || '',
        description: villa.description || '',
        price_per_night: villa.price_per_night || 0,
        max_guests: villa.max_guests || 1,
        bedrooms: villa.bedrooms || 1,
        bathrooms: villa.bathrooms || 1,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('admin.villas.update', villa.id));
    };

    const labelClass = "block text-[11px] uppercase tracking-[0.2em] font-bold text-luxury-muted mb-2";
    const inputClass = "w-full bg-transparent border-0 border-b-2 border-luxury-sand focus:border-luxury-gold focus:ring-0 px-0 py-3 text-luxury-darkgreen text-sm transition-colors duration-300";

    return (
        <AdminLayout title={`Edit: ${villa.name}`}>
            <Head title={`Edit ${villa.name}`} />

            <Link href={route('admin.villas.index')} className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.15em] text-luxury-muted hover:text-luxury-darkgreen mb-8 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Kembali ke Daftar Villa
            </Link>

            <div className="max-w-2xl">
                <div className="bg-white rounded-2xl p-8 border border-luxury-sand/30">
                    <h2 className="font-serif text-2xl mb-8">Informasi Villa</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className={labelClass}>Nama Villa</label>
                            <input type="text" className={inputClass} value={data.name} onChange={e => setData('name', e.target.value)} />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>Deskripsi</label>
                            <textarea rows={4} className={inputClass + ' resize-none'} value={data.description} onChange={e => setData('description', e.target.value)} />
                        </div>

                        <div>
                            <label className={labelClass}>Harga per Malam (Rp)</label>
                            <input type="number" min="0" className={inputClass} value={data.price_per_night} onChange={e => setData('price_per_night', parseInt(e.target.value))} />
                            {errors.price_per_night && <p className="text-red-500 text-xs mt-1">{errors.price_per_night}</p>}
                        </div>

                        <div className="grid grid-cols-3 gap-8">
                            <div>
                                <label className={labelClass}>Maks Tamu</label>
                                <input type="number" min="1" className={inputClass} value={data.max_guests} onChange={e => setData('max_guests', parseInt(e.target.value))} />
                            </div>
                            <div>
                                <label className={labelClass}>Kamar Tidur</label>
                                <input type="number" min="1" className={inputClass} value={data.bedrooms} onChange={e => setData('bedrooms', parseInt(e.target.value))} />
                            </div>
                            <div>
                                <label className={labelClass}>Kamar Mandi</label>
                                <input type="number" min="1" className={inputClass} value={data.bathrooms} onChange={e => setData('bathrooms', parseInt(e.target.value))} />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-luxury-gold text-luxury-darkgreen py-4 text-[11px] uppercase tracking-[0.2em] font-bold rounded-full hover:bg-luxury-darkgreen hover:text-luxury-gold transition-all duration-500 disabled:opacity-50 hover:shadow-xl mt-4"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
