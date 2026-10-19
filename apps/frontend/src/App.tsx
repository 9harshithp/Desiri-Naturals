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

import React, { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught application error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#111008] text-white p-6">
          <div className="max-w-md text-center space-y-4">
            <h1 className="text-2xl font-serif font-bold text-[#e8c97e]">Desiri Naturals</h1>
            <p className="text-white/70 text-sm">
              We encountered a temporary hiccup while loading the store.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-6 py-2.5 rounded-full bg-[#C4602A] text-white text-sm font-semibold hover:bg-[#a84e22] transition-colors"
            >
              Refresh Store
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

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
            <ErrorBoundary>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <Router />
              </WouterRouter>
              <Toaster />
            </ErrorBoundary>
          </TooltipProvider>
        </PincodeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
