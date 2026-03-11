import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { CartProvider } from "@/contexts/CartContext";
import PublicLayout from "@/components/layout/PublicLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import HomePage from "@/pages/HomePage";
import ProductsPage from "@/pages/ProductsPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderConfirmedPage from "@/pages/OrderConfirmedPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ContactPage from "@/pages/ContactPage";
import LegalPage from "@/pages/LegalPage";
import AdminOverview from "@/pages/admin/AdminOverview";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminInventory from "@/pages/admin/AdminInventory";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminCustomers from "@/pages/admin/AdminCustomers";
import AdminCMS from "@/pages/admin/AdminCMS";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";
import AdminSettings from "@/pages/admin/AdminSettings";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <CurrencyProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:categorySlug" element={<ProductsPage />} />
                  <Route path="/product/:slug" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-confirmed" element={<OrderConfirmedPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/terms" element={<LegalPage title="Terms & Conditions"><p>These Terms and Conditions govern your use of the REMQUIP platform and purchase of products through our website. By placing an order, you agree to be bound by these terms.</p><p>All prices are listed in Canadian Dollars (CAD) unless otherwise specified. Prices are subject to change without notice. Orders are subject to acceptance and availability.</p><p>REMQUIP reserves the right to refuse or cancel any order at its discretion. Payment must be received in full before shipment of goods.</p><p>These terms shall be governed by and construed in accordance with the laws of the Province of Quebec, Canada.</p></LegalPage>} />
                  <Route path="/privacy" element={<LegalPage title="Privacy Policy"><p>REMQUIP is committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your personal information.</p><p>We collect information you provide directly, including name, email, shipping address, and payment information when placing orders. This information is used solely for order processing and customer service.</p><p>We do not sell, trade, or otherwise transfer your personal information to outside parties without your consent, except as required to fulfill your order.</p></LegalPage>} />
                  <Route path="/shipping" element={<LegalPage title="Shipping & Returns"><p>REMQUIP ships across Canada and to select US destinations. Standard shipping is calculated at checkout based on weight and destination.</p><p>Orders over C$500 qualify for free shipping within Canada. Most orders ship within 1-2 business days from our Quebec warehouse.</p><p>Returns are accepted within 30 days of delivery for unused products in original packaging. A restocking fee of 15% may apply. Defective products are replaced at no charge.</p></LegalPage>} />
                  <Route path="/refund" element={<LegalPage title="Refund Policy"><p>Refunds are processed within 5-10 business days after we receive the returned product. Refunds are issued to the original payment method.</p><p>Custom orders and special-order items are non-refundable. Shipping costs are non-refundable unless the return is due to our error.</p></LegalPage>} />
                  <Route path="/cookie" element={<LegalPage title="Cookie Policy"><p>REMQUIP uses cookies to enhance your browsing experience. Cookies are small text files stored on your device that help us remember your preferences.</p><p>We use essential cookies for site functionality and analytics cookies to understand how visitors use our site. You can control cookie settings through your browser.</p></LegalPage>} />
                  <Route path="/about" element={<LegalPage title="About REMQUIP"><p>REMQUIP is Canada's next-generation heavy-duty parts distributor, based in Quebec City and serving fleets, distributors, and OEMs nationwide since 2025.</p><p>We specialize in heavy-duty brakes and air suspension components for commercial trucks and trailers. Our commitment to quality, competitive pricing, and fast shipping sets us apart.</p><p>With 15+ years of combined industry experience, our team understands the demands of the heavy-duty transportation industry and delivers the parts you need, when you need them.</p></LegalPage>} />
                </Route>

                {/* Admin */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminOverview />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="inventory" element={<AdminInventory />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="cms" element={<AdminCMS />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </CurrencyProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
