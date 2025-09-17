import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type Product = Database['public']['Tables']['products']['Row']
type Category = Database['public']['Tables']['categories']['Row']
type Sale = Database['public']['Tables']['sales']['Row']
type SaleItem = Database['public']['Tables']['sale_items']['Row']

// Product operations
export const productService = {
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name
        )
      `)
      .eq('is_active', true)
      .order('name')
    
    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async create(product: Database['public']['Tables']['products']['Insert']): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Database['public']['Tables']['products']['Update']): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateStock(id: string, quantity: number): Promise<void> {
    const { error } = await supabase
      .from('products')
      .update({ stock_quantity: quantity })
      .eq('id', id)
    
    if (error) throw error
  },

  async getLowStock(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
    
    if (error) throw error
    const items = data || []
    return items.filter(p => Number(p.stock_quantity) <= Number(p.min_stock_level))
  }
}

// Category operations
export const categoryService = {
  async getAll(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data || []
  },

  async create(category: Database['public']['Tables']['categories']['Insert']): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Sales operations
export const salesService = {
  async create(sale: Database['public']['Tables']['sales']['Insert'], items: Database['public']['Tables']['sale_items']['Insert'][]): Promise<Sale> {
    // Start a transaction
    const { data: saleData, error: saleError } = await supabase
      .from('sales')
      .insert(sale)
      .select()
      .single()
    
    if (saleError) throw saleError

    // Insert sale items
    const saleItemsWithSaleId = items.map(item => ({
      ...item,
      sale_id: saleData.id
    }))

    const { error: itemsError } = await supabase
      .from('sale_items')
      .insert(saleItemsWithSaleId)
    
    if (itemsError) throw itemsError

    // Update product stock
    for (const item of items) {
      const { data: product } = await supabase
        .from('products')
        .select('stock_quantity')
        .eq('id', item.product_id)
        .single()
      
      if (product) {
        await supabase
          .from('products')
          .update({ stock_quantity: product.stock_quantity - item.quantity })
          .eq('id', item.product_id)
      }
    }

    return saleData
  },

  async getRecentSales(limit: number = 10): Promise<Sale[]> {
    const { data, error } = await supabase
      .from('sales')
      .select(`
        *,
        profiles (
          full_name,
          email
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data || []
  },

  async getDailySales(date: string): Promise<{ total: number; count: number }> {
    const { data, error } = await supabase
      .from('sales')
      .select('total_amount')
      .gte('sale_date', `${date}T00:00:00`)
      .lt('sale_date', `${date}T23:59:59`)
    
    if (error) throw error
    
    const total = data?.reduce((sum, sale) => sum + Number(sale.total_amount), 0) || 0
    const count = data?.length || 0
    
    return { total, count }
  },

  async generateSaleNumber(): Promise<string> {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '')
    const { data, error } = await supabase
      .from('sales')
      .select('sale_number')
      .like('sale_number', `${today}-%`)
      .order('sale_number', { ascending: false })
      .limit(1)
    
    if (error) throw error
    
    let nextNumber = 1
    if (data && data.length > 0) {
      const lastNumber = data[0].sale_number.split('-')[1]
      nextNumber = parseInt(lastNumber) + 1
    }
    
    return `${today}-${nextNumber.toString().padStart(4, '0')}`
  }
}

// Analytics operations
export const analyticsService = {
  async getDashboardMetrics(): Promise<{
    todaySales: { total: number; count: number }
    lowStockCount: number
    totalProducts: number
    recentSales: Sale[]
  }> {
    const today = new Date().toISOString().split('T')[0]
    
    const [todaySales, lowStockProducts, allProducts, recentSales] = await Promise.all([
      salesService.getDailySales(today),
      productService.getLowStock(),
      productService.getAll(),
      salesService.getRecentSales(5)
    ])
    
    return {
      todaySales,
      lowStockCount: lowStockProducts.length,
      totalProducts: allProducts.length,
      recentSales
    }
  }
}