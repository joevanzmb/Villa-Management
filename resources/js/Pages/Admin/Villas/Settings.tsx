import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function VillaSettings({ villa }: { villa: any }) {
    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        name: villa.name || '',
        description: villa.description || '',
        weekday_price: villa.weekday_price || '',
        weekend_price: villa.weekend_price || '',
        extra_bed_price: villa.extra_bed_price || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('admin.villas.updateSettings'));
    };

    return (
        <AdminLayout title="Pengaturan Harga & Villa">
            <Head title="Pengaturan Harga" />

            <div className="max-w-3xl bg-white rounded-2xl border border-luxury-sand/30 overflow-hidden shadow-sm">
                <div className="p-6 md:p-8">
                    <form onSubmit={submit} className="space-y-6">
                        
                        <div>
                            <h3 className="text-lg font-serif text-luxury-darkgreen mb-4 border-b border-luxury-sand/30 pb-2">Detail Dasar</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-luxury-charcoal mb-1">Nama Penginapan</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full rounded-xl border-luxury-sand/50 shadow-sm focus:border-luxury-gold focus:ring focus:ring-luxury-gold/20 text-sm"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-luxury-charcoal mb-1">Deskripsi Singkat</label>
                                    <textarea
                                        rows={3}
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        className="w-full rounded-xl border-luxury-sand/50 shadow-sm focus:border-luxury-gold focus:ring focus:ring-luxury-gold/20 text-sm"
                                    />
                                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <h3 className="text-lg font-serif text-luxury-darkgreen mb-4 border-b border-luxury-sand/30 pb-2">Pengaturan Harga (Rupiah)</h3>
                            <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-luxury-charcoal mb-1">Harga Weekday (Senin - Kamis)</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">Rp</span>
                                            </div>
                                            <input
                                                type="number"
                                                value={data.weekday_price}
                                                onChange={e => setData('weekday_price', e.target.value)}
                                                className="w-full pl-10 rounded-xl border-luxury-sand/50 shadow-sm focus:border-luxury-gold focus:ring focus:ring-luxury-gold/20 text-sm"
                                            />
                                        </div>
                                        {errors.weekday_price && <p className="text-red-500 text-xs mt-1">{errors.weekday_price}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-luxury-charcoal mb-1">Harga Weekend (Jumat - Minggu)</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">Rp</span>
                                            </div>
                                            <input
                                                type="number"
                                                value={data.weekend_price}
                                                onChange={e => setData('weekend_price', e.target.value)}
                                                className="w-full pl-10 rounded-xl border-luxury-sand/50 shadow-sm focus:border-luxury-gold focus:ring focus:ring-luxury-gold/20 text-sm"
                                            />
                                        </div>
                                        {errors.weekend_price && <p className="text-red-500 text-xs mt-1">{errors.weekend_price}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-luxury-charcoal mb-1">Biaya Tambahan (Extra Bed 7-10 Orang)</label>
                                    <div className="relative max-w-[50%]">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">Rp</span>
                                        </div>
                                        <input
                                            type="number"
                                            value={data.extra_bed_price}
                                            onChange={e => setData('extra_bed_price', e.target.value)}
                                            className="w-full pl-10 rounded-xl border-luxury-sand/50 shadow-sm focus:border-luxury-gold focus:ring focus:ring-luxury-gold/20 text-sm"
                                        />
                                    </div>
                                    <p className="text-xs text-luxury-muted mt-1">Biaya ini akan ditambahkan ke total harga per malam jika tamu memilih kapasitas 7-10 Orang.</p>
                                    {errors.extra_bed_price && <p className="text-red-500 text-xs mt-1">{errors.extra_bed_price}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-6 border-t border-luxury-sand/30">
                            <button
                                disabled={processing}
                                className="px-6 py-2.5 bg-luxury-gold hover:bg-luxury-gold/90 text-white text-sm font-medium rounded-xl shadow-lg shadow-luxury-gold/20 transition-all hover:-translate-y-0.5 disabled:opacity-50"
                            >
                                Simpan Pengaturan
                            </button>
                            
                            {recentlySuccessful && (
                                <p className="text-sm text-green-600 font-medium">Berhasil disimpan.</p>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
