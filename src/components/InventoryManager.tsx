import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { productService, categoryService } from "@/lib/database";
import {
  Package,
  Plus,
  Search,
  Edit3,
  Trash2,
  AlertTriangle,
  DollarSign
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  minStock: number;
  cost: number;
  sku: string;
}

const mockProducts: Product[] = [
  { id: "1", name: "Classic Burger", price: 12.99, category: "Burgers", stock: 15, minStock: 10, cost: 6.50, sku: "BRG001" },
  { id: "2", name: "Crispy Fries", price: 4.99, category: "Sides", stock: 5, minStock: 15, cost: 2.25, sku: "SID001" },
  { id: "3", name: "Cola", price: 2.99, category: "Drinks", stock: 25, minStock: 20, cost: 0.75, sku: "DRK001" },
  { id: "4", name: "Chicken Sandwich", price: 10.99, category: "Burgers", stock: 3, minStock: 8, cost: 5.25, sku: "BRG002" },
  { id: "5", name: "Milkshake", price: 5.99, category: "Drinks", stock: 18, minStock: 12, cost: 2.50, sku: "DRK002" },
  { id: "6", name: "Onion Rings", price: 3.99, category: "Sides", stock: 22, minStock: 15, cost: 1.75, sku: "SID002" },
];

const InventoryManager = () => {
const [products, setProducts] = useState<Product[]>([]);
const [searchTerm, setSearchTerm] = useState("");
const [selectedCategory, setSelectedCategory] = useState("All");
const [allCategories, setAllCategories] = useState<{ id: string; name: string }[]>([]);
const [addOpen, setAddOpen] = useState(false);
const [saving, setSaving] = useState(false);
const [newProduct, setNewProduct] = useState({
  name: "",
  sku: "",
  category_id: "",
  price: "",
  cost: "",
  stock_quantity: "",
  min_stock_level: "",
});

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
  const totalValue = products.reduce((sum, p) => sum + (p.stock * p.cost), 0);
  const totalProducts = products.length;

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) return { status: "Out of Stock", variant: "destructive" as const, className: "bg-destructive/20 text-destructive border-destructive/30" };
    if (product.stock <= product.minStock) return { status: "Low Stock", variant: "secondary" as const, className: "bg-warning/20 text-warning border-warning/30" };
    return { status: "In Stock", variant: "secondary" as const, className: "bg-success/20 text-success border-success/30" };
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Inventory Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your products and stock levels
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary-dark/10 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Total Products</p>
              <p className="text-2xl font-bold">{totalProducts}</p>
            </div>
            <Package className="w-8 h-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-warning/10 to-warning/20 border-warning/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Low Stock Items</p>
              <p className="text-2xl font-bold">{lowStockCount}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-warning" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-success/10 to-success/20 border-success/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Inventory Value</p>
              <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-success" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/20 border-accent/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Categories</p>
              <p className="text-2xl font-bold">{categories.length - 1}</p>
            </div>
            <Package className="w-8 h-8 text-accent" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search products or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th className="text-left p-4 font-semibold">Product</th>
                <th className="text-left p-4 font-semibold">SKU</th>
                <th className="text-left p-4 font-semibold">Category</th>
                <th className="text-right p-4 font-semibold">Stock</th>
                <th className="text-right p-4 font-semibold">Min Stock</th>
                <th className="text-right p-4 font-semibold">Cost</th>
                <th className="text-right p-4 font-semibold">Price</th>
                <th className="text-center p-4 font-semibold">Status</th>
                <th className="text-center p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product);
                const profit = ((product.price - product.cost) / product.cost * 100);
                
                return (
                  <tr key={product.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
                          <span className="text-lg">🍔</span>
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Margin: {profit.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-sm">{product.sku}</td>
                    <td className="p-4">
                      <Badge variant="outline">{product.category}</Badge>
                    </td>
                    <td className="p-4 text-right font-medium">{product.stock}</td>
                    <td className="p-4 text-right text-muted-foreground">{product.minStock}</td>
                    <td className="p-4 text-right">${product.cost.toFixed(2)}</td>
                    <td className="p-4 text-right font-semibold">${product.price.toFixed(2)}</td>
                    <td className="p-4 text-center">
                      <Badge variant={stockStatus.variant} className={stockStatus.className}>{stockStatus.status}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1">
                        <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="w-8 h-8 p-0 text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Low Stock Alert */}
      {lowStockCount > 0 && (
        <Card className="p-6 bg-gradient-to-br from-warning/10 to-warning/20 border-warning/30">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-warning mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Low Stock Alert</h3>
              <p className="text-muted-foreground mt-1">
                {lowStockCount} product{lowStockCount !== 1 ? 's' : ''} running low on stock. Consider restocking soon.
              </p>
              <Button size="sm" className="mt-3">
                View Low Stock Items
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default InventoryManager;