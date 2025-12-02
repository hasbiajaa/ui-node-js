import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Plus, Search, Edit, Trash2, Building2, User } from 'lucide-react';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';
import type { Mobil } from '../lib/data';

interface ManajemenMobilProps {
  mobils: Mobil[];
  setMobils: (mobils: Mobil[]) => void;
}

export function ManajemenMobil({ mobils, setMobils }: ManajemenMobilProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMobil, setEditingMobil] = useState<Mobil | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    plateNumber: '',
    pricePerDay: '',
    status: 'available' as 'available' | 'rented' | 'maintenance',
    ownerType: 'rental' as 'rental' | 'mitra',
    ownerName: 'Rental Sejahtera',
    image: ''
  });

  const filteredMobils = mobils.filter((mobil) =>
    `${mobil.brand} ${mobil.model} ${mobil.plateNumber} ${mobil.ownerName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const rentalCars = filteredMobils.filter(m => m.ownerType === 'rental');
  const mitraCars = filteredMobils.filter(m => m.ownerType === 'mitra');

  const handleAddMobil = () => {
    if (!formData.brand || !formData.model || !formData.plateNumber || !formData.pricePerDay) {
      toast.error('Mohon lengkapi semua data');
      return;
    }

    const newMobil: Mobil = {
      id: Math.max(...mobils.map(m => m.id), 0) + 1,
      brand: formData.brand,
      model: formData.model,
      year: formData.year,
      plateNumber: formData.plateNumber,
      status: formData.status,
      pricePerDay: parseInt(formData.pricePerDay),
      image: formData.image || 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400',
      ownerType: formData.ownerType,
      ownerName: formData.ownerName
    };

    setMobils([...mobils, newMobil]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success('Mobil berhasil ditambahkan');
  };

  const handleEditMobil = () => {
    if (!editingMobil || !formData.brand || !formData.model || !formData.plateNumber || !formData.pricePerDay) {
      toast.error('Mohon lengkapi semua data');
      return;
    }

    const updatedMobils = mobils.map(m =>
      m.id === editingMobil.id
        ? {
            ...m,
            brand: formData.brand,
            model: formData.model,
            year: formData.year,
            plateNumber: formData.plateNumber,
            status: formData.status,
            pricePerDay: parseInt(formData.pricePerDay),
            ownerType: formData.ownerType,
            ownerName: formData.ownerName,
            image: formData.image || m.image
          }
        : m
    );

    setMobils(updatedMobils);
    setIsEditDialogOpen(false);
    setEditingMobil(null);
    resetForm();
    toast.success('Mobil berhasil diupdate');
  };

  const handleDeleteMobil = (id: number) => {
    const mobilToDelete = mobils.find(m => m.id === id);
    
    // Check if car is currently rented
    if (mobilToDelete && mobilToDelete.status === 'rented') {
      toast.error('Tidak dapat menghapus mobil yang sedang disewa');
      return;
    }
    
    setMobils(mobils.filter(m => m.id !== id));
    toast.success('Mobil berhasil dihapus');
  };

  const openEditDialog = (mobil: Mobil) => {
    setEditingMobil(mobil);
    setFormData({
      brand: mobil.brand,
      model: mobil.model,
      year: mobil.year,
      plateNumber: mobil.plateNumber,
      pricePerDay: mobil.pricePerDay.toString(),
      status: mobil.status,
      ownerType: mobil.ownerType,
      ownerName: mobil.ownerName,
      image: mobil.image
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      plateNumber: '',
      pricePerDay: '',
      status: 'available',
      ownerType: 'rental',
      ownerName: 'Rental Sejahtera',
      image: ''
    });
  };

  const getStatusBadge = (status: Mobil['status']) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-700">Tersedia</Badge>;
      case 'rented':
        return <Badge className="bg-blue-100 text-blue-700">Disewa</Badge>;
      case 'maintenance':
        return <Badge className="bg-orange-100 text-orange-700">Maintenance</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Add */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Cari mobil..."
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
              <DialogTitle>Tambah Mobil Baru</DialogTitle>
              <DialogDescription>Tambahkan mobil baru ke inventaris</DialogDescription>
            </DialogHeader>
            <MobilForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleAddMobil}
              submitLabel="Simpan"
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) {
          setEditingMobil(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Mobil</DialogTitle>
            <DialogDescription>Update informasi mobil</DialogDescription>
          </DialogHeader>
          <MobilForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleEditMobil}
            submitLabel="Update"
          />
        </DialogContent>
      </Dialog>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Semua ({filteredMobils.length})</TabsTrigger>
          <TabsTrigger value="rental">Milik Rental ({rentalCars.length})</TabsTrigger>
          <TabsTrigger value="mitra">Milik Mitra ({mitraCars.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3 mt-4">
          {filteredMobils.map((mobil) => (
            <MobilCard
              key={mobil.id}
              mobil={mobil}
              getStatusBadge={getStatusBadge}
              onEdit={() => openEditDialog(mobil)}
              onDelete={() => handleDeleteMobil(mobil.id)}
            />
          ))}
        </TabsContent>

        <TabsContent value="rental" className="space-y-3 mt-4">
          {rentalCars.map((mobil) => (
            <MobilCard
              key={mobil.id}
              mobil={mobil}
              getStatusBadge={getStatusBadge}
              onEdit={() => openEditDialog(mobil)}
              onDelete={() => handleDeleteMobil(mobil.id)}
            />
          ))}
        </TabsContent>

        <TabsContent value="mitra" className="space-y-3 mt-4">
          {mitraCars.map((mobil) => (
            <MobilCard
              key={mobil.id}
              mobil={mobil}
              getStatusBadge={getStatusBadge}
              onEdit={() => openEditDialog(mobil)}
              onDelete={() => handleDeleteMobil(mobil.id)}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MobilForm({
  formData,
  setFormData,
  onSubmit,
  submitLabel
}: {
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: () => void;
  submitLabel: string;
}) {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="ownerType">Kepemilikan</Label>
        <Select
          value={formData.ownerType}
          onValueChange={(value: 'rental' | 'mitra') => {
            setFormData({
              ...formData,
              ownerType: value,
              ownerName: value === 'rental' ? 'Rental Sejahtera' : 'PT Sejahtera Motor'
            });
          }}
        >
          <SelectTrigger id="ownerType">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rental">Milik Rental</SelectItem>
            <SelectItem value="mitra">Milik Mitra</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.ownerType === 'mitra' && (
        <div className="space-y-2">
          <Label htmlFor="mitra">Pilih Mitra</Label>
          <Select
            value={formData.ownerName}
            onValueChange={(value) => setFormData({ ...formData, ownerName: value })}
          >
            <SelectTrigger id="mitra">
              <SelectValue placeholder="Pilih mitra" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PT Sejahtera Motor">PT Sejahtera Motor</SelectItem>
              <SelectItem value="CV Jaya Transport">CV Jaya Transport</SelectItem>
              <SelectItem value="PT Maju Bersama">PT Maju Bersama</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="brand">Merek</Label>
        <Input
          id="brand"
          placeholder="Toyota"
          value={formData.brand}
          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="model">Model</Label>
        <Input
          id="model"
          placeholder="Avanza"
          value={formData.model}
          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="year">Tahun</Label>
        <Input
          id="year"
          type="number"
          placeholder="2023"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="plate">Nomor Plat</Label>
        <Input
          id="plate"
          placeholder="B 1234 XYZ"
          value={formData.plateNumber}
          onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">Harga per Hari (Rp)</Label>
        <Input
          id="price"
          type="number"
          placeholder="350000"
          value={formData.pricePerDay}
          onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value: 'available' | 'rented' | 'maintenance') =>
            setFormData({ ...formData, status: value })
          }
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Pilih status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Tersedia</SelectItem>
            <SelectItem value="rented">Disewa</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="imageUrl">URL Foto Mobil</Label>
        <Input
          id="imageUrl"
          type="url"
          placeholder="https://i.pinimg.com/...jpg"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
        />
        <p className="text-xs text-gray-500">Paste URL foto dari Pinterest, Unsplash, atau sumber lain</p>
        {formData.image && (
          <div className="mt-2">
            <p className="text-xs text-gray-600 mb-1">Preview:</p>
            <img 
              src={formData.image} 
              alt="Preview" 
              className="w-full h-32 object-cover rounded-lg border"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400';
              }}
            />
          </div>
        )}
      </div>
      
      <Button className="w-full" onClick={onSubmit}>
        {submitLabel}
      </Button>
    </div>
  );
}

function MobilCard({
  mobil,
  getStatusBadge,
  onEdit,
  onDelete
}: {
  mobil: Mobil;
  getStatusBadge: (status: Mobil['status']) => JSX.Element;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-3">
          <img
            src={mobil.image}
            alt={`${mobil.brand} ${mobil.model}`}
            className="w-24 h-20 object-cover rounded-lg"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-gray-900">
                {mobil.brand} {mobil.model}
              </h3>
              {getStatusBadge(mobil.status)}
            </div>
            <p className="text-sm text-gray-500 mb-1">{mobil.plateNumber}</p>
            <div className="flex items-center gap-1 mb-1">
              {mobil.ownerType === 'rental' ? (
                <Building2 className="size-3 text-blue-600" />
              ) : (
                <User className="size-3 text-purple-600" />
              )}
              <p className="text-xs text-gray-600">{mobil.ownerName}</p>
            </div>
            <p className="text-sm text-gray-500">Tahun {mobil.year}</p>
            <p className="text-blue-600 mt-1">
              Rp {mobil.pricePerDay.toLocaleString('id-ID')}/hari
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-3 pt-3 border-t">
          <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>
            <Edit className="size-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-red-600 hover:text-red-700"
            onClick={onDelete}
          >
            <Trash2 className="size-4 mr-1" />
            Hapus
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}