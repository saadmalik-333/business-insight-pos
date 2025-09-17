import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uqhnghycvrtliuvgbvgp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxaG5naHljdnJ0bGl1dmdidmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMDE0NjMsImV4cCI6MjA3MzY3NzQ2M30.xA8Uye7KSyrOsEU11hZ0WaEm2bZHB_QZiXzmSMpYhmQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'admin' | 'cashier'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'admin' | 'cashier'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'admin' | 'cashier'
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          cost: number
          sku: string
          category_id: string
          stock_quantity: number
          min_stock_level: number
          is_active: boolean
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          cost: number
          sku: string
          category_id: string
          stock_quantity?: number
          min_stock_level?: number
          is_active?: boolean
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          cost?: number
          sku?: string
          category_id?: string
          stock_quantity?: number
          min_stock_level?: number
          is_active?: boolean
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      sales: {
        Row: {
          id: string
          sale_number: string
          customer_name: string | null
          subtotal: number
          tax_amount: number
          total_amount: number
          payment_method: 'cash' | 'card' | 'digital'
          cashier_id: string
          sale_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sale_number: string
          customer_name?: string | null
          subtotal: number
          tax_amount: number
          total_amount: number
          payment_method: 'cash' | 'card' | 'digital'
          cashier_id: string
          sale_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sale_number?: string
          customer_name?: string | null
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          payment_method?: 'cash' | 'card' | 'digital'
          cashier_id?: string
          sale_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      sale_items: {
        Row: {
          id: string
          sale_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: string
          sale_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
          created_at?: string
        }
        Update: {
          id?: string
          sale_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          created_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          description: string
          amount: number
          category: string
          expense_date: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          description: string
          amount: number
          category: string
          expense_date?: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          description?: string
          amount?: number
          category?: string
          expense_date?: string
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'cashier'
      payment_method: 'cash' | 'card' | 'digital'
    }
  }
}