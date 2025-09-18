import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { productService, categoryService, salesService } from "@/lib/database";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  DollarSign,
  Search,
  Scan,
  Printer
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  category_id: string;
  stock_quantity: number;
  cost: number;
  sku: string;
  categories?: {
    name: string;
  };
}

interface CartItem extends Product {
  quantity: number;
}

const POSInterface = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          productService.getAll(),
          categoryService.getAll()
        ]);
        setProducts(productsData);
        setCategories([{ name: "All" }, ...categoriesData]);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const filteredProducts = products.filter(product => {
    const categoryName = product.categories?.name || '';
    const matchesCategory = selectedCategory === "All" || categoryName === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock_quantity) }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCart(prevCart => prevCart.filter(item => item.id !== id));
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const printReceipt = (saleNumber: string, items: CartItem[], subtotal: number, taxAmount: number, totalAmount: number) => {
    const receiptHtml = `
      <html>
        <head>
          <title>Receipt ${saleNumber}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial; padding: 16px; }
            h1 { font-size: 18px; margin: 0 0 8px; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            th, td { text-align: left; padding: 6px 0; border-bottom: 1px dotted #ccc; font-size: 12px; }
            tfoot td { font-weight: 700; }
          </style>
        </head>
        <body>
          <h1>SmartPOS Pro</h1>
          <div>Sale #: ${saleNumber}</div>
          <div>Date: ${new Date().toLocaleString()}</div>
          <table>
            <thead>
              <tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>
            </thead>
            <tbody>
              ${items.map(i => `<tr><td>${i.name}</td><td>${i.quantity}</td><td>$${i.price.toFixed(2)}</td><td>$${(i.price * i.quantity).toFixed(2)}</td></tr>`).join('')}
            </tbody>
            <tfoot>
              <tr><td colspan="3">Subtotal</td><td>$${subtotal.toFixed(2)}</td></tr>
              <tr><td colspan="3">Tax (8%)</td><td>$${taxAmount.toFixed(2)}</td></tr>
              <tr><td colspan="3">Total</td><td>$${totalAmount.toFixed(2)}</td></tr>
            </tfoot>
          </table>
          <p style="margin-top:12px; font-size:12px;">Thank you!</p>
          <script>window.onload = () => { window.print(); setTimeout(() => window.close(), 300); };</script>
        </body>
      </html>
    `;
    const w = window.open('', '_blank', 'width=400,height=600');
    if (w) {
      w.document.open();
      w.document.write(receiptHtml);
      w.document.close();
    }
  };

  const handleCheckout = async (paymentMethod: 'cash' | 'card') => {
    if (cart.length === 0 || !user || processing) return;

    setProcessing(true);
    try {
      const saleNumber = await salesService.generateSaleNumber();
      const subtotal = cartTotal;
      const taxAmount = cartTotal * 0.08;
      const totalAmount = subtotal + taxAmount;
      const cartSnapshot = [...cart];

      const sale = {
        sale_number: saleNumber,
        customer_name: null,
        subtotal,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        payment_method: paymentMethod,
        cashier_id: user.id,
      };

      const saleItems = cartSnapshot.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
        sale_id: '', // Will be set by the service
      }));

      await salesService.create(sale, saleItems);

      toast({
        title: "Sale Completed!",
        description: `Transaction ${saleNumber} processed successfully.`,
      });

      // Print receipt
      printReceipt(saleNumber, cartSnapshot, subtotal, taxAmount, totalAmount);

      // Notify other views (e.g., Dashboard) to refresh
      window.dispatchEvent(new Event('sales:updated'));

      setCart([]);
      
      // Refresh products to update stock
      const updatedProducts = await productService.getAll();
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout Failed",
        description: "There was an error processing the sale. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Product Selection */}
      <div className="lg:col-span-2 space-y-6">
        {/* Search and Categories */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Button size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <Scan className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.name)}
                className="transition-all duration-200"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map(product => (
            <Card 
              key={product.id}
              className="p-4 hover:scale-105 transition-all duration-200 cursor-pointer bg-card/80 backdrop-blur-sm border-border/50"
              onClick={() => addToCart(product)}
            >
              <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg mb-3 flex items-center justify-center">
                <span className="text-3xl">🍔</span>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm leading-tight">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">${product.price}</span>
                  <Badge variant={product.stock_quantity < 10 ? "destructive" : "secondary"} className="text-xs">
                    {product.stock_quantity} left
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart */}
      <div className="space-y-6">
        <Card className="p-6 h-fit">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Cart ({cartItemCount})
            </h2>
            {cart.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCart([])}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Your cart is empty</p>
              <p className="text-sm">Add products to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">${item.price} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 p-0"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock_quantity}
                      className="w-8 h-8 p-0"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {cart.length > 0 && (
            <div className="space-y-4 mt-6 pt-6 border-t border-border">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (8%):</span>
                  <span>${(cartTotal * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                  <span>Total:</span>
                  <span>${(cartTotal * 1.08).toFixed(2)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => handleCheckout('cash')}
                  disabled={processing}
                >
                  <DollarSign className="w-4 h-4" />
                  {processing ? "Processing..." : "Cash"}
                </Button>
                <Button 
                  onClick={() => handleCheckout('card')} 
                  className="flex items-center gap-2"
                  disabled={processing}
                >
                  <CreditCard className="w-4 h-4" />
                  {processing ? "Processing..." : "Card"}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default POSInterface;