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
import {
  BarChart3, Package, ShoppingBag, Users, TrendingUp, Leaf,
  ChevronRight, ArrowUpRight, Shield, LogOut, LayoutDashboard,
  Boxes, ClipboardList, Plus, Image as ImageIcon, X, Pencil, Check,
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
            <span className="font-serif text-xl font-bold text-white">Desiri Naturals</span>
          </div>
          <div className="mt-2 text-xs text-white/50 uppercase tracking-widest font-medium">Admin Console</div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                tab === id ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"
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
    </div>
  );
}
