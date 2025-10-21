import { supabase } from './supabase'
import { User, CreateUserData, UpdateUserData, UserFilters, Invitation, UserActivityLog, Role, CSVUserData, ImportResult } from './types'

// Serviços para gerenciamento de usuários
export class UserService {
  // Listar usuários com filtros
  static async getUsers(filters: UserFilters = {}) {
    let query = supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (filters.search) {
      query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
    }

    if (filters.role) {
      query = query.eq('role', filters.role)
    }

    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    if (filters.department) {
      query = query.eq('department', filters.department)
    }

    if (filters.team) {
      query = query.eq('team', filters.team)
    }

    const { data, error } = await query

    if (error) throw error
    return data as User[]
  }

  // Buscar usuário por ID
  static async getUserById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as User
  }

  // Criar novo usuário
  static async createUser(userData: CreateUserData) {
    const { data, error } = await supabase
      .from('users')
      .insert({
        ...userData,
        status: 'active',
        permissions: userData.permissions || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    
    // Log da atividade
    await this.logActivity(data.id, 'user_created', { user_data: userData })
    
    return data as User
  }

  // Atualizar usuário
  static async updateUser(userData: UpdateUserData) {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...userData,
        updated_at: new Date().toISOString()
      })
      .eq('id', userData.id)
      .select()
      .single()

    if (error) throw error
    
    // Log da atividade
    await this.logActivity(userData.id, 'user_updated', { changes: userData })
    
    return data as User
  }

  // Alterar status do usuário
  static async updateUserStatus(id: string, status: 'active' | 'inactive' | 'suspended') {
    const { data, error } = await supabase
      .from('users')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    
    // Log da atividade
    await this.logActivity(id, 'status_changed', { new_status: status })
    
    return data as User
  }

  // Deletar usuário
  static async deleteUser(id: string) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)

    if (error) throw error
    
    // Log da atividade
    await this.logActivity(id, 'user_deleted', {})
  }

  // Convidar usuário por email
  static async inviteUser(email: string, role: string, invitedBy: string) {
    const token = crypto.randomUUID()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // Expira em 7 dias

    const { data, error } = await supabase
      .from('invitations')
      .insert({
        email,
        role,
        invited_by: invitedBy,
        token,
        expires_at: expiresAt.toISOString(),
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    // Aqui você integraria com um serviço de email
    // Por exemplo: await EmailService.sendInvitation(email, token)
    
    return data as Invitation
  }

  // Importar usuários via CSV
  static async importUsersFromCSV(csvData: CSVUserData[]): Promise<ImportResult> {
    const result: ImportResult = {
      success: 0,
      errors: []
    }

    for (let i = 0; i < csvData.length; i++) {
      const userData = csvData[i]
      
      try {
        // Validar dados obrigatórios
        if (!userData.email || !userData.full_name || !userData.role) {
          result.errors.push({
            row: i + 1,
            email: userData.email || 'N/A',
            error: 'Campos obrigatórios faltando (email, nome, função)'
          })
          continue
        }

        // Verificar se usuário já existe
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', userData.email)
          .single()

        if (existingUser) {
          result.errors.push({
            row: i + 1,
            email: userData.email,
            error: 'Usuário já existe'
          })
          continue
        }

        // Criar usuário
        await this.createUser(userData as CreateUserData)
        result.success++
        
      } catch (error) {
        result.errors.push({
          row: i + 1,
          email: userData.email,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        })
      }
    }

    return result
  }

  // Log de atividades
  static async logActivity(userId: string, action: string, details: Record<string, any>) {
    await supabase
      .from('user_activity_logs')
      .insert({
        user_id: userId,
        action,
        details,
        created_at: new Date().toISOString()
      })
  }

  // Buscar logs de atividade
  static async getActivityLogs(userId?: string, limit = 50) {
    let query = supabase
      .from('user_activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query
    if (error) throw error
    return data as UserActivityLog[]
  }
}

// Serviços para gerenciamento de roles
export class RoleService {
  // Listar todas as roles
  static async getRoles() {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('name')

    if (error) throw error
    return data as Role[]
  }

  // Criar nova role
  static async createRole(name: string, description: string, permissions: string[]) {
    const { data, error } = await supabase
      .from('roles')
      .insert({
        name,
        description,
        permissions,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data as Role
  }

  // Atualizar role
  static async updateRole(id: string, name: string, description: string, permissions: string[]) {
    const { data, error } = await supabase
      .from('roles')
      .update({
        name,
        description,
        permissions,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Role
  }

  // Deletar role
  static async deleteRole(id: string) {
    const { error } = await supabase
      .from('roles')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Utilitários para permissões
export class PermissionService {
  // Verificar se usuário tem permissão
  static hasPermission(user: User, permission: string): boolean {
    return user.permissions.includes(permission)
  }

  // Verificar se usuário tem qualquer uma das permissões
  static hasAnyPermission(user: User, permissions: string[]): boolean {
    return permissions.some(permission => user.permissions.includes(permission))
  }

  // Verificar se usuário tem todas as permissões
  static hasAllPermissions(user: User, permissions: string[]): boolean {
    return permissions.every(permission => user.permissions.includes(permission))
  }
}