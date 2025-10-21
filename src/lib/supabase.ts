import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          phone?: string
          role: string
          department?: string
          team?: string
          birth_date?: string
          cpf_cnpj?: string
          status: 'active' | 'inactive' | 'suspended'
          permissions: string[]
          created_at: string
          updated_at: string
          last_login?: string
          avatar_url?: string
          position?: string
          additional_data?: Record<string, any>
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          phone?: string
          role?: string
          department?: string
          team?: string
          birth_date?: string
          cpf_cnpj?: string
          status?: 'active' | 'inactive' | 'suspended'
          permissions?: string[]
          created_at?: string
          updated_at?: string
          last_login?: string
          avatar_url?: string
          position?: string
          additional_data?: Record<string, any>
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string
          role?: string
          department?: string
          team?: string
          birth_date?: string
          cpf_cnpj?: string
          status?: 'active' | 'inactive' | 'suspended'
          permissions?: string[]
          created_at?: string
          updated_at?: string
          last_login?: string
          avatar_url?: string
          position?: string
          additional_data?: Record<string, any>
        }
      }
      roles: {
        Row: {
          id: string
          name: string
          description?: string
          permissions: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          permissions?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          permissions?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      user_activity_logs: {
        Row: {
          id: string
          user_id: string
          action: string
          details?: Record<string, any>
          ip_address?: string
          user_agent?: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          details?: Record<string, any>
          ip_address?: string
          user_agent?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          details?: Record<string, any>
          ip_address?: string
          user_agent?: string
          created_at?: string
        }
      }
      invitations: {
        Row: {
          id: string
          email: string
          role: string
          invited_by: string
          token: string
          expires_at: string
          status: 'pending' | 'accepted' | 'expired'
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          role: string
          invited_by: string
          token: string
          expires_at: string
          status?: 'pending' | 'accepted' | 'expired'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: string
          invited_by?: string
          token?: string
          expires_at?: string
          status?: 'pending' | 'accepted' | 'expired'
          created_at?: string
        }
      }
    }
  }
}