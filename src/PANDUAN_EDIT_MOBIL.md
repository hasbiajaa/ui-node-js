# 📚 Panduan Mengganti Data Mobil & Foto Mobil

## 🎯 Lokasi File yang Perlu Diedit

File utama yang perlu Anda edit: **`/lib/data.ts`**

---

## 📝 Cara Mengganti Data Mobil

### Step 1: Buka File `/lib/data.ts`

Cari bagian `export const initialMobils: Mobil[]` (sekitar baris 47)

### Step 2: Edit Data Mobil

Setiap mobil memiliki struktur seperti ini:

```typescript
{
  id: 1,                              // ID unik (jangan duplikat!)
  brand: 'Toyota',                    // Merek mobil
  model: 'Avanza',                    // Model/tipe mobil
  year: 2022,                         // Tahun produksi
  plateNumber: 'B 1234 XYZ',          // Plat nomor (unik!)
  status: 'available',                // Status: 'available' | 'rented' | 'maintenance'
  pricePerDay: 350000,                // Harga sewa per hari (angka, tanpa titik/koma)
  image: 'https://...',               // URL gambar mobil
  ownerType: 'rental',                // Pemilik: 'rental' atau 'mitra'
  ownerName: 'Rental Sejahtera'       // Nama pemilik
}
```

### Step 3: Contoh Edit Mobil

**SEBELUM:**
```typescript
{
  id: 1,
  brand: 'Toyota',
  model: 'Avanza',
  year: 2022,
  plateNumber: 'B 1234 XYZ',
  status: 'available',
  pricePerDay: 350000,
  image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400',
  ownerType: 'rental',
  ownerName: 'Rental Sejahtera'
}
```

**SESUDAH (contoh ganti ke Honda Civic):**
```typescript
{
  id: 1,
  brand: 'Honda',
  model: 'Civic',
  year: 2024,
  plateNumber: 'B 5555 AAA',
  status: 'available',
  pricePerDay: 500000,
  image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400',
  ownerType: 'rental',
  ownerName: 'Rental Sejahtera'
}
```

---

## 🖼️ Cara Mengganti Foto Mobil

### **Opsi 1: Menggunakan Unsplash (Recommended)**

#### Cara Manual di Browser:
1. Buka https://unsplash.com
2. Cari foto mobil (contoh: "toyota avanza", "honda jazz", "suv car")
3. Klik foto yang Anda suka
4. Klik kanan pada foto → "Copy Image Address"
5. Paste URL di field `image`
6. Tambahkan `?w=400` di akhir URL untuk optimasi

**Contoh URL:**
```
https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400
```

#### Cara di Aplikasi (Lebih Mudah):
**Saya bisa membantu Anda!** Beri tahu saya:
- Merek & model mobil yang ingin dicari fotonya
- Saya akan gunakan `unsplash_tool` untuk mendapatkan URL foto otomatis

**Contoh request:**
> "Carikan foto untuk Toyota Fortuner, Honda CR-V, dan Mitsubishi Pajero"

---

### **Opsi 2: Menggunakan URL Foto Sendiri**

Jika punya foto sendiri yang sudah diupload ke hosting:

```typescript
image: 'https://example.com/foto-mobil-saya.jpg'
```

⚠️ **Pastikan:**
- URL publik (bisa diakses)
- Format: `.jpg`, `.jpeg`, `.png`, `.webp`
- Ukuran direkomendasikan: 400-800px lebar

---

## 📋 Field-Field Penting

### **1. Status Mobil**
```typescript
status: 'available'      // Mobil tersedia untuk disewa
status: 'rented'         // Sedang disewa
status: 'maintenance'    // Sedang perbaikan
```

### **2. Owner Type**
```typescript
ownerType: 'rental'      // Mobil milik rental sendiri
ownerType: 'mitra'       // Mobil milik mitra
```

### **3. Owner Name**
Harus sesuai dengan nama di data mitra! 
- Rental Sejahtera
- PT Sejahtera Motor
- CV Jaya Transport
- PT Maju Bersama

---

## ⚠️ Hal yang HARUS Diperhatikan

### ❌ JANGAN:
1. **Duplikat ID** - Setiap mobil harus punya ID unik
2. **Duplikat Plat Nomor** - Setiap plat harus unik
3. **Hapus field** - Semua field harus ada
4. **Salah format harga** - Harus angka, bukan string

### ✅ LAKUKAN:
1. **Simpan file** setelah edit
2. **Refresh browser** untuk lihat perubahan
3. **Cek konsol browser** (F12) jika ada error
4. **Backup data lama** sebelum edit besar-besaran

---

## 🚗 Contoh Lengkap: Tambah 3 Mobil Baru

```typescript
export const initialMobils: Mobil[] = [
  // Mobil 1: Toyota Fortuner
  {
    id: 16,
    brand: 'Toyota',
    model: 'Fortuner VRZ',
    year: 2024,
    plateNumber: 'B 9999 ZZZ',
    status: 'available',
    pricePerDay: 850000,
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400',
    ownerType: 'rental',
    ownerName: 'Rental Sejahtera'
  },
  
  // Mobil 2: Honda HR-V
  {
    id: 17,
    brand: 'Honda',
    model: 'HR-V Turbo',
    year: 2023,
    plateNumber: 'B 8888 HRV',
    status: 'available',
    pricePerDay: 600000,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400',
    ownerType: 'mitra',
    ownerName: 'PT Sejahtera Motor'
  },
  
  // Mobil 3: Suzuki XL7
  {
    id: 18,
    brand: 'Suzuki',
    model: 'XL7 Hybrid',
    year: 2024,
    plateNumber: 'B 7777 XL7',
    status: 'maintenance',
    pricePerDay: 450000,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400',
    ownerType: 'mitra',
    ownerName: 'CV Jaya Transport'
  }
];
```

---

## 🔄 Setelah Edit Data Mobil

### Update Data Pesanan (Opsional)
Jika Anda ganti mobil yang sudah ada di pesanan, update juga:
1. `carModel` di pesanan
2. `carPlate` di pesanan
3. `pricePerDay` di pesanan

Lokasi: **`/lib/data.ts`** → bagian `export const initialPesanans`

---

## 🆘 Troubleshooting

### Problem: Gambar Tidak Muncul
**Solusi:**
- Cek URL gambar di browser (paste di address bar)
- Pastikan URL diawali `https://`
- Coba URL Unsplash lain

### Problem: Data Mobil Tidak Berubah
**Solusi:**
- Pastikan sudah save file
- Hard refresh browser: `Ctrl + Shift + R` (Windows) atau `Cmd + Shift + R` (Mac)
- Cek console error (F12)

### Problem: Error Setelah Edit
**Solusi:**
- Cek syntax: koma, kurung kurawal, kutip
- Pastikan semua field lengkap
- Pastikan tidak ada ID duplikat

---

## 💡 Tips & Tricks

### 1. **Format Harga**
```typescript
// ✅ BENAR
pricePerDay: 350000

// ❌ SALAH
pricePerDay: "350000"      // Jangan pakai kutip
pricePerDay: 350.000       // Jangan pakai titik
pricePerDay: "Rp 350.000"  // Jangan pakai Rp
```

### 2. **Tahun**
```typescript
// ✅ BENAR
year: 2024

// ❌ SALAH
year: "2024"    // Jangan pakai kutip
```

### 3. **Plat Nomor**
```typescript
// ✅ BENAR - Format standar Indonesia
plateNumber: 'B 1234 ABC'
plateNumber: 'D 5678 XYZ'
plateNumber: 'F 9012 DEF'

// ✅ BENAR - Tanpa spasi juga OK
plateNumber: 'B1234ABC'
```

---

## 🎓 Cara Cepat Update Banyak Mobil

Beri tahu saya list mobil yang Anda inginkan, contoh:

```
1. Toyota Fortuner 2024 - Rp 850.000/hari - Rental
2. Honda CR-V 2023 - Rp 700.000/hari - Mitra (PT Sejahtera Motor)
3. Mitsubishi Xpander 2024 - Rp 450.000/hari - Rental
4. Nissan Livina 2022 - Rp 380.000/hari - Mitra (CV Jaya Transport)
```

**Saya akan:**
1. ✅ Carikan foto Unsplash yang sesuai
2. ✅ Buatkan kode lengkap siap pakai
3. ✅ Berikan ID & plat nomor yang unik

---

## 📞 Butuh Bantuan?

Tinggal bilang:
- ✅ "Carikan foto untuk [nama mobil]"
- ✅ "Buatkan data untuk [list mobil]"
- ✅ "Update mobil ID [X] dengan [data baru]"
- ✅ "Tambahkan [X] mobil baru"

Saya siap membantu! 🚗💨
