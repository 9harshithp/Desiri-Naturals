import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/auth-context";
import { useGetAdminStats, useListProducts, useListAdminOrders, useAdminUpdateProduct, useAdminUpdateOrderStatus, getListProductsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart3, Package, ShoppingBag, Users, TrendingUp, Leaf,
  ChevronRight, ArrowUpRight, Shield, LogOut, LayoutDashboard,
  Boxes, ClipboardList
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type Tab = "overview" | "inventory" | "orders";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  out_for_delivery: "bg-orange-100 text-orange-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stats } = useGetAdminStats();
  const { data: products } = useListProducts();
  const { data: orders } = useListAdminOrders();
  const updateProduct = useAdminUpdateProduct();
  const updateOrderStatus = useAdminUpdateOrderStatus();

  const [editingStock, setEditingStock] = useState<Record<number, string>>({});

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold mb-2">Admin Access Required</h2>
          <p className="text-muted-foreground mb-6">You need admin privileges to view this page.</p>
          <Button onClick={() => setLocation("/login")}>Sign In as Admin</Button>
        </div>
      </div>
    );
  }

  const handleStockUpdate = (productId: number) => {
    const val = parseInt(editingStock[productId] ?? "");
    if (isNaN(val) || val < 0) return;
    updateProduct.mutate(
      { id: productId, data: { stock: val } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
          toast({ title: "Stock updated" });
          setEditingStock((prev) => { const n = { ...prev }; delete n[productId]; return n; });
        }
      }
    );
  };

  const handleOrderStatus = (orderId: number, status: string) => {
    updateOrderStatus.mutate(
      { id: orderId, data: { status: status as any } },
      { onSuccess: () => toast({ title: "Order status updated" }) }
    );
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const navItems: { id: Tab; label: string; icon: any }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "inventory", label: "Inventory", icon: Boxes },
    { id: "orders", label: "Orders", icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a3a2a] flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-[#8bc34a]" />
            <span className="font-serif text-xl font-bold text-white">Farm2Me</span>
          </div>
          <div className="mt-2 text-xs text-white/50 uppercase tracking-widest font-medium">Admin Console</div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                tab === id
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="h-8 w-8 rounded-full bg-[#8bc34a]/20 flex items-center justify-center text-[#8bc34a] font-bold text-sm">
              {user.name[0]}
            </div>
            <div>
              <div className="text-white text-sm font-medium truncate max-w-[120px]">{user.name}</div>
              <div className="text-white/50 text-xs">Administrator</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/60 hover:bg-white/10 hover:text-white text-sm transition-all"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-background border-b px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold capitalize">{tab === "overview" ? "Dashboard" : tab}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowUpRight className="h-4 w-4" /> View Store
            </Button>
          </Link>
        </header>

        <div className="p-8">
          {tab === "overview" && (
            <div className="space-y-8">
              {/* Stat cards */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
                {[
                  { label: "Total Orders", value: stats?.totalOrders ?? 0, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Revenue", value: `₹${(stats?.totalRevenue ?? 0).toLocaleString("en-IN")}`, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
                  { label: "Products", value: stats?.totalProducts ?? 0, icon: Package, color: "text-purple-600", bg: "bg-purple-50" },
                  { label: "Customers", value: stats?.totalCustomers ?? 0, icon: Users, color: "text-orange-600", bg: "bg-orange-50" },
                ].map(({ label, value, icon: Icon, color, bg }) => (
                  <div key={label} className="bg-background border rounded-2xl p-6">
                    <div className={`h-10 w-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                      <Icon className={`h-5 w-5 ${color}`} />
                    </div>
                    <div className="text-2xl font-bold font-serif">{value}</div>
                    <div className="text-sm text-muted-foreground mt-1">{label}</div>
                  </div>
                ))}
              </div>

              {/* Recent orders */}
              <div className="bg-background border rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b flex items-center justify-between">
                  <h2 className="font-semibold">Recent Orders</h2>
                  <button onClick={() => setTab("orders")} className="text-sm text-primary flex items-center gap-1 hover:underline">
                    View all <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Order</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Customer</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Amount</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {(stats?.recentOrders ?? []).map((order) => (
                      <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-sm">#{order.id}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{order.customerName || "Guest"}</td>
                        <td className="px-6 py-4 text-sm font-medium">₹{order.total.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-800"}`}>
                            {order.status.replace(/_/g, " ")}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                      <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground text-sm">No orders yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "inventory" && (
            <div className="bg-background border rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="font-semibold">Product Inventory</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Manage stock levels, prices and featured status</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Product</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Category</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Price</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Stock</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Freshness</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Featured</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {(products ?? []).map((product) => (
                      <tr key={product.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-sm">{product.name}</div>
                          <div className="text-xs text-muted-foreground">{product.farmName}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{product.categoryName}</td>
                        <td className="px-6 py-4 text-sm font-medium">₹{product.price.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Input
                              className="w-20 h-7 text-sm"
                              type="number"
                              min="0"
                              value={editingStock[product.id] ?? product.stock}
                              onChange={(e) => setEditingStock((p) => ({ ...p, [product.id]: e.target.value }))}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${product.freshnessScore >= 80 ? "bg-primary" : product.freshnessScore >= 60 ? "bg-amber-500" : "bg-destructive"}`}
                                style={{ width: `${product.freshnessScore}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium">{product.freshnessScore}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => updateProduct.mutate({ id: product.id, data: { isFeatured: !product.isFeatured } })}
                            className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                              product.isFeatured ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {product.isFeatured ? "Featured" : "Not Featured"}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => handleStockUpdate(product.id)}
                            disabled={editingStock[product.id] === undefined}
                          >
                            Save
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "orders" && (
            <div className="bg-background border rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="font-semibold">All Orders</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Order</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Customer</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Date</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Amount</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Status</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {(orders ?? []).map((order) => (
                      <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4 font-medium text-sm">#{order.id}</td>
                        <td className="px-6 py-4 text-sm">
                          <div>{order.customerName || "Guest"}</div>
                          <div className="text-xs text-muted-foreground">{order.customerPhone}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("en-IN")}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">₹{order.total.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-800"}`}>
                            {order.status.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Select
                            value={order.status}
                            onValueChange={(val) => handleOrderStatus(order.id, val)}
                          >
                            <SelectTrigger className="h-7 w-36 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {["pending", "confirmed", "out_for_delivery", "delivered", "cancelled"].map((s) => (
                                <SelectItem key={s} value={s} className="text-xs">{s.replace(/_/g, " ")}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    ))}
                    {(!orders || orders.length === 0) && (
                      <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground text-sm">No orders found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
