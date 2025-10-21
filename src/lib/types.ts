// Tipos para o sistema de usuários
export interface User {
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

export interface Role {
  id: string
  name: string
  description?: string
  permissions: string[]
  created_at: string
  updated_at: string
}

export interface UserActivityLog {
  id: string
  user_id: string
  action: string
  details?: Record<string, any>
  ip_address?: string
  user_agent?: string
  created_at: string
}

export interface Invitation {
  id: string
  email: string
  role: string
  invited_by: string
  token: string
  expires_at: string
  status: 'pending' | 'accepted' | 'expired'
  created_at: string
}

// Tipos para formulários
export interface CreateUserData {
  email: string
  full_name: string
  phone?: string
  role: string
  department?: string
  team?: string
  birth_date?: string
  cpf_cnpj?: string
  position?: string
  permissions?: string[]
}

export interface UpdateUserData extends Partial<CreateUserData> {
  id: string
  status?: 'active' | 'inactive' | 'suspended'
}

// Permissões disponíveis no sistema
export const PERMISSIONS = {
  // Usuários
  USERS_VIEW: 'users:view',
  USERS_CREATE: 'users:create',
  USERS_EDIT: 'users:edit',
  USERS_DELETE: 'users:delete',
  USERS_MANAGE_PERMISSIONS: 'users:manage_permissions',
  
  // Projetos
  PROJECTS_VIEW: 'projects:view',
  PROJECTS_CREATE: 'projects:create',
  PROJECTS_EDIT: 'projects:edit',
  PROJECTS_DELETE: 'projects:delete',
  PROJECTS_APPROVE: 'projects:approve',
  
  // CRM
  CRM_VIEW: 'crm:view',
  CRM_CREATE: 'crm:create',
  CRM_EDIT: 'crm:edit',
  CRM_DELETE: 'crm:delete',
  
  // Financeiro
  FINANCIAL_VIEW: 'financial:view',
  FINANCIAL_CREATE: 'financial:create',
  FINANCIAL_EDIT: 'financial:edit',
  FINANCIAL_DELETE: 'financial:delete',
  FINANCIAL_APPROVE: 'financial:approve',
  
  // Templates
  TEMPLATES_VIEW: 'templates:view',
  TEMPLATES_CREATE: 'templates:create',
  TEMPLATES_EDIT: 'templates:edit',
  TEMPLATES_DELETE: 'templates:delete',
  
  // Relatórios
  REPORTS_VIEW: 'reports:view',
  REPORTS_CREATE: 'reports:create',
  REPORTS_EXPORT: 'reports:export',
  
  // Configurações
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_EDIT: 'settings:edit',
  
  // Auditoria
  AUDIT_VIEW: 'audit:view',
  AUDIT_EXPORT: 'audit:export'
} as const

// Roles padrão do sistema
export const DEFAULT_ROLES = {
  ADMIN: {
    name: 'Administrador',
    description: 'Acesso total ao sistema',
    permissions: Object.values(PERMISSIONS)
  },
  MANAGER: {
    name: 'Gerente',
    description: 'Gerenciamento de equipes e projetos',
    permissions: [
      PERMISSIONS.USERS_VIEW,
      PERMISSIONS.USERS_CREATE,
      PERMISSIONS.USERS_EDIT,
      PERMISSIONS.PROJECTS_VIEW,
      PERMISSIONS.PROJECTS_CREATE,
      PERMISSIONS.PROJECTS_EDIT,
      PERMISSIONS.PROJECTS_APPROVE,
      PERMISSIONS.CRM_VIEW,
      PERMISSIONS.CRM_CREATE,
      PERMISSIONS.CRM_EDIT,
      PERMISSIONS.FINANCIAL_VIEW,
      PERMISSIONS.TEMPLATES_VIEW,
      PERMISSIONS.TEMPLATES_CREATE,
      PERMISSIONS.TEMPLATES_EDIT,
      PERMISSIONS.REPORTS_VIEW,
      PERMISSIONS.REPORTS_CREATE,
      PERMISSIONS.SETTINGS_VIEW
    ]
  },
  COLLABORATOR: {
    name: 'Colaborador',
    description: 'Acesso a projetos e tarefas',
    permissions: [
      PERMISSIONS.USERS_VIEW,
      PERMISSIONS.PROJECTS_VIEW,
      PERMISSIONS.PROJECTS_CREATE,
      PERMISSIONS.PROJECTS_EDIT,
      PERMISSIONS.CRM_VIEW,
      PERMISSIONS.CRM_CREATE,
      PERMISSIONS.CRM_EDIT,
      PERMISSIONS.TEMPLATES_VIEW,
      PERMISSIONS.TEMPLATES_CREATE,
      PERMISSIONS.REPORTS_VIEW
    ]
  },
  CONSULTANT: {
    name: 'Consultor',
    description: 'Acesso limitado a projetos específicos',
    permissions: [
      PERMISSIONS.PROJECTS_VIEW,
      PERMISSIONS.PROJECTS_EDIT,
      PERMISSIONS.TEMPLATES_VIEW,
      PERMISSIONS.REPORTS_VIEW
    ]
  },
  GUEST: {
    name: 'Convidado',
    description: 'Acesso apenas para visualização',
    permissions: [
      PERMISSIONS.PROJECTS_VIEW,
      PERMISSIONS.TEMPLATES_VIEW,
      PERMISSIONS.REPORTS_VIEW
    ]
  }
} as const

// Filtros para busca de usuários
export interface UserFilters {
  search?: string
  role?: string
  status?: 'active' | 'inactive' | 'suspended'
  department?: string
  team?: string
}

// Tipos para importação CSV
export interface CSVUserData {
  email: string
  full_name: string
  phone?: string
  role: string
  department?: string
  team?: string
  position?: string
}

export interface ImportResult {
  success: number
  errors: Array<{
    row: number
    email: string
    error: string
  }>
}