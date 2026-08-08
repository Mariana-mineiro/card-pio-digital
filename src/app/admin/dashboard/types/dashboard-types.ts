export interface Settings {
  id: string;
  restaurant_name: string;
  is_open: boolean;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  created_at?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category_id?: string;
  is_available: boolean;
  created_at?: string;
}
