import React from "react";
import { useGetOrder, getGetOrderQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import {
  ArrowLeft, Package, MapPin, Calendar, Clock, CheckCircle2,
  FileText, Printer, MessageCircle, Share2, ShieldCheck, Download, Truck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function OrderDetail({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const { data: order, isLoading } = useGetOrder(id, {
    query: {
      enabled: !!id,
      queryKey: getGetOrderQueryKey(id),
    },
  });

  if (isLoading) {
    return <div className="p-12 text-center text-sm text-muted-foreground">Loading order details...</div>;
  }
  if (!order) {
    return <div className="p-12 text-center text-sm text-muted-foreground">Order not found</div>;
  }

  const formatStatus = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const steps = ['pending', 'confirmed', 'out_for_delivery', 'delivered'];
  const currentStepIndex = steps.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';

  const handleOpenInvoice = () => {
    window.open(`/api/orders/${order.id}/invoice`, "_blank", "noopener,noreferrer");
  };

  const handleShareWhatsApp = () => {
    const invoiceUrl = `${window.location.origin}/api/orders/${order.id}/invoice`;
    const trackingUrl = window.location.href;
    const msg = `🌿 *Desiri Naturals - Order #${order.id} Confirmed!*
Customer: ${order.customerName}
Amount: ₹${order.total.toFixed(2)}
Payment: ${(order.paymentMethod || "UPI").toUpperCase()}
Slot: ${order.deliverySlot || "Standard Express"}
📄 *View Tax Invoice:* ${invoiceUrl}
🚚 *Live Order Tracking:* ${trackingUrl}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-4xl">
      <Link href="/orders" className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-emerald-700 mb-6">
        <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to All Orders
      </Link>

      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold">Order #{order.id}</h1>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300 text-xs">
              {formatStatus(order.status)}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Button
            onClick={handleOpenInvoice}
            variant="outline"
            className="h-10 text-xs font-semibold gap-1.5 border-emerald-300 text-emerald-800 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300"
          >
            <FileText className="h-4 w-4" /> Download GST Invoice
          </Button>

          <Button
            onClick={handleShareWhatsApp}
            className="h-10 text-xs font-semibold gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white"
          >
            <MessageCircle className="h-4 w-4" /> Share on WhatsApp
          </Button>

          <div className="sm:text-right sm:border-l sm:pl-4">
            <div className="text-[11px] text-muted-foreground uppercase font-medium">Grand Total</div>
            <div className="font-serif text-2xl font-bold text-emerald-700 dark:text-emerald-400">
              ₹{order.total.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Tracking Bar */}
      {!isCancelled && (
        <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 mb-8 overflow-hidden relative shadow-xs">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-serif font-bold text-base flex items-center gap-2">
              <Truck className="h-4 w-4 text-emerald-600" /> Farm-to-Door Delivery Timeline
            </h3>
            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
              {order.deliverySlot || "Morning Slot (7 AM - 10 AM)"}
            </span>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted -translate-y-1/2 rounded-full" />
            <div 
              className="absolute top-1/2 left-0 h-1 bg-emerald-600 -translate-y-1/2 rounded-full transition-all duration-1000" 
              style={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
            />
            
            <div className="relative flex justify-between">
              {steps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                return (
                  <div key={step} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 transition-colors duration-500 ${
                      isCompleted ? 'bg-emerald-700 text-white shadow-xs' : 'bg-muted text-muted-foreground border-2 border-background'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <div className="w-2 h-2 rounded-full bg-current opacity-50" />}
                    </div>
                    <div className={`mt-2.5 text-[11px] sm:text-xs font-medium text-center ${
                      isCurrent ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-muted-foreground'
                    }`}>
                      {formatStatus(step)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="bg-destructive/10 text-destructive border-destructive/20 border rounded-2xl p-6 mb-8 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <div>
            <h4 className="font-bold text-sm">Order Cancelled</h4>
            <p className="text-xs opacity-90">This order has been cancelled. Any online payment will be refunded to your source account within 24-48 hours.</p>
          </div>
        </div>
      )}

      {/* Grid: Order Items & Delivery Meta */}
      <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card border border-border/80 rounded-3xl overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b bg-muted/30 flex items-center justify-between">
              <h3 className="font-bold text-sm">Items in this Order ({order.items.length})</h3>
              <span className="text-xs text-muted-foreground font-mono">GST Included</span>
            </div>
            <div className="p-6">
              <ul className="divide-y divide-border/60">
                {order.items.map((item, index) => (
                  <li key={index} className="py-4 flex items-center gap-4 first:pt-0 last:pb-0">
                    <div className="h-16 w-16 bg-muted rounded-2xl overflow-hidden shrink-0 border border-border/70">
                      <img
                        src={item.imageUrl || "/images/hero.png"}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-xs sm:text-sm text-foreground truncate">
                        {item.productName}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Qty: {item.quantity} × {item.unit}
                      </p>
                      <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                        100% Bull-Driven / Farm Fresh
                      </div>
                    </div>
                    <div className="font-bold text-sm text-right shrink-0">
                      ₹{(item.price * item.quantity).toFixed(2)}
                      <div className="text-[11px] text-muted-foreground font-normal">
                        ₹{item.price}/ea
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm flex items-center gap-2 border-b pb-3">
              <MapPin className="h-4 w-4 text-emerald-600" /> Delivery Address
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <div className="text-muted-foreground text-[10px] uppercase font-medium">Customer Name</div>
                <div className="font-semibold text-sm mt-0.5">{order.customerName}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-[10px] uppercase font-medium">Contact Phone</div>
                <div className="font-medium mt-0.5 font-mono">{order.customerPhone}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-[10px] uppercase font-medium">Shipping Address</div>
                <div className="font-medium leading-relaxed mt-0.5 text-muted-foreground bg-muted/40 p-2.5 rounded-xl border border-border/50">
                  {order.deliveryAddress}
                </div>
              </div>
              {order.deliveryDate && (
                <div>
                  <div className="text-muted-foreground text-[10px] uppercase font-medium">Expected Delivery Date</div>
                  <div className="font-medium mt-0.5">{new Date(order.deliveryDate).toLocaleDateString("en-IN", { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</div>
                </div>
              )}
              {order.notes && (
                <div>
                  <div className="text-muted-foreground text-[10px] uppercase font-medium">Delivery Instructions</div>
                  <div className="italic text-muted-foreground mt-0.5 bg-muted/30 p-2 rounded-lg">"{order.notes}"</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
