import { useGetOrder } from "@workspace/api-client-react";
import { Link } from "wouter";
import { ArrowLeft, Package, MapPin, Calendar, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function OrderDetail({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const { data: order, isLoading } = useGetOrder(id, { query: { enabled: !!id } });

  if (isLoading) return <div className="p-12 text-center">Loading order...</div>;
  if (!order) return <div className="p-12 text-center">Order not found</div>;

  const formatStatus = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const steps = ['pending', 'confirmed', 'out_for_delivery', 'delivered'];
  const currentStepIndex = steps.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
      <Link href="/orders" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="font-serif text-3xl font-bold mb-2">Order #{order.id}</h1>
          <p className="text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' })}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground mb-1">Total Amount</div>
          <div className="font-serif text-3xl font-bold text-primary">₹{order.total.toFixed(2)}</div>
        </div>
      </div>

      {!isCancelled && (
        <div className="bg-card border rounded-3xl p-8 mb-10 overflow-hidden relative">
          <h3 className="font-bold mb-8">Delivery Status</h3>
          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted -translate-y-1/2 rounded-full" />
            <div 
              className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full transition-all duration-1000" 
              style={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
            />
            
            <div className="relative flex justify-between">
              {steps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                return (
                  <div key={step} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 transition-colors duration-500 ${isCompleted ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground border-2 border-background'}`}>
                      {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <div className="w-2.5 h-2.5 rounded-full bg-current opacity-50" />}
                    </div>
                    <div className={`mt-3 text-xs md:text-sm font-medium ${isCurrent ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
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
        <div className="bg-destructive/10 text-destructive border-destructive/20 border rounded-2xl p-6 mb-10 flex items-center gap-3">
          <div className="bg-destructive/20 p-2 rounded-full">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold">Order Cancelled</h4>
            <p className="text-sm opacity-90">This order has been cancelled and will not be delivered.</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card border rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b bg-muted/30">
              <h3 className="font-bold">Items in this order</h3>
            </div>
            <div className="p-6">
              <ul className="divide-y">
                {order.items.map((item, index) => (
                  <li key={index} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                    <div className="h-16 w-16 bg-muted rounded-xl overflow-hidden shrink-0 border">
                      {item.imageUrl && <img src={item.imageUrl} alt={item.productName} className="h-full w-full object-cover" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.productName}</h4>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity} × {item.unit}</p>
                    </div>
                    <div className="font-medium text-right">
                      ₹{(item.price * item.quantity).toFixed(2)}
                      <div className="text-xs text-muted-foreground font-normal">₹{item.price}/ea</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border rounded-3xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" /> Delivery Details
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-muted-foreground mb-1">Customer Name</div>
                <div className="font-medium">{order.customerName}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Phone Number</div>
                <div className="font-medium">{order.customerPhone}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Address</div>
                <div className="font-medium leading-relaxed">{order.deliveryAddress}</div>
              </div>
              {order.deliveryDate && (
                <div>
                  <div className="text-muted-foreground mb-1">Expected Delivery</div>
                  <div className="font-medium">{new Date(order.deliveryDate).toLocaleDateString()}</div>
                </div>
              )}
              {order.notes && (
                <div>
                  <div className="text-muted-foreground mb-1">Notes</div>
                  <div className="font-medium italic bg-muted/50 p-2 rounded-md">{order.notes}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
