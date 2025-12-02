import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { DollarSign, Calendar, TrendingUp, Car } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { calculateTotalRevenue, calculateRentalRevenue, calculateMitraRevenueTotal, getMonthlyRevenue, type Pesanan } from '../lib/data';

interface LaporanPenyewaanProps {
  pesanans: Pesanan[];
}

export function LaporanPenyewaan({ pesanans }: LaporanPenyewaanProps) {
  const [selectedMonth] = useState(10); // November 2025 (0-indexed)
  const [selectedYear] = useState(2025);

  // Calculate revenues
  const totalRevenue = calculateTotalRevenue(pesanans);
  const rentalRevenue = calculateRentalRevenue(pesanans);
  const mitraRevenue = calculateMitraRevenueTotal(pesanans);
  const monthlyRevenue = getMonthlyRevenue(pesanans, selectedYear, selectedMonth);

  // Get completed orders
  const completedOrders = pesanans.filter(p => p.status === 'completed');
  const monthlyCompletedOrders = completedOrders.filter(p => {
    const date = new Date(p.endDate);
    return date.getFullYear() === selectedYear && date.getMonth() === selectedMonth;
  });

  // Calculate statistics
  const totalTransactions = completedOrders.length;
  const monthlyTransactions = monthlyCompletedOrders.length;

  // Get rental and mitra orders
  const rentalOrders = completedOrders.filter(p => p.ownerType === 'rental');
  const mitraOrders = completedOrders.filter(p => p.ownerType === 'mitra');

  const stats = [
    {
      title: 'Total Pendapatan',
      value: `Rp ${(totalRevenue / 1000000).toFixed(1)}Jt`,
      subtitle: `${totalTransactions} transaksi`,
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: 'Pendapatan Bulan Ini',
      value: `Rp ${(monthlyRevenue / 1000000).toFixed(1)}Jt`,
      subtitle: `${monthlyTransactions} transaksi`,
      icon: Calendar,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Mobil Rental',
      value: `Rp ${(rentalRevenue / 1000000).toFixed(1)}Jt`,
      subtitle: `${rentalOrders.length} transaksi`,
      icon: Car,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      title: 'Mobil Mitra',
      value: `Rp ${(mitraRevenue / 1000000).toFixed(1)}Jt`,
      subtitle: `${mitraOrders.length} transaksi`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <h3 className="text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-xs text-gray-500">{stat.subtitle}</p>
                </div>
                <div className={`${stat.bg} p-3 rounded-lg`}>
                  <stat.icon className={`size-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Rincian Pendapatan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Mobil Rental</span>
              <span className="text-gray-900">Rp {rentalRevenue.toLocaleString('id-ID')}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(rentalRevenue / totalRevenue) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {rentalOrders.length} transaksi ({((rentalRevenue / totalRevenue) * 100).toFixed(1)}%)
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Mobil Mitra</span>
              <span className="text-gray-900">Rp {mitraRevenue.toLocaleString('id-ID')}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${(mitraRevenue / totalRevenue) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {mitraOrders.length} transaksi ({((mitraRevenue / totalRevenue) * 100).toFixed(1)}%)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Semua ({completedOrders.length})</TabsTrigger>
              <TabsTrigger value="rental">Rental ({rentalOrders.length})</TabsTrigger>
              <TabsTrigger value="mitra">Mitra ({mitraOrders.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3 mt-4">
              {completedOrders.slice(0, 10).map((order) => (
                <TransactionCard key={order.id} order={order} />
              ))}
            </TabsContent>

            <TabsContent value="rental" className="space-y-3 mt-4">
              {rentalOrders.slice(0, 10).map((order) => (
                <TransactionCard key={order.id} order={order} />
              ))}
            </TabsContent>

            <TabsContent value="mitra" className="space-y-3 mt-4">
              {mitraOrders.slice(0, 10).map((order) => (
                <TransactionCard key={order.id} order={order} />
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function TransactionCard({ order }: { order: Pesanan }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm text-gray-900">{order.customerName}</p>
          <Badge className={
            order.ownerType === 'rental' 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-purple-100 text-purple-700'
          }>
            {order.ownerType === 'rental' ? 'Rental' : 'Mitra'}
          </Badge>
        </div>
        <p className="text-xs text-gray-600 truncate">{order.carModel}</p>
        <p className="text-xs text-gray-500">
          {new Date(order.startDate).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short'
          })}{' '}
          -{' '}
          {new Date(order.endDate).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}{' '}
          ({order.totalDays} hari)
        </p>
      </div>
      <div className="text-right">
        <p className="text-green-600">
          Rp {order.totalPrice.toLocaleString('id-ID')}
        </p>
        <p className="text-xs text-gray-500">
          Rp {order.pricePerDay.toLocaleString('id-ID')}/hari
        </p>
      </div>
    </div>
  );
}