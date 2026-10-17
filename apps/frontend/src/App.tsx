import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/app-layout";
import { AuthProvider } from "@/context/auth-context";
import { PincodeProvider } from "@/context/pincode-context";

import Home from "@/pages/home";
import Products from "@/pages/products";
import ProductDetail from "@/pages/product-detail";
import Farms from "@/pages/farms";
import FarmDetail from "@/pages/farm-detail";
import Boxes from "@/pages/boxes";
import Cart from "@/pages/cart";
import Checkout from "@/pages/checkout";
import Orders from "@/pages/orders";
import OrderDetail from "@/pages/order-detail";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import AdminDashboard from "@/pages/admin/index";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* Full-page routes (no nav/footer shell) */}
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/admin" component={AdminDashboard} />

      {/* App shell routes */}
      <Route>
        <AppLayout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/products" component={Products} />
            <Route path="/products/:id" component={ProductDetail} />
            <Route path="/farms" component={Farms} />
            <Route path="/farms/:id" component={FarmDetail} />
            <Route path="/boxes" component={Boxes} />
            <Route path="/cart" component={Cart} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/orders" component={Orders} />
            <Route path="/orders/:id" component={OrderDetail} />
            <Route component={NotFound} />
          </Switch>
        </AppLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PincodeProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </PincodeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
