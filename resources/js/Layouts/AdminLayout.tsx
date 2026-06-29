import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';

const navItems = [
    { label: 'Dashboard', route: 'dashboard', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    )},
    { label: 'Pesanan', route: 'admin.bookings.index', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
    )},
    { label: 'Villa', route: 'admin.villas.index', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
    )},
    { label: 'Pelanggan', route: 'admin.customers.index', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
    )},
];

export default function AdminLayout({ children, title }: PropsWithChildren<{ title?: string }>) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isActive = (routeName: string) => {
        try { return route().current(routeName); } catch { return false; }
    };

    return (
        <div className="min-h-screen bg-[#F8F7F4] font-sans flex">

            {/* Sidebar - Desktop */}
            <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-luxury-darkgreen text-white fixed inset-y-0 left-0 z-40">
                {/* Logo */}
                <div className="px-6 pt-8 pb-6">
                    <Link href="/" className="block">
                        <img src="/images/sani-logo.svg" alt="De Villa Sani" className="h-10 w-auto" />
                    </Link>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mt-1">Panel Administrasi</p>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-4 space-y-1">
                    {navItems.map(item => (
                        <Link
                            key={item.route}
                            href={(() => { try { return route(item.route); } catch { return '#'; } })()}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                                isActive(item.route)
                                    ? 'bg-white/15 text-white shadow-lg shadow-black/10'
                                    : 'text-white/50 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* User card */}
                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <div className="w-9 h-9 rounded-full bg-luxury-gold/30 flex items-center justify-center text-luxury-gold font-bold text-sm">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user.name}</p>
                            <p className="text-[11px] text-white/40 truncate">{user.email}</p>
                        </div>
                    </div>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full mt-2 flex items-center gap-2 px-4 py-2 text-white/40 hover:text-red-400 text-sm transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Keluar
                    </Link>
                </div>
            </aside>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                    <aside className="relative w-64 bg-luxury-darkgreen text-white h-full flex flex-col">
                        <div className="px-6 pt-8 pb-6 flex justify-between items-start">
                            <div>
                                <img src="/images/sani-logo.svg" alt="De Villa Sani" className="h-8 w-auto" />
                                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mt-1">Panel Administrasi</p>
                            </div>
                            <button onClick={() => setSidebarOpen(false)} className="text-white/40 hover:text-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <nav className="flex-1 px-4 space-y-1">
                            {navItems.map(item => (
                                <Link
                                    key={item.route}
                                    href={(() => { try { return route(item.route); } catch { return '#'; } })()}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                                        isActive(item.route)
                                            ? 'bg-white/15 text-white'
                                            : 'text-white/50 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    {item.icon}
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </aside>
                </div>
            )}

            {/* Main content */}
            <div className="flex-1 lg:ml-64">
                {/* Top bar */}
                <header className="sticky top-0 z-30 bg-[#F8F7F4]/80 backdrop-blur-xl border-b border-luxury-sand/30">
                    <div className="px-6 md:px-10 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-luxury-charcoal">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                            </button>
                            {title && <h1 className="font-serif text-xl md:text-2xl text-luxury-darkgreen">{title}</h1>}
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/" className="text-[11px] uppercase tracking-[0.15em] text-luxury-muted hover:text-luxury-darkgreen transition-colors" target="_blank">
                                Lihat Website →
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-6 md:p-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
