import { useListOrders } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Package, ChevronRight, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Orders() {
  const { data: orders, isLoading } = useListOrders();

  if (isLoading) return <div className="p-12 text-center">Loading orders...</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'out_for_delivery': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
      <h1 className="font-serif text-4xl font-bold mb-8">Order History</h1>

      {!orders || orders.length === 0 ? (
        <div className="text-center py-24 bg-muted/30 rounded-3xl border border-dashed">
          <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4 opacity-50" />
          <h2 className="text-2xl font-serif font-bold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-8">When you place an order, it will appear here.</p>
          <Link href="/products" className="text-primary font-medium hover:underline">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Link key={order.id} href={`/orders/${order.id}`} className="block group">
              <div className="bg-card border rounded-2xl p-6 transition-all hover:shadow-md hover:border-primary/40">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-bold text-lg mb-1">Order #{order.id}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-serif font-bold text-xl">₹{order.total.toFixed(2)}</span>
                    <Badge variant="outline" className={`${getStatusColor(order.status)}`}>
                      {formatStatus(order.status)}
                    </Badge>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-3 overflow-hidden">
                      {order.items.slice(0, 5).map((item, i) => (
                        <div key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-background bg-muted overflow-hidden">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.productName} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full bg-secondary/20" />
                          )}
                        </div>
                      ))}
                      {order.items.length > 5 && (
                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-background bg-muted text-xs font-medium">
                          +{order.items.length - 5}
                        </div>
                      )}
                    </div>
                    <div className="text-sm font-medium text-primary flex items-center group-hover:translate-x-1 transition-transform">
                      View details <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
