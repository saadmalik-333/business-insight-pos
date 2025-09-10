-- Enable RLS (Row Level Security) on all tables
-- This SQL will create the database schema for the POS system

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'cashier');
CREATE TYPE payment_method AS ENUM ('cash', 'card', 'digital');

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role user_role DEFAULT 'cashier',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    sku TEXT NOT NULL UNIQUE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    stock_quantity INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sale_number TEXT NOT NULL UNIQUE,
    customer_name TEXT,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method payment_method NOT NULL,
    cashier_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    sale_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sale_items table
CREATE TABLE IF NOT EXISTS sale_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category TEXT NOT NULL,
    expense_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Admins can manage all profiles" ON profiles FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Categories policies (all authenticated users can read, only admins can modify)
CREATE POLICY "Anyone can view categories" ON categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only admins can manage categories" ON categories FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Products policies (all authenticated users can read, only admins can modify)
CREATE POLICY "Anyone can view products" ON products FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only admins can manage products" ON products FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Sales policies (all authenticated users can read and create, only admins can update/delete)
CREATE POLICY "Anyone can view sales" ON sales FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can create sales" ON sales FOR INSERT TO authenticated USING (true);
CREATE POLICY "Only admins can update sales" ON sales FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can delete sales" ON sales FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Sale items policies
CREATE POLICY "Anyone can view sale items" ON sale_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can create sale items" ON sale_items FOR INSERT TO authenticated USING (true);
CREATE POLICY "Only admins can update sale items" ON sale_items FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can delete sale items" ON sale_items FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Expenses policies
CREATE POLICY "Anyone can view expenses" ON expenses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can create expenses" ON expenses FOR INSERT TO authenticated USING (true);
CREATE POLICY "Only admins can update expenses" ON expenses FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can delete expenses" ON expenses FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sales_updated_at BEFORE UPDATE ON sales FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data
INSERT INTO categories (name, description) VALUES
    ('Burgers', 'All types of burgers and sandwiches'),
    ('Sides', 'Side dishes and appetizers'),
    ('Drinks', 'Beverages including soft drinks and juices'),
    ('Desserts', 'Sweet treats and desserts')
ON CONFLICT (name) DO NOTHING;

-- Get category IDs for sample products
DO $$
DECLARE
    burger_id UUID;
    sides_id UUID;
    drinks_id UUID;
    desserts_id UUID;
BEGIN
    SELECT id INTO burger_id FROM categories WHERE name = 'Burgers';
    SELECT id INTO sides_id FROM categories WHERE name = 'Sides';
    SELECT id INTO drinks_id FROM categories WHERE name = 'Drinks';
    SELECT id INTO desserts_id FROM categories WHERE name = 'Desserts';

    INSERT INTO products (name, description, price, cost, sku, category_id, stock_quantity, min_stock_level) VALUES
        ('Classic Burger', 'Juicy beef patty with lettuce, tomato, and cheese', 12.99, 6.50, 'BRG001', burger_id, 15, 10),
        ('Chicken Sandwich', 'Grilled chicken breast with mayo and pickles', 10.99, 5.25, 'BRG002', burger_id, 12, 8),
        ('Veggie Burger', 'Plant-based patty with fresh vegetables', 11.99, 5.75, 'BRG003', burger_id, 8, 5),
        ('Crispy Fries', 'Golden crispy french fries', 4.99, 2.25, 'SID001', sides_id, 30, 15),
        ('Onion Rings', 'Beer-battered onion rings', 3.99, 1.75, 'SID002', sides_id, 22, 15),
        ('Mozzarella Sticks', 'Breaded mozzarella with marinara sauce', 6.99, 3.25, 'SID003', sides_id, 18, 10),
        ('Cola', 'Classic cola soft drink', 2.99, 0.75, 'DRK001', drinks_id, 25, 20),
        ('Milkshake', 'Vanilla milkshake with whipped cream', 5.99, 2.50, 'DRK002', drinks_id, 18, 12),
        ('Orange Juice', 'Fresh squeezed orange juice', 3.99, 1.25, 'DRK003', drinks_id, 15, 10),
        ('Chocolate Cake', 'Rich chocolate cake slice', 7.99, 3.50, 'DST001', desserts_id, 10, 5),
        ('Ice Cream', 'Vanilla ice cream scoop', 4.99, 2.00, 'DST002', desserts_id, 20, 8)
    ON CONFLICT (sku) DO NOTHING;
END $$;