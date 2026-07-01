export interface Category {
  id: string;
  name: string;
  color_hex: string;
  icon: string;
}

export interface Task {
  id: string;
  title: string;
  pyramid_level: number;
  category_id: string;
  status: "pending" | "completed";
  target_date: string;
  completed_at: string | null;
}


