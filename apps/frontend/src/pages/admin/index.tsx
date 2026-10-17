import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/auth-context";
import {
  useGetAdminStats, useListProducts, useListAdminOrders,
  useAdminUpdateProduct, useAdminUpdateOrderStatus,
  getListProductsQueryKey,
} from "@workspace/api-client-react";
import { useListFarms, useListCategories } from "@workspace/api-client-react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3, Package, ShoppingBag, Users, TrendingUp, Leaf,
  ChevronRight, ArrowUpRight, Shield, LogOut, LayoutDashboard,
  Boxes, ClipboardList, Plus, Image as ImageIcon, X, Pencil, Check,
  MessageCircle, FileText, MapPin, Send, Printer, CheckCircle2,
  Building2, Truck, RefreshCw, AlertTriangle, Sparkles, Phone, Zap,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type Tab = "overview" | "inventory" | "orders" | "whatsapp" | "b2b" | "analytics";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  out_for_delivery: "bg-orange-100 text-orange-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const UNITS = ["500g", "1kg", "250g", "100g", "1 bunch", "1 piece", "6 pieces", "500ml", "1L", "200ml"];

interface NewProductForm {
  name: string;
  description: string;
  price: string;
  unit: string;
  categorySlug: string;
  categoryName: string;
  farmId: string;
  farmName: string;
  farmLocation: string;
  isOrganic: boolean;
  isSeasonal: boolean;
  isFeatured: boolean;
  imageUrl: string;
  stock: string;
  freshnessScore: string;
}

const defaultForm: NewProductForm = {
  name: "", description: "", price: "", unit: "500g",
  categorySlug: "", categoryName: "", farmId: "", farmName: "", farmLocation: "",
  isOrganic: false, isSeasonal: false, isFeatured: false,
  imageUrl: "", stock: "100", freshnessScore: "85",
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
  const { data: farms } = useListFarms();
  const { data: categories } = useListCategories();
  const updateProduct = useAdminUpdateProduct();
  const updateOrderStatus = useAdminUpdateOrderStatus();

  // Inline edits per row: stock, price, imageUrl
  const [editingStock, setEditingStock] = useState<Record<number, string>>({});
  const [editingPrice, setEditingPrice] = useState<Record<number, string>>({});
  const [editingImage, setEditingImage] = useState<Record<number, string>>({});

  // Add Product modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newForm, setNewForm] = useState<NewProductForm>(defaultForm);
  const [addError, setAddError] = useState("");

  // B2B Wholesale & GST Billing state
  const [b2bBuyerName, setB2bBuyerName] = useState("Karnataka Organic Retail Hub, Indiranagar");
  const [b2bGstin, setB2bGstin] = useState("29AABCU9603R1ZX");
  const [b2bItem, setB2bItem] = useState("15L Cold-Pressed Groundnut Oil Tin");
  const [b2bHsn, setB2bHsn] = useState("1508");
  const [b2bQty, setB2bQty] = useState("4");
  const [b2bRate, setB2bRate] = useState("3900");
  const [showB2bInvoiceModal, setShowB2bInvoiceModal] = useState(false);

  // WhatsApp Broadcast state
  const [broadcastSegment, setBroadcastSegment] = useState("oil-buyers");
  const [broadcastMessage, setBroadcastMessage] = useState(
    "🌿 Desiri Naturals Harvest Alert: Fresh batch of Wood-Pressed Safflower & Groundnut Oil has arrived from our Tumkur farm! Order today on WhatsApp for 10% seasonal discount. Reply YES to order."
  );
  const [isSendingBroadcast, setIsSendingBroadcast] = useState(false);

  const createProduct = useMutation({
    mutationFn: async (data: NewProductForm) => {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...data,
          price: data.price,
          stock: parseInt(data.stock),
          freshnessScore: parseInt(data.freshnessScore),
          farmId: parseInt(data.farmId),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create product");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
      toast({ title: "Product added successfully" });
      setShowAddModal(false);
      setNewForm(defaultForm);
      setAddError("");
    },
    onError: (err: Error) => setAddError(err.message),
  });

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

  const handleSaveRow = (productId: number) => {
    const updates: Record<string, unknown> = {};
    if (editingStock[productId] !== undefined) updates.stock = parseInt(editingStock[productId]);
    if (editingPrice[productId] !== undefined) updates.price = parseFloat(editingPrice[productId]);
    if (editingImage[productId] !== undefined) updates.imageUrl = editingImage[productId];

    if (Object.keys(updates).length === 0) return;

    updateProduct.mutate(
      { id: productId, data: updates as any },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
          toast({ title: "Product updated" });
          setEditingStock((p) => { const n = { ...p }; delete n[productId]; return n; });
          setEditingPrice((p) => { const n = { ...p }; delete n[productId]; return n; });
          setEditingImage((p) => { const n = { ...p }; delete n[productId]; return n; });
        },
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

  const handleFarmSelect = (farmId: string) => {
    const farm = farms?.find((f) => String(f.id) === farmId);
    setNewForm((p) => ({ ...p, farmId, farmName: farm?.name ?? "", farmLocation: farm?.location ?? "" }));
  };

  const handleCategorySelect = (slug: string) => {
    const cat = categories?.find((c) => c.slug === slug);
    setNewForm((p) => ({ ...p, categorySlug: slug, categoryName: cat?.name ?? "" }));
  };

  const hasRowChanges = (id: number) =>
    editingStock[id] !== undefined || editingPrice[id] !== undefined || editingImage[id] !== undefined;

  const navItems: { id: Tab; label: string; icon: any; badge?: string }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "orders", label: "Orders & Dispatch", icon: ClipboardList },
    { id: "inventory", label: "Inventory & Batches", icon: Boxes },
    { id: "whatsapp", label: "WhatsApp Center", icon: MessageCircle, badge: "Live" },
    { id: "b2b", label: "B2B & GST Billing", icon: Building2, badge: "GST" },
    { id: "analytics", label: "Pincode Analytics", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a3a2a] flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-[#8bc34a]" />
            <span className="font-serif text-xl font-bold text-white">Desiri Naturals</span>
          </div>
          <div className="mt-2 text-xs text-white/50 uppercase tracking-widest font-medium">Admin Console</div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                tab === id ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </div>
              {badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  badge === "Live" ? "bg-emerald-500 text-white animate-pulse" : "bg-amber-400 text-black"
                }`}>
                  {badge}
                </span>
              )}
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
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <header className="bg-background border-b px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold capitalize">{tab === "overview" ? "Dashboard" : tab}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <Link href="/"><Button variant="outline" size="sm" className="gap-2"><ArrowUpRight className="h-4 w-4" /> View Store</Button></Link>
        </header>

        <div className="p-8">
          {/* OVERVIEW */}
          {tab === "overview" && (
            <div className="space-y-8">
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
                      {["Order", "Customer", "Amount", "Status"].map((h) => (
                        <th key={h} className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {(stats?.recentOrders ?? []).map((order) => (
                      <tr key={order.id} className="hover:bg-muted/30">
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

          {/* INVENTORY */}
          {tab === "inventory" && (
            <>
              <div className="bg-background border rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold">Product Inventory</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">Edit stock, price, image URL and featured status inline — click Save to apply</p>
                  </div>
                  <Button size="sm" className="gap-2" onClick={() => setShowAddModal(true)}>
                    <Plus className="h-4 w-4" /> Add Product
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        {["Image", "Product", "Category", "Price (₹)", "Stock", "Freshness", "Featured", ""].map((h) => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {(products ?? []).map((product) => (
                        <tr key={product.id} className="hover:bg-muted/20 transition-colors">
                          {/* Image */}
                          <td className="px-4 py-3">
                            <div className="relative group w-12 h-12">
                              <div className="w-12 h-12 rounded-lg border bg-muted overflow-hidden">
                                {(editingImage[product.id] ?? product.imageUrl) ? (
                                  <img
                                    src={editingImage[product.id] ?? product.imageUrl ?? ""}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/40">
                                    <ImageIcon className="h-5 w-5" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Product name */}
                          <td className="px-4 py-3">
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs text-muted-foreground">{product.farmName}</div>
                            {/* Image URL input */}
                            <div className="mt-1.5 flex items-center gap-1">
                              <Input
                                className="h-6 text-xs w-44 px-2"
                                placeholder="Paste image URL…"
                                value={editingImage[product.id] ?? (product.imageUrl || "")}
                                onChange={(e) => setEditingImage((p) => ({ ...p, [product.id]: e.target.value }))}
                              />
                            </div>
                          </td>

                          {/* Category */}
                          <td className="px-4 py-3 text-muted-foreground">{product.categoryName}</td>

                          {/* Price */}
                          <td className="px-4 py-3">
                            <Input
                              className="w-20 h-7 text-sm"
                              type="number"
                              min="0"
                              step="0.50"
                              value={editingPrice[product.id] ?? product.price.toFixed(2)}
                              onChange={(e) => setEditingPrice((p) => ({ ...p, [product.id]: e.target.value }))}
                            />
                          </td>

                          {/* Stock */}
                          <td className="px-4 py-3">
                            <Input
                              className="w-18 h-7 text-sm"
                              type="number"
                              min="0"
                              value={editingStock[product.id] ?? product.stock}
                              onChange={(e) => setEditingStock((p) => ({ ...p, [product.id]: e.target.value }))}
                            />
                          </td>

                          {/* Freshness */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${product.freshnessScore >= 80 ? "bg-primary" : product.freshnessScore >= 60 ? "bg-amber-500" : "bg-destructive"}`}
                                  style={{ width: `${product.freshnessScore}%` }}
                                />
                              </div>
                              <span className="text-xs font-medium">{product.freshnessScore}</span>
                            </div>
                          </td>

                          {/* Featured */}
                          <td className="px-4 py-3">
                            <button
                              onClick={() => updateProduct.mutate({ id: product.id, data: { isFeatured: !product.isFeatured } })}
                              className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                                product.isFeatured ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                              }`}
                            >
                              {product.isFeatured ? "Featured" : "Set Featured"}
                            </button>
                          </td>

                          {/* Save */}
                          <td className="px-4 py-3">
                            <Button
                              size="sm"
                              variant={hasRowChanges(product.id) ? "default" : "outline"}
                              className="h-7 text-xs"
                              onClick={() => handleSaveRow(product.id)}
                              disabled={!hasRowChanges(product.id)}
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
            </>
          )}

          {/* ORDERS */}
          {tab === "orders" && (
            <div className="bg-background border rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="font-semibold">All Orders</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      {["Order", "Customer", "Date", "Amount", "Status", "Update"].map((h) => (
                        <th key={h} className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {(orders ?? []).map((order) => (
                      <tr key={order.id} className="hover:bg-muted/20">
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
                          <Select value={order.status} onValueChange={(val) => handleOrderStatus(order.id, val)}>
                            <SelectTrigger className="h-7 w-36 text-xs"><SelectValue /></SelectTrigger>
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

          {/* WHATSAPP COMMAND CENTER */}
          {tab === "whatsapp" && (
            <div className="space-y-8">
              {/* WhatsApp Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-background border rounded-2xl p-6 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center shrink-0">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-serif">248</div>
                    <div className="text-xs text-muted-foreground mt-0.5">WhatsApp Active Subscribers</div>
                  </div>
                </div>
                <div className="bg-background border rounded-2xl p-6 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-serif">84.2%</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Notification Open Rate</div>
                  </div>
                </div>
                <div className="bg-background border rounded-2xl p-6 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-serif">₹28,450</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Direct WhatsApp Sales (7 Days)</div>
                  </div>
                </div>
              </div>

              {/* Order-Wise WhatsApp Action Triggers */}
              <div className="bg-background border rounded-2xl overflow-hidden shadow-xs">
                <div className="px-6 py-4 border-b flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-lg flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-[#25D366]" /> Live Order WhatsApp Automations
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Trigger pre-formatted updates directly to customers' WhatsApp in 1-click
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-[#25D366]/10 text-[#1da850] border-[#25D366]/30 text-xs font-semibold">
                    WhatsApp Business API Active
                  </Badge>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        {["Order", "Customer", "Amount", "Status", "1-Click WhatsApp Notification"].map((h) => (
                          <th key={h} className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {(orders ?? []).map((order) => {
                        const cleanPhone = (order.customerPhone || "919480123456").replace(/\D/g, "");
                        const waPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
                        
                        const sendWAMessage = (type: "confirm" | "dispatch" | "payment" | "review") => {
                          let text = "";
                          if (type === "confirm") {
                            text = `🌿 *Desiri Naturals - Order #${order.id} Confirmed!*\n\nHi ${order.customerName || "Customer"}, your order of ₹${order.total.toFixed(2)} has been received and verified. Our farm team is packing your cold-pressed items.\n\nSlot: ${order.deliverySlot || "Tomorrow Morning"}\nTrack: ${window.location.origin}/orders/${order.id}`;
                          } else if (type === "dispatch") {
                            text = `🚚 *Desiri Naturals - Out For Delivery!*\n\nHi ${order.customerName || "Customer"}, Order #${order.id} is out for delivery in our electric van fleet.\nDriver Contact: +91 94801 88990\nEstimated Slot: Today by 11:30 AM.\n\nPlease keep OTP ready: *4812*`;
                          } else if (type === "payment") {
                            text = `💳 *Desiri Naturals - Payment Link*\n\nHi ${order.customerName || "Customer"}, please complete payment of *₹${order.total.toFixed(2)}* for Order #${order.id}.\nUPI Link: upi://pay?pa=desirinaturals@okhdfcbank&pn=DesiriNaturals&am=${order.total.toFixed(2)}&cu=INR`;
                          } else {
                            text = `✨ *Desiri Naturals - How is your harvest?*\n\nHi ${order.customerName || "Customer"}, hope you loved your cold-pressed oils! Share a photo of your unboxing on WhatsApp to earn 100 Desiri Coins off your next order! 🌿`;
                          }
                          window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(text)}`, "_blank");
                        };

                        return (
                          <tr key={order.id} className="hover:bg-muted/20">
                            <td className="px-6 py-4 font-semibold text-sm">#{order.id}</td>
                            <td className="px-6 py-4 text-sm">
                              <div className="font-medium text-foreground">{order.customerName || "Guest Buyer"}</div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                <Phone className="h-3 w-3 text-emerald-600" />
                                {order.customerPhone || "+91 98765 43210"}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-foreground">₹{order.total.toFixed(2)}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-800"}`}>
                                {order.status.replace(/_/g, " ")}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <button
                                  type="button"
                                  onClick={() => sendWAMessage("confirm")}
                                  className="text-[11px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                                  title="Send Order Confirmation"
                                >
                                  <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Confirm
                                </button>
                                <button
                                  type="button"
                                  onClick={() => sendWAMessage("dispatch")}
                                  className="text-[11px] bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-300 font-semibold px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                                  title="Send Dispatch & Electric Van Tracking"
                                >
                                  <Truck className="h-3 w-3 text-orange-600" /> Dispatch
                                </button>
                                <button
                                  type="button"
                                  onClick={() => sendWAMessage("payment")}
                                  className="text-[11px] bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 font-semibold px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                                  title="Send UPI Link"
                                >
                                  💳 UPI Link
                                </button>
                                <button
                                  type="button"
                                  onClick={() => sendWAMessage("review")}
                                  className="text-[11px] bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-300 font-semibold px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                                  title="Ask Photo Review"
                                >
                                  ⭐ Ask Review
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {(!orders || orders.length === 0) && (
                        <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground text-sm">No recent orders to notify</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* WhatsApp Broadcast Campaign Studio */}
              <div className="bg-background border rounded-2xl p-6 shadow-xs">
                <h3 className="font-serif text-lg font-bold mb-1 flex items-center gap-2">
                  <Send className="h-5 w-5 text-emerald-700" /> WhatsApp Customer Broadcast Studio
                </h3>
                <p className="text-xs text-muted-foreground mb-6">
                  Broadcast seasonal harvest arrivals, clearance promotions, or monthly subscription reminders to customer segments.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold block mb-1.5">Target Customer Segment</label>
                      <Select value={broadcastSegment} onValueChange={setBroadcastSegment}>
                        <SelectTrigger className="h-10 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="oil-buyers">🪵 Cold-Pressed Cooking Oil Buyers (142 customers)</SelectItem>
                          <SelectItem value="monthly-subscribers">📦 Monthly Box Subscribers (86 customers)</SelectItem>
                          <SelectItem value="bangalore-metro">⚡ Bengaluru Pincodes - Next Day Delivery (189 customers)</SelectItem>
                          <SelectItem value="cart-abandoned">🛒 Cart Abandoned in Last 24 Hours (19 customers)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs font-bold block mb-1.5">WhatsApp Message Body</label>
                      <Textarea
                        value={broadcastMessage}
                        onChange={(e) => setBroadcastMessage(e.target.value)}
                        className="text-xs resize-none min-h-[110px]"
                        placeholder="Type WhatsApp broadcast announcement..."
                      />
                    </div>

                    <Button
                      type="button"
                      disabled={isSendingBroadcast}
                      onClick={() => {
                        setIsSendingBroadcast(true);
                        setTimeout(() => {
                          setIsSendingBroadcast(false);
                          toast({
                            title: "🚀 Broadcast Sent Successfully!",
                            description: `Sent message to segment customers via WhatsApp Cloud Gateway.`,
                          });
                        }, 1200);
                      }}
                      className="bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl h-11 text-xs font-semibold gap-2 w-full"
                    >
                      <Send className="h-4 w-4" />
                      {isSendingBroadcast ? "Sending Broadcast..." : "Send WhatsApp Campaign to Segment"}
                    </Button>
                  </div>

                  {/* Mobile Preview */}
                  <div className="bg-[#e5ddd5] dark:bg-muted/30 rounded-2xl p-4 border flex flex-col justify-between">
                    <div>
                      <div className="bg-[#075e54] text-white p-3 rounded-xl mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-[#8bc34a]" />
                          <span className="font-bold text-xs">Desiri Naturals Official</span>
                        </div>
                        <span className="text-[10px] bg-emerald-700/80 px-2 py-0.5 rounded-full">Verified Store</span>
                      </div>
                      <div className="bg-white dark:bg-card p-3.5 rounded-2xl shadow-sm text-xs text-foreground max-w-[90%] whitespace-pre-wrap leading-relaxed">
                        {broadcastMessage}
                        <span className="block text-[10px] text-muted-foreground text-right mt-1.5">10:45 AM • Delivered ✓✓</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground text-center mt-4">
                      Simulated preview of customer's WhatsApp screen.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* B2B WHOLESALE & GST BILLING */}
          {tab === "b2b" && (
            <div className="space-y-8">
              {/* B2B Header & GST Overview */}
              <div className="bg-background border rounded-2xl p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="font-serif text-xl font-bold flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-emerald-700" /> B2B Wholesale & Commercial GST Invoicing
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Issue official GST Tax Invoices for bulk 15L oil tins, 25kg millet sacks to organic retail shops & restaurants.
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowB2bInvoiceModal(true)}
                    className="bg-[#196b37] hover:bg-[#145a2e] text-white rounded-xl text-xs font-semibold gap-1.5 h-10 shrink-0"
                  >
                    <Printer className="h-4 w-4" /> Generate & Print GST Invoice
                  </Button>
                </div>

                {/* Bulk Order Generator Form */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-muted/30 p-5 rounded-2xl border">
                  <div>
                    <label className="text-xs font-bold block mb-1">Buyer Business Name</label>
                    <Input
                      value={b2bBuyerName}
                      onChange={(e) => setB2bBuyerName(e.target.value)}
                      className="text-xs h-9 bg-background"
                      placeholder="e.g. Green Earth Naturals"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1">Buyer GSTIN (15 Digits)</label>
                    <Input
                      value={b2bGstin}
                      onChange={(e) => setB2bGstin(e.target.value)}
                      className="text-xs h-9 bg-background font-mono uppercase"
                      placeholder="29AABCU9603R1ZX"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1">Wholesale Item</label>
                    <Select value={b2bItem} onValueChange={setB2bItem}>
                      <SelectTrigger className="h-9 text-xs bg-background"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15L Cold-Pressed Groundnut Oil Tin">15L Wood-Pressed Groundnut Oil Tin (HSN 1508)</SelectItem>
                        <SelectItem value="15L Cold-Pressed Coconut Oil Tin">15L Wood-Pressed Coconut Oil Tin (HSN 1513)</SelectItem>
                        <SelectItem value="15L Cold-Pressed Sesame Oil Tin">15L Wood-Pressed Sesame Oil Tin (HSN 1515)</SelectItem>
                        <SelectItem value="25kg Unpolished Foxtail Millet Bag">25kg Unpolished Foxtail Millet Bag (HSN 1008)</SelectItem>
                        <SelectItem value="5kg Pure Gir Cow A2 Cultured Ghee Tin">5kg Pure Gir Cow A2 Cultured Ghee Tin (HSN 0405)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1">Quantity (Units / Tins)</label>
                    <Input
                      type="number"
                      min="1"
                      value={b2bQty}
                      onChange={(e) => setB2bQty(e.target.value)}
                      className="text-xs h-9 bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1">Wholesale Base Rate per Unit (₹)</label>
                    <Input
                      type="number"
                      min="100"
                      value={b2bRate}
                      onChange={(e) => setB2bRate(e.target.value)}
                      className="text-xs h-9 bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1">GST Tax Bracket</label>
                    <div className="h-9 bg-background border rounded-md px-3 flex items-center text-xs font-mono text-emerald-800">
                      5% (CGST 2.5% + SGST 2.5%)
                    </div>
                  </div>
                </div>

                {/* Calculation Summary Bar */}
                {(() => {
                  const qty = parseInt(b2bQty) || 1;
                  const rate = parseFloat(b2bRate) || 0;
                  const taxableValue = qty * rate;
                  const cgst = taxableValue * 0.025;
                  const sgst = taxableValue * 0.025;
                  const invoiceTotal = taxableValue + cgst + sgst;

                  return (
                    <div className="mt-4 p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex flex-wrap items-center justify-between text-xs gap-4">
                      <div>
                        <span className="text-muted-foreground">Taxable Value: </span>
                        <strong className="font-mono text-foreground">₹{taxableValue.toFixed(2)}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground">CGST (2.5%): </span>
                        <strong className="font-mono text-foreground">₹{cgst.toFixed(2)}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground">SGST (2.5%): </span>
                        <strong className="font-mono text-foreground">₹{sgst.toFixed(2)}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Grand Total with GST: </span>
                        <strong className="text-base text-emerald-800 font-bold font-sans">₹{invoiceTotal.toFixed(2)}</strong>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Recent B2B Wholesale Accounts Table */}
              <div className="bg-background border rounded-2xl overflow-hidden shadow-xs">
                <div className="px-6 py-4 border-b">
                  <h3 className="font-semibold text-base">Commercial B2B Accounts & Standing Wholesale Contracts</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        {["Commercial Partner", "GSTIN", "Monthly Volume", "Primary Product", "Status"].map((h) => (
                          <th key={h} className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y text-xs">
                      {[
                        { name: "Gramin Heritage Foods, Jayanagar", gstin: "29AABCU9603R1ZX", volume: "12 × 15L Tins", item: "Mara Chekku Groundnut Oil", status: "Active Contract" },
                        { name: "Sattvik Organic Kitchens, HSR", gstin: "29BBDFR4412M1ZK", volume: "8 × 15L Tins", item: "Cold-Pressed Coconut Oil", status: "Active Contract" },
                        { name: "AyurVeda Swasthya Clinic, Malleshwaram", gstin: "29AALPO8810Q1ZL", volume: "20 × 5kg Tins", item: "Desi Gir Cow A2 Ghee", status: "Active Contract" },
                        { name: "Raja Rajeshwari Organic Co-Op", gstin: "29CCZPP1129J1Z9", volume: "15 × 25kg Sacks", item: "Native Foxtail & Ragi Millets", status: "Pending Dispatch" },
                      ].map((acc, i) => (
                        <tr key={i} className="hover:bg-muted/20">
                          <td className="px-6 py-4 font-semibold text-foreground">{acc.name}</td>
                          <td className="px-6 py-4 font-mono text-muted-foreground">{acc.gstin}</td>
                          <td className="px-6 py-4 font-medium text-emerald-800">{acc.volume}</td>
                          <td className="px-6 py-4 text-muted-foreground">{acc.item}</td>
                          <td className="px-6 py-4">
                            <span className="bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full text-[11px]">
                              {acc.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PINCODE DEMAND HEATMAP & REPURCHASE ANALYTICS */}
          {tab === "analytics" && (
            <div className="space-y-8">
              {/* Analytics Top KPIs */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Active Serving Pincodes", value: "38 Pincodes", change: "+6 this month", icon: MapPin, color: "text-emerald-700", bg: "bg-emerald-50" },
                  { label: "Repeat Purchase Rate", value: "46.2%", change: "Above 35% Industry Avg", icon: RefreshCw, color: "text-blue-700", bg: "bg-blue-50" },
                  { label: "Average Order Value (AOV)", value: "₹1,320", change: "+14% with Combo Box", icon: TrendingUp, color: "text-purple-700", bg: "bg-purple-50" },
                  { label: "Hyperlocal EV Fleet Share", value: "82.5%", change: "Bengaluru & Mysuru", icon: Truck, color: "text-orange-700", bg: "bg-orange-50" },
                ].map(({ label, value, change, icon: Icon, color, bg }) => (
                  <div key={label} className="bg-background border rounded-2xl p-6 shadow-xs">
                    <div className={`h-10 w-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                      <Icon className={`h-5 w-5 ${color}`} />
                    </div>
                    <div className="text-2xl font-bold font-serif">{value}</div>
                    <div className="text-xs font-semibold text-emerald-700 mt-0.5">{change}</div>
                    <div className="text-xs text-muted-foreground mt-1">{label}</div>
                  </div>
                ))}
              </div>

              {/* Pincode Demand Heatmap */}
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-background border rounded-2xl overflow-hidden shadow-xs">
                  <div className="px-6 py-4 border-b flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-base">Pincode Demand Heatmap (Karnataka Region)</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Top performing delivery zones by recurring volume</p>
                    </div>
                    <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-800 border-emerald-300">
                      ⚡ Hyperlocal Priority
                    </Badge>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b bg-muted/30">
                          {["PIN Code", "Zone / Hub", "Deliveries", "Revenue", "Delivery Fleet Mode"].map((h) => (
                            <th key={h} className="text-left px-5 py-3 font-medium text-muted-foreground uppercase">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {[
                          { pin: "560001", zone: "Bengaluru Central / MG Road", orders: "42 Orders", rev: "₹53,400", fleet: "Direct EV Van (7 AM Slot)" },
                          { pin: "560034", zone: "Koramangala & HSR Layout", orders: "38 Orders", rev: "₹48,200", fleet: "Direct EV Van (7 AM Slot)" },
                          { pin: "560068", zone: "Electronic City Phase 1 & 2", orders: "29 Orders", rev: "₹37,100", fleet: "Direct EV Van (Evening Slot)" },
                          { pin: "560038", zone: "Indiranagar / Old Airport Rd", orders: "25 Orders", rev: "₹32,000", fleet: "Direct EV Van (7 AM Slot)" },
                          { pin: "570001", zone: "Mysuru Heritage City Hub", orders: "19 Orders", rev: "₹24,800", fleet: "Desiri Mysuru Van" },
                          { pin: "572101", zone: "Tumkur Farm Headquarters", orders: "14 Orders", rev: "₹18,200", fleet: "Direct Farm Hub Dispatch" },
                        ].map((row, i) => (
                          <tr key={i} className="hover:bg-muted/20">
                            <td className="px-5 py-3 font-mono font-bold text-foreground">{row.pin}</td>
                            <td className="px-5 py-3 font-medium">{row.zone}</td>
                            <td className="px-5 py-3 font-semibold text-emerald-700">{row.orders}</td>
                            <td className="px-5 py-3 font-bold">{row.rev}</td>
                            <td className="px-5 py-3 text-muted-foreground flex items-center gap-1.5">
                              <Truck className="h-3.5 w-3.5 text-emerald-600" />
                              <span>{row.fleet}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Hero Products Repurchase Rate Ranking */}
                <div className="lg:col-span-1 bg-background border rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold mb-1">Top Repurchase Products</h3>
                    <p className="text-xs text-muted-foreground mb-5">Products with highest 30-day repeat re-order rate</p>
                    
                    <div className="space-y-4">
                      {[
                        { name: "Wood-Pressed Groundnut Oil 1L", rate: 74, color: "bg-emerald-600" },
                        { name: "Gir Cow A2 Cultured Ghee 500ml", rate: 68, color: "bg-amber-500" },
                        { name: "Unpolished Foxtail Millet 1kg", rate: 52, color: "bg-blue-600" },
                        { name: "Wood-Pressed Coconut Oil 1L", rate: 49, color: "bg-teal-600" },
                        { name: "Cold-Pressed Mustard Oil 1L", rate: 41, color: "bg-purple-600" },
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="truncate pr-2">{item.name}</span>
                            <span className="text-emerald-700 font-mono">{item.rate}% Re-order</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.rate}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 mt-6 text-xs text-emerald-900">
                    <p className="font-semibold flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-emerald-700" /> Merchant Insight
                    </p>
                    <p className="mt-1 text-[11px] text-emerald-800 leading-relaxed">
                      Customers purchasing 1L Groundnut Oil re-order every 26 days on average. Promote the "Build Monthly Box" to lock in recurring monthly revenue.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ADD PRODUCT MODAL */}
      <Dialog open={showAddModal} onOpenChange={(o) => { setShowAddModal(o); if (!o) { setNewForm(defaultForm); setAddError(""); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Add New Product</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {addError && (
              <div className="bg-destructive/10 text-destructive text-sm px-4 py-2.5 rounded-lg">{addError}</div>
            )}

            {/* Basic info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <label className="text-sm font-medium">Product Name *</label>
                <Input placeholder="e.g. Organic Spinach" value={newForm.name} onChange={(e) => setNewForm((p) => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="col-span-2 space-y-1.5">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Brief description of the product…"
                  className="resize-none min-h-[70px]"
                  value={newForm.description}
                  onChange={(e) => setNewForm((p) => ({ ...p, description: e.target.value }))}
                />
              </div>
            </div>

            {/* Price & Unit */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Price (₹) *</label>
                <Input type="number" min="0" step="0.5" placeholder="89.00" value={newForm.price} onChange={(e) => setNewForm((p) => ({ ...p, price: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Unit *</label>
                <Select value={newForm.unit} onValueChange={(v) => setNewForm((p) => ({ ...p, unit: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {UNITS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                    <SelectItem value="custom">Other…</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Category & Farm */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Category *</label>
                <Select value={newForm.categorySlug} onValueChange={handleCategorySelect}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {(categories ?? []).map((c) => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Farm *</label>
                <Select value={newForm.farmId} onValueChange={handleFarmSelect}>
                  <SelectTrigger><SelectValue placeholder="Select farm" /></SelectTrigger>
                  <SelectContent>
                    {(farms ?? []).map((f) => <SelectItem key={f.id} value={String(f.id)}>{f.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium flex items-center gap-1.5"><ImageIcon className="h-4 w-4" /> Product Image URL</label>
              <Input
                placeholder="https://example.com/image.jpg"
                value={newForm.imageUrl}
                onChange={(e) => setNewForm((p) => ({ ...p, imageUrl: e.target.value }))}
              />
              {newForm.imageUrl && (
                <div className="mt-2 flex items-start gap-3">
                  <img
                    src={newForm.imageUrl}
                    alt="Preview"
                    className="h-20 w-20 rounded-xl object-cover border bg-muted"
                    onError={(e) => { (e.target as HTMLImageElement).src = ""; }}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Image preview — if it appears above, the URL is valid.</p>
                </div>
              )}
            </div>

            {/* Stock & Freshness */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Initial Stock</label>
                <Input type="number" min="0" value={newForm.stock} onChange={(e) => setNewForm((p) => ({ ...p, stock: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Freshness Score (0–100)</label>
                <Input type="number" min="0" max="100" value={newForm.freshnessScore} onChange={(e) => setNewForm((p) => ({ ...p, freshnessScore: e.target.value }))} />
              </div>
            </div>

            {/* Toggles */}
            <div className="flex gap-4 flex-wrap">
              {[
                { key: "isOrganic" as const, label: "Organic" },
                { key: "isSeasonal" as const, label: "Seasonal" },
                { key: "isFeatured" as const, label: "Featured on Home" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setNewForm((p) => ({ ...p, [key]: !p[key] }))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                    newForm[key] ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border hover:border-primary/50"
                  }`}
                >
                  {newForm[key] && <Check className="h-3.5 w-3.5" />}
                  {label}
                </button>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button
              onClick={() => createProduct.mutate(newForm)}
              disabled={createProduct.isPending || !newForm.name || !newForm.price || !newForm.categorySlug || !newForm.farmId}
            >
              {createProduct.isPending ? "Adding…" : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* B2B OFFICIAL GST TAX INVOICE MODAL */}
      <Dialog open={showB2bInvoiceModal} onOpenChange={setShowB2bInvoiceModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-8">
          <div className="border border-border p-8 rounded-2xl bg-white dark:bg-card space-y-6 text-foreground print:p-0 print:border-none">
            {/* Invoice Header */}
            <div className="flex justify-between items-start border-b pb-6">
              <div>
                <div className="flex items-center gap-2">
                  <Leaf className="h-6 w-6 text-emerald-700" />
                  <span className="font-serif text-2xl font-bold">DESIRI NATURALS</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                  Cold-Pressed Mara Chekku Agro Foods & Heritage Farm Hub<br />
                  Tumkur Farm Cluster, NH-48, Karnataka 572101<br />
                  <strong>GSTIN:</strong> 29AAACD4421E1ZX | <strong>FSSAI:</strong> 11222334000456
                </p>
              </div>
              <div className="text-right">
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Tax Invoice
                </span>
                <p className="text-xs font-mono font-bold mt-2">INV-B2B-2026-9481</p>
                <p className="text-xs text-muted-foreground">
                  Date: {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </p>
              </div>
            </div>

            {/* Bill To */}
            <div className="grid grid-cols-2 gap-6 text-xs bg-muted/20 p-4 rounded-xl border">
              <div>
                <span className="font-bold uppercase tracking-wider text-muted-foreground block mb-1">Billed To (Buyer):</span>
                <p className="font-bold text-sm text-foreground">{b2bBuyerName}</p>
                <p className="text-muted-foreground mt-0.5">Commercial Buyer / Retail Distributor</p>
                <p className="font-mono mt-1"><strong>GSTIN:</strong> {b2bGstin}</p>
                <p className="text-muted-foreground">Place of Supply: Karnataka (State Code 29)</p>
              </div>
              <div>
                <span className="font-bold uppercase tracking-wider text-muted-foreground block mb-1">Dispatched From:</span>
                <p className="font-semibold text-foreground">Desiri Central Farm Logistics</p>
                <p className="text-muted-foreground">Electric Heavy Transit Hub, Bengaluru Zone</p>
                <p className="text-muted-foreground">Dispatch Mode: Dedicated Farm Fleet</p>
              </div>
            </div>

            {/* Invoice Line Items Table */}
            {(() => {
              const qty = parseInt(b2bQty) || 1;
              const rate = parseFloat(b2bRate) || 0;
              const taxable = qty * rate;
              const cgst = taxable * 0.025;
              const sgst = taxable * 0.025;
              const grandTotal = taxable + cgst + sgst;

              return (
                <div className="space-y-4">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b bg-muted/40 text-muted-foreground font-semibold">
                        <th className="py-2.5 px-3 text-left">#</th>
                        <th className="py-2.5 px-3 text-left">Item Description</th>
                        <th className="py-2.5 px-3 text-center">HSN</th>
                        <th className="py-2.5 px-3 text-center">Qty</th>
                        <th className="py-2.5 px-3 text-right">Rate (₹)</th>
                        <th className="py-2.5 px-3 text-right">Taxable (₹)</th>
                        <th className="py-2.5 px-3 text-right">CGST (2.5%)</th>
                        <th className="py-2.5 px-3 text-right">SGST (2.5%)</th>
                        <th className="py-2.5 px-3 text-right">Total (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y font-mono">
                      <tr>
                        <td className="py-3 px-3 text-muted-foreground">1</td>
                        <td className="py-3 px-3 font-sans font-medium text-foreground">{b2bItem}</td>
                        <td className="py-3 px-3 text-center">{b2bHsn}</td>
                        <td className="py-3 px-3 text-center font-bold">{qty}</td>
                        <td className="py-3 px-3 text-right">₹{rate.toFixed(2)}</td>
                        <td className="py-3 px-3 text-right">₹{taxable.toFixed(2)}</td>
                        <td className="py-3 px-3 text-right">₹{cgst.toFixed(2)}</td>
                        <td className="py-3 px-3 text-right">₹{sgst.toFixed(2)}</td>
                        <td className="py-3 px-3 text-right font-bold text-foreground">₹{grandTotal.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Totals Breakdown */}
                  <div className="flex justify-end pt-4 border-t">
                    <div className="w-64 space-y-1.5 text-xs">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Total Taxable Value</span>
                        <span className="font-mono font-medium">₹{taxable.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>CGST (2.5%)</span>
                        <span className="font-mono">₹{cgst.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>SGST (2.5%)</span>
                        <span className="font-mono">₹{sgst.toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-bold text-sm text-foreground">
                        <span>Invoice Amount</span>
                        <span className="text-emerald-700 font-sans text-base">₹{grandTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Invoice Footer & Certification */}
            <div className="pt-6 border-t flex items-center justify-between text-[11px] text-muted-foreground">
              <div>
                <p className="font-semibold text-foreground">Declaration:</p>
                <p>We declare that this invoice shows the actual price of goods described and that all particulars are true and correct.</p>
              </div>
              <div className="text-right">
                <div className="h-10 flex items-center justify-end text-emerald-800 font-serif italic font-bold">
                  Desiri Naturals Authorized
                </div>
                <p className="text-[10px] text-muted-foreground">Authorized Signatory</p>
              </div>
            </div>
          </div>

          <DialogFooter className="print:hidden">
            <Button variant="outline" onClick={() => setShowB2bInvoiceModal(false)}>Close</Button>
            <Button
              className="bg-emerald-700 hover:bg-emerald-800 text-white gap-2"
              onClick={() => window.print()}
            >
              <Printer className="h-4 w-4" /> Print / Save PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
