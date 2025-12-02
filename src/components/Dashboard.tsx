import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Car,
  FileText,
  Users,
  TrendingUp,
  Calendar,
  DollarSign,
} from "lucide-react";
import {
  calculateTotalRevenue,
  calculateRentalRevenue,
  calculateMitraRevenueTotal,
  getMonthlyRevenue,
  type Mobil,
  type Pesanan,
} from "../lib/data";

interface DashboardProps {
  mobils: Mobil[];
  pesanans: Pesanan[];
}

export function Dashboard({
  mobils,
  pesanans,
}: DashboardProps) {
  const availableCars = mobils.filter(
    (m) => m.status === "available",
  ).length;
  const pendingOrders = pesanans.filter(
    (p) => p.status === "pending",
  ).length;
  const mitraCount = new Set(
    mobils
      .filter((m) => m.ownerType === "mitra")
      .map((m) => m.ownerName),
  ).size;
  const mitraCars = mobils.filter(
    (m) => m.ownerType === "mitra",
  ).length;

  // Calculate revenues from completed orders
  const totalRevenue = calculateTotalRevenue(pesanans);
  const rentalRevenue = calculateRentalRevenue(pesanans);
  const mitraRevenue = calculateMitraRevenueTotal(pesanans);

  // Get current month revenue (November 2025)
  const currentMonthRevenue = getMonthlyRevenue(
    pesanans,
    2025,
    10,
  ); // Month 10 = November

  const stats = [
    {
      title: "Mobil Tersedia",
      value: availableCars.toString(),
      subtitle: `dari ${mobils.length} total`,
      icon: Car,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Pesanan Baru",
      value: pendingOrders.toString(),
      subtitle: "menunggu konfirmasi",
      icon: FileText,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "Mitra Terdaftar",
      value: mitraCount.toString(),
      subtitle: "mitra aktif",
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Mobil Mitra Aktif",
      value: mitraCars.toString(),
      subtitle: "dari mitra",
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  const recentOrders = pesanans
    .sort(
      (a, b) =>
        new Date(b.orderDate).getTime() -
        new Date(a.orderDate).getTime(),
    )
    .slice(0, 5);

  const getStatusBadge = (status: Pesanan["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-orange-100 text-orange-700">
            Menunggu
          </Badge>
        );
      case "confirmed":
        return (
          <Badge className="bg-blue-100 text-blue-700">
            Dikonfirmasi
          </Badge>
        );
      case "ongoing":
        return (
          <Badge className="bg-green-100 text-green-700">
            Berjalan
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-gray-100 text-gray-700">
            Selesai
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-700">
            Dibatalkan
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <h3 className="text-gray-900 mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {stat.subtitle}
                  </p>
                </div>
                <div className={`${stat.bg} p-3 rounded-lg`}>
                  <stat.icon
                    className={`size-5 ${stat.color}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="size-5" />
            Pendapatan Bulan Ini (November 2025)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Total Pendapatan
              </span>
              <span className="text-blue-600">
                Rp {currentMonthRevenue.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between items-center pl-4">
              <span className="text-sm text-gray-500">
                • Mobil Rental
              </span>
              <span className="text-sm text-gray-700">
                Rp{" "}
                {getMonthlyRevenue(
                  pesanans.filter(
                    (p) => p.ownerType === "rental",
                  ),
                  2025,
                  10,
                ).toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between items-center pl-4">
              <span className="text-sm text-gray-500">
                • Mobil Mitra
              </span>
              <span className="text-sm text-gray-700">
                Rp{" "}
                {getMonthlyRevenue(
                  pesanans.filter(
                    (p) => p.ownerType === "mitra",
                  ),
                  2025,
                  10,
                ).toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t">
            <p className="text-xs text-gray-500 mb-2">
              Total Pendapatan Keseluruhan
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Rental
              </span>
              <span className="text-sm text-gray-700">
                Rp {rentalRevenue.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Mitra
              </span>
              <span className="text-sm text-gray-700">
                Rp {mitraRevenue.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t mt-2">
              <span className="text-gray-900">Total</span>
              <span className="text-blue-600">
                Rp {totalRevenue.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="size-5" />
            Pesanan Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">
                    {order.customerName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.carModel}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(
                      order.startDate,
                    ).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    -{" "}
                    {new Date(order.endDate).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "short",
                      },
                    )}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {getStatusBadge(order.status)}
                  <span className="text-xs text-blue-600">
                    Rp{" "}
                    {order.totalPrice.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}