import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { ManajemenMobil } from './components/ManajemenMobil';
import { ManajemenPesanan } from './components/ManajemenPesanan';
import { ManajemenMitra } from './components/ManajemenMitra';
import { LaporanPenyewaan } from './components/LaporanPenyewaan';
import { Profil } from './components/Profil';
import { Car, LayoutDashboard, FileText, Users, BarChart3, UserCircle, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from './components/ui/sheet';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';
import { initialMobils, initialPesanans, initialMitras, type Mobil, type Pesanan, type Mitra } from './lib/data';

type TabType = 'dashboard' | 'mobil' | 'pesanan' | 'mitra' | 'laporan' | 'profil';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobils, setMobils] = useState<Mobil[]>(initialMobils);
  const [pesanans, setPesanans] = useState<Pesanan[]>(initialPesanans);
  const [mitras, setMitras] = useState<Mitra[]>(initialMitras);

  const menuItems = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'mobil' as TabType, label: 'Manajemen Mobil', icon: Car },
    { id: 'pesanan' as TabType, label: 'Manajemen Pesanan', icon: FileText },
    { id: 'mitra' as TabType, label: 'Manajemen Mitra', icon: Users },
    { id: 'laporan' as TabType, label: 'Laporan Penyewaan', icon: BarChart3 },
    { id: 'profil' as TabType, label: 'Profil', icon: UserCircle }
  ];

  const handleMenuClick = (tabId: TabType) => {
    setActiveTab(tabId);
    setIsMenuOpen(false);
  };

  const currentMenuItem = menuItems.find(item => item.id === activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20 border-b">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
                <SheetDescription className="sr-only">
                  Pilih menu untuk navigasi aplikasi
                </SheetDescription>
                <div className="p-4 border-b bg-blue-600 text-white">
                  <div className="flex items-center gap-2">
                    <Car className="size-6" />
                    <div>
                      <h2>Rental Mobil</h2>
                      <p className="text-sm text-blue-100">Admin Panel</p>
                    </div>
                  </div>
                </div>
                <nav className="p-2">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleMenuClick(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === item.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className="size-5" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <div>
              <h1 className="text-gray-900">{currentMenuItem?.label}</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        {activeTab === 'dashboard' && <Dashboard mobils={mobils} pesanans={pesanans} />}
        {activeTab === 'mobil' && <ManajemenMobil mobils={mobils} setMobils={setMobils} />}
        {activeTab === 'pesanan' && <ManajemenPesanan pesanans={pesanans} setPesanans={setPesanans} mobils={mobils} setMobils={setMobils} />}
        {activeTab === 'mitra' && <ManajemenMitra mitras={mitras} setMitras={setMitras} pesanans={pesanans} mobils={mobils} />}
        {activeTab === 'laporan' && <LaporanPenyewaan pesanans={pesanans} />}
        {activeTab === 'profil' && <Profil />}
      </main>
      <Toaster position="top-center" richColors />
    </div>
  );
}