import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Plus, Search, Edit, Trash2, Eye, Car, DollarSign, Building2 } from 'lucide-react';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';
import { calculateMitraRevenue, type Mitra, type Mobil, type Pesanan } from '../lib/data';

interface ManajemenMitraProps {
  mitras: Mitra[];
  setMitras: (mitras: Mitra[]) => void;
  pesanans: Pesanan[];
  mobils: Mobil[];
}

export function ManajemenMitra({ mitras, setMitras, pesanans, mobils }: ManajemenMitraProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedMitra, setSelectedMitra] = useState<Mitra | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    phone: '',
    email: '',
    address: ''
  });

  const filteredMitras = mitras.filter((mitra) =>
    `${mitra.name} ${mitra.companyName} ${mitra.phone} ${mitra.email}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleAddMitra = () => {
    if (!formData.name || !formData.companyName || !formData.phone || !formData.email) {
      toast.error('Mohon lengkapi semua data');
      return;
    }

    const newMitra: Mitra = {
      id: Math.max(...mitras.map(m => m.id), 0) + 1,
      name: formData.name,
      companyName: formData.companyName,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      totalCars: 0,
      activeCars: 0,
      totalRevenue: 0,
      registeredDate: new Date().toISOString().split('T')[0]
    };

    setMitras([...mitras, newMitra]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success('Mitra berhasil ditambahkan');
  };

  const handleDeleteMitra = (id: number) => {
    const mitraToDelete = mitras.find(m => m.id === id);
    
    // Check if mitra has cars
    if (mitraToDelete) {
      const mitraCars = mobils.filter(m => m.ownerType === 'mitra' && m.ownerName === mitraToDelete.companyName);
      if (mitraCars.length > 0) {
        toast.error(`Tidak dapat menghapus mitra yang masih memiliki ${mitraCars.length} mobil terdaftar`);
        return;
      }
    }
    
    setMitras(mitras.filter(m => m.id !== id));
    toast.success('Mitra berhasil dihapus');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      companyName: '',
      phone: '',
      email: '',
      address: ''
    });
  };

  const getMitraCars = (mitraCompanyName: string) => {
    return mobils.filter(m => m.ownerType === 'mitra' && m.ownerName === mitraCompanyName);
  };

  const getMitraRevenue = (mitraCompanyName: string) => {
    return calculateMitraRevenue(mitraCompanyName, pesanans);
  };

  const getMitraOrders = (mitraCompanyName: string) => {
    return pesanans.filter(p => p.ownerType === 'mitra' && p.ownerName === mitraCompanyName && p.status === 'completed');
  };

  return (
    <div className="space-y-4">
      {/* Search and Add */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Cari mitra..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button size="icon" className="shrink-0">
              <Plus className="size-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Mitra Baru</DialogTitle>
              <DialogDescription>Tambahkan mitra baru</DialogDescription>
            </DialogHeader>
            <MitraForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleAddMitra}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Mitra</DialogTitle>
            <DialogDescription>Informasi lengkap mitra dan laporan</DialogDescription>
          </DialogHeader>
          {selectedMitra && (
            <MitraDetail
              mitra={selectedMitra}
              cars={getMitraCars(selectedMitra.companyName)}
              orders={getMitraOrders(selectedMitra.companyName)}
              revenue={getMitraRevenue(selectedMitra.companyName)}
              onDelete={() => {
                handleDeleteMitra(selectedMitra.id);
                setIsDetailDialogOpen(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Mitra Cards */}
      <div className="space-y-3">
        {filteredMitras.map((mitra) => {
          const mitraCars = getMitraCars(mitra.companyName);
          const mitraRevenue = getMitraRevenue(mitra.companyName);
          
          return (
            <Card key={mitra.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-1">{mitra.companyName}</h3>
                    <p className="text-sm text-gray-600">{mitra.name}</p>
                    <p className="text-sm text-gray-500">{mitra.phone}</p>
                  </div>
                  <Building2 className="size-8 text-purple-600" />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Car className="size-4 text-blue-600" />
                      <p className="text-xs text-blue-600">Total Mobil</p>
                    </div>
                    <p className="text-gray-900">{mitraCars.length}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="size-4 text-green-600" />
                      <p className="text-xs text-green-600">Pendapatan</p>
                    </div>
                    <p className="text-gray-900 text-sm">
                      Rp {(mitraRevenue / 1000000).toFixed(1)}Jt
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setSelectedMitra(mitra);
                      setIsDetailDialogOpen(true);
                    }}
                  >
                    <Eye className="size-4 mr-1" />
                    Detail
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function MitraForm({
  formData,
  setFormData,
  onSubmit
}: {
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nama Pemilik</Label>
        <Input
          id="name"
          placeholder="Budi Hartono"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="company">Nama Perusahaan</Label>
        <Input
          id="company"
          placeholder="PT Sejahtera Motor"
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Nomor Telepon</Label>
        <Input
          id="phone"
          placeholder="081234567890"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="budi@sejahtera.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Alamat</Label>
        <Input
          id="address"
          placeholder="Jl. Sudirman No. 123, Jakarta"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>
      <Button className="w-full" onClick={onSubmit}>
        Simpan
      </Button>
    </div>
  );
}

function MitraDetail({
  mitra,
  cars,
  orders,
  revenue,
  onDelete
}: {
  mitra: Mitra;
  cars: Mobil[];
  orders: Pesanan[];
  revenue: number;
  onDelete: () => void;
}) {
  return (
    <div className="space-y-4 py-4">
      {/* Informasi Mitra */}
      <div>
        <h4 className="text-sm text-gray-600 mb-2">Informasi Perusahaan</h4>
        <div className="space-y-1">
          <p className="text-gray-900">{mitra.companyName}</p>
          <p className="text-sm text-gray-600">Pemilik: {mitra.name}</p>
          <p className="text-sm text-gray-600">{mitra.phone}</p>
          <p className="text-sm text-gray-600">{mitra.email}</p>
          <p className="text-sm text-gray-600">{mitra.address}</p>
        </div>
      </div>

      <Separator />

      {/* Statistik */}
      <div>
        <h4 className="text-sm text-gray-600 mb-2">Statistik</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-blue-600 mb-1">Total Mobil</p>
            <p className="text-gray-900">{cars.length} unit</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-xs text-green-600 mb-1">Total Transaksi</p>
            <p className="text-gray-900">{orders.length} pesanan</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Daftar Mobil */}
      <div>
        <h4 className="text-sm text-gray-600 mb-2">Daftar Mobil ({cars.length})</h4>
        <div className="space-y-2">
          {cars.map((car) => (
            <div key={car.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div>
                <p className="text-sm text-gray-900">{car.brand} {car.model}</p>
                <p className="text-xs text-gray-600">{car.plateNumber}</p>
              </div>
              <Badge className={
                car.status === 'available' ? 'bg-green-100 text-green-700' :
                car.status === 'rented' ? 'bg-blue-100 text-blue-700' :
                'bg-orange-100 text-orange-700'
              }>
                {car.status === 'available' ? 'Tersedia' :
                 car.status === 'rented' ? 'Disewa' : 'Maintenance'}
              </Badge>
            </div>
          ))}
          {cars.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">Belum ada mobil terdaftar</p>
          )}
        </div>
      </div>

      <Separator />

      {/* Laporan Pendapatan */}
      <div>
        <h4 className="text-sm text-gray-600 mb-2">Laporan Pendapatan</h4>
        <div className="bg-green-50 p-4 rounded-lg mb-3">
          <p className="text-sm text-green-600 mb-1">Total Pendapatan</p>
          <p className="text-green-600">Rp {revenue.toLocaleString('id-ID')}</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-xs text-gray-600">Riwayat Transaksi Selesai:</p>
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
              <div>
                <p className="text-gray-900">{order.carModel}</p>
                <p className="text-xs text-gray-600">
                  {new Date(order.endDate).toLocaleDateString('id-ID')}
                </p>
              </div>
              <p className="text-green-600">
                Rp {order.totalPrice.toLocaleString('id-ID')}
              </p>
            </div>
          ))}
          {orders.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">Belum ada transaksi</p>
          )}
        </div>
      </div>

      <Separator />

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onDelete}>
          <Trash2 className="size-4 mr-1" />
          Hapus Mitra
        </Button>
      </div>
    </div>
  );
}