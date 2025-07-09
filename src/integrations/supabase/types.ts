export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_images: {
        Row: {
          created_at: string
          id: number
          image_data: string | null
          section: string
          slot: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          image_data?: string | null
          section: string
          slot?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          image_data?: string | null
          section?: string
          slot?: number | null
        }
        Relationships: []
      }
      booking_matrix: {
        Row: {
          customer_id: string
          data: Json | null
        }
        Insert: {
          customer_id: string
          data?: Json | null
        }
        Update: {
          customer_id?: string
          data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_matrix_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: true
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      chat: {
        Row: {
          chat_start_time: string | null
          customer_id: string | null
          id: string
          vendor_id: string | null
        }
        Insert: {
          chat_start_time?: string | null
          customer_id?: string | null
          id?: string
          vendor_id?: string | null
        }
        Update: {
          chat_start_time?: string | null
          customer_id?: string | null
          id?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_matrix: {
        Row: {
          customer_id: string
          data: Json | null
        }
        Insert: {
          customer_id: string
          data?: Json | null
        }
        Update: {
          customer_id?: string
          data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_matrix_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: true
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          message: string
          sender: string
          timestamp: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          message: string
          sender: string
          timestamp?: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          message?: string
          sender?: string
          timestamp?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_profiles: {
        Row: {
          created_at: string | null
          customer_id: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_profiles_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string | null
          email: string
          gender: string | null
          id: string
          name: string | null
          phone_number: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          gender?: string | null
          id?: string
          name?: string | null
          phone_number?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          gender?: string | null
          id?: string
          name?: string | null
          phone_number?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      login_cus: {
        Row: {
          customer_id: string | null
          id: string
          login_time: string | null
        }
        Insert: {
          customer_id?: string | null
          id?: string
          login_time?: string | null
        }
        Update: {
          customer_id?: string | null
          id?: string
          login_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "login_cus_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      login_ven: {
        Row: {
          id: string
          login_time: string | null
          vendor_id: string | null
        }
        Insert: {
          id?: string
          login_time?: string | null
          vendor_id?: string | null
        }
        Update: {
          id?: string
          login_time?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "login_ven_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_table: {
        Row: {
          amount: number | null
          id: string
          payment_date: string | null
          plan_selected: string | null
          vendor_id: string | null
        }
        Insert: {
          amount?: number | null
          id?: string
          payment_date?: string | null
          plan_selected?: string | null
          vendor_id?: string | null
        }
        Update: {
          amount?: number | null
          id?: string
          payment_date?: string | null
          plan_selected?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_table_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      reply_matrix: {
        Row: {
          customer_id: string
          data: Json | null
        }
        Insert: {
          customer_id: string
          data?: Json | null
        }
        Update: {
          customer_id?: string
          data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "reply_matrix_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: true
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      review_matrix: {
        Row: {
          reviews: Json | null
          vendor_id: string
        }
        Insert: {
          reviews?: Json | null
          vendor_id: string
        }
        Update: {
          reviews?: Json | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_matrix_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: true
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_details: {
        Row: {
          email: string | null
          id: string
          no_of_images: number | null
          overall_gr: number | null
          question_com: string | null
          review: string | null
          subscription: string | null
          vendor_id: string | null
        }
        Insert: {
          email?: string | null
          id?: string
          no_of_images?: number | null
          overall_gr?: number | null
          question_com?: string | null
          review?: string | null
          subscription?: string | null
          vendor_id?: string | null
        }
        Update: {
          email?: string | null
          id?: string
          no_of_images?: number | null
          overall_gr?: number | null
          question_com?: string | null
          review?: string | null
          subscription?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_details_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_images: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string
          title: string | null
          updated_at: string
          uploaded_at: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          title?: string | null
          updated_at?: string
          uploaded_at?: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          title?: string | null
          updated_at?: string
          uploaded_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_images_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_pro: {
        Row: {
          category_display: string | null
          id: string
          product_details: string | null
          vendor_id: string | null
        }
        Insert: {
          category_display?: string | null
          id?: string
          product_details?: string | null
          vendor_id?: string | null
        }
        Update: {
          category_display?: string | null
          id?: string
          product_details?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_pro_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          aadhar: string | null
          address: string | null
          age: number | null
          business_name: string | null
          categories: string[] | null
          created_at: string | null
          email: string
          gender: string | null
          gst: string | null
          id: string
          pan: string | null
          phone_number: string | null
          user_id: string | null
          vendor_name: string | null
        }
        Insert: {
          aadhar?: string | null
          address?: string | null
          age?: number | null
          business_name?: string | null
          categories?: string[] | null
          created_at?: string | null
          email: string
          gender?: string | null
          gst?: string | null
          id?: string
          pan?: string | null
          phone_number?: string | null
          user_id?: string | null
          vendor_name?: string | null
        }
        Update: {
          aadhar?: string | null
          address?: string | null
          age?: number | null
          business_name?: string | null
          categories?: string[] | null
          created_at?: string | null
          email?: string
          gender?: string | null
          gst?: string | null
          id?: string
          pan?: string | null
          phone_number?: string | null
          user_id?: string | null
          vendor_name?: string | null
        }
        Relationships: []
      }
      visiting_matrix: {
        Row: {
          customer_id: string
          data: Json | null
        }
        Insert: {
          customer_id: string
          data?: Json | null
        }
        Update: {
          customer_id?: string
          data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "visiting_matrix_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: true
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      expire_booking_interactions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      verify_vendor_for_password_reset: {
        Args: { p_email: string; p_pan: string; p_phone: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
