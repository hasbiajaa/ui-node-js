import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, User, Car, Building2, Check, X, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';
import type { Pesanan, Mobil } from '../lib/data';

interface ManajemenPesananProps {
  pesanans: Pesanan[];
  setPesanans: (pesanans: Pesanan[]) => void;
  mobils: Mobil[];
  setMobils: (mobils: Mobil[]) => void;
}

export function ManajemenPesanan({ pesanans, setPesanans, mobils, setMobils }: ManajemenPesananProps) {
  const handleConfirm = (id: number) => {
    const pesanan = pesanans.find(p => p.id === id);
    
    if (!pesanan) {
      toast.error('Pesanan tidak ditemukan');
      return;
    }
    
    setPesanans(
      pesanans.map((p) =>
        p.id === id ? { ...p, status: 'confirmed' as const } : p
      )
    );
    toast.success('Pesanan berhasil dikonfirmasi');
  };

  const handleReject = (id: number) => {
    const pesanan = pesanans.find(p => p.id === id);
    
    if (!pesanan) {
      toast.error('Pesanan tidak ditemukan');
      return;
    }
    
    setPesanans(
      pesanans.map((p) =>
        p.id === id ? { ...p, status: 'cancelled' as const } : p
      )
    );
    
    // Update car status back to available
    setMobils(
      mobils.map((m) =>
        m.plateNumber === pesanan.carPlate ? { ...m, status: 'available' as const } : m
      )
    );
    
    toast.success('Pesanan berhasil ditolak');
  };

  const handleStartRental = (id: number) => {
    const pesanan = pesanans.find(p => p.id === id);
    
    if (!pesanan) {
      toast.error('Pesanan tidak ditemukan');
      return;
    }
    
    // Check if car is available
    const car = mobils.find(m => m.plateNumber === pesanan.carPlate);
    if (car && car.status !== 'available' && car.status !== 'rented') {
      toast.error('Mobil tidak dapat disewa saat ini');
      return;
    }
    
    setPesanans(
      pesanans.map((p) =>
        p.id === id ? { ...p, status: 'ongoing' as const } : p
      )
    );
    
    // Update car status to rented
    setMobils(
      mobils.map((m) =>
        m.plateNumber === pesanan.carPlate ? { ...m, status: 'rented' as const } : m
      )
    );
    
    toast.success('Penyewaan dimulai');
  };

  const handleComplete = (id: number) => {
    const pesanan = pesanans.find(p => p.id === id);
    
    if (!pesanan) {
      toast.error('Pesanan tidak ditemukan');
      return;
    }
    
    setPesanans(
      pesanans.map((p) =>
        p.id === id ? { ...p, status: 'completed' as const } : p
      )
    );
    
    // Update car status back to available
    setMobils(
      mobils.map((m) =>
        m.plateNumber === pesanan.carPlate ? { ...m, status: 'available' as const } : m
      )
    );
    
    toast.success('Penyewaan selesai, pendapatan telah ditambahkan');
  };

  const pendingOrders = pesanans.filter((p) => p.status === 'pending');
  const confirmedOrders = pesanans.filter((p) => p.status === 'confirmed');
  const ongoingOrders = pesanans.filter((p) => p.status === 'ongoing');
  const completedOrders = pesanans.filter((p) => p.status === 'completed');

  return (
    <div className="space-y-4">
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">Baru ({pendingOrders.length})</TabsTrigger>
          <TabsTrigger value="confirmed">Konfirmasi ({confirmedOrders.length})</TabsTrigger>
          <TabsTrigger value="ongoing">Berjalan ({ongoingOrders.length})</TabsTrigger>
          <TabsTrigger value="completed">Selesai ({completedOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-3 mt-4">
          {pendingOrders.map((pesanan) => (
            <PesananCard
              key={pesanan.id}
              pesanan={pesanan}
              onConfirm={() => handleConfirm(pesanan.id)}
              onReject={() => handleReject(pesanan.id)}
              onStartRental={() => handleStartRental(pesanan.id)}
              onComplete={() => handleComplete(pesanan.id)}
            />
          ))}
          {pendingOrders.length === 0 && (
            <p className="text-center text-gray-500 py-8">Tidak ada pesanan baru</p>
          )}
        </TabsContent>

        <TabsContent value="confirmed" className="space-y-3 mt-4">
          {confirmedOrders.map((pesanan) => (
            <PesananCard
              key={pesanan.id}
              pesanan={pesanan}
              onConfirm={() => handleConfirm(pesanan.id)}
              onReject={() => handleReject(pesanan.id)}
              onStartRental={() => handleStartRental(pesanan.id)}
              onComplete={() => handleComplete(pesanan.id)}
            />
          ))}
          {confirmedOrders.length === 0 && (
            <p className="text-center text-gray-500 py-8">Tidak ada pesanan dikonfirmasi</p>
          )}
        </TabsContent>

        <TabsContent value="ongoing" className="space-y-3 mt-4">
          {ongoingOrders.map((pesanan) => (
            <PesananCard
              key={pesanan.id}
              pesanan={pesanan}
              onConfirm={() => handleConfirm(pesanan.id)}
              onReject={() => handleReject(pesanan.id)}
              onStartRental={() => handleStartRental(pesanan.id)}
              onComplete={() => handleComplete(pesanan.id)}
            />
          ))}
          {ongoingOrders.length === 0 && (
            <p className="text-center text-gray-500 py-8">Tidak ada pesanan berjalan</p>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-3 mt-4">
          {completedOrders.map((pesanan) => (
            <PesananCard
              key={pesanan.id}
              pesanan={pesanan}
              onConfirm={() => handleConfirm(pesanan.id)}
              onReject={() => handleReject(pesanan.id)}
              onStartRental={() => handleStartRental(pesanan.id)}
              onComplete={() => handleComplete(pesanan.id)}
            />
          ))}
          {completedOrders.length === 0 && (
            <p className="text-center text-gray-500 py-8">Tidak ada pesanan selesai</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PesananCard({
  pesanan,
  onConfirm,
  onReject,
  onStartRental,
  onComplete
}: {
  pesanan: Pesanan;
  onConfirm: () => void;
  onReject: () => void;
  onStartRental: () => void;
  onComplete: () => void;
}) {
  const getStatusBadge = (status: Pesanan['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-700">Menunggu</Badge>;
      case 'confirmed':
        return <Badge className="bg-blue-100 text-blue-700">Dikonfirmasi</Badge>;
      case 'ongoing':
        return <Badge className="bg-green-100 text-green-700">Berjalan</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-700">Selesai</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-700">Dibatalkan</Badge>;
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-gray-900 mb-1">Pesanan #{pesanan.id}</h3>
            <p className="text-sm text-gray-500">
              {new Date(pesanan.orderDate).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
          {getStatusBadge(pesanan.status)}
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-sm">
            <User className="size-4 text-gray-400" />
            <span className="text-gray-700">{pesanan.customerName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Car className="size-4 text-gray-400" />
            <span className="text-gray-700">
              {pesanan.carModel} ({pesanan.carPlate})
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {pesanan.ownerType === 'rental' ? (
              <Building2 className="size-4 text-blue-600" />
            ) : (
              <User className="size-4 text-purple-600" />
            )}
            <span className="text-gray-600">{pesanan.ownerName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="size-4 text-gray-400" />
            <span className="text-gray-700">
              {new Date(pesanan.startDate).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short'
              })}{' '}
              -{' '}
              {new Date(pesanan.endDate).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short'
              })}{' '}
              ({pesanan.totalDays} hari)
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t mb-3">
          <span className="text-sm text-gray-600">Total Pembayaran</span>
          <span className="text-blue-600">Rp {pesanan.totalPrice.toLocaleString('id-ID')}</span>
        </div>

        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <Eye className="size-4 mr-1" />
                Detail
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Detail Pesanan #{pesanan.id}</DialogTitle>
                <DialogDescription>Informasi lengkap pesanan</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <h4 className="text-sm text-gray-600 mb-2">Informasi Pelanggan</h4>
                  <div className="space-y-1">
                    <p className="text-gray-900">{pesanan.customerName}</p>
                    <p className="text-sm text-gray-600">{pesanan.customerPhone}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm text-gray-600 mb-2">Informasi Mobil</h4>
                  <div className="space-y-1">
                    <p className="text-gray-900">{pesanan.carModel}</p>
                    <p className="text-sm text-gray-600">{pesanan.carPlate}</p>
                    <div className="flex items-center gap-1">
                      {pesanan.ownerType === 'rental' ? (
                        <Building2 className="size-3 text-blue-600" />
                      ) : (
                        <User className="size-3 text-purple-600" />
                      )}
                      <p className="text-sm text-gray-600">{pesanan.ownerName}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm text-gray-600 mb-2">Periode Sewa</h4>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-700">
                      Mulai:{' '}
                      {new Date(pesanan.startDate).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-gray-700">
                      Selesai:{' '}
                      {new Date(pesanan.endDate).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-gray-700">Durasi: {pesanan.totalDays} hari</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm text-gray-600 mb-2">Rincian Pembayaran</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Harga per hari</span>
                      <span className="text-gray-900">
                        Rp {pesanan.pricePerDay.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Durasi</span>
                      <span className="text-gray-900">{pesanan.totalDays} hari</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-gray-900">Total</span>
                      <span className="text-blue-600">
                        Rp {pesanan.totalPrice.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {pesanan.status === 'pending' && (
            <>
              <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700" onClick={onConfirm}>
                <Check className="size-4 mr-1" />
                Konfirmasi
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-red-600 hover:text-red-700"
                onClick={onReject}
              >
                <X className="size-4 mr-1" />
                Tolak
              </Button>
            </>
          )}

          {pesanan.status === 'confirmed' && (
            <Button size="sm" className="flex-1" onClick={onStartRental}>
              Mulai Sewa
            </Button>
          )}

          {pesanan.status === 'ongoing' && (
            <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700" onClick={onComplete}>
              Selesaikan
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}