import { User, PERMISSIONS } from './types'
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Função cn para combinar classes CSS (shadcn/ui)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Função cn para combinar classes CSS (shadcn/ui)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Função cn para combinar classes CSS (shadcn/ui)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Função cn para combinar classes CSS (shadcn/ui)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Função cn para combinar classes CSS (shadcn/ui)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utilitários para formatação
export const formatters = {
  // Formatar telefone brasileiro
  phone: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    }
    return phone
  },

  // Formatar CPF/CNPJ
  cpfCnpj: (doc: string): string => {
    const cleaned = doc.replace(/\D/g, '')
    if (cleaned.length === 11) {
      // CPF
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    } else if (cleaned.length === 14) {
      // CNPJ
      return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    }
    return doc
  },

  // Formatar data
  date: (date: string | Date): string => {
    return new Date(date).toLocaleDateString('pt-BR')
  },

  // Formatar data e hora
  datetime: (date: string | Date): string => {
    return new Date(date).toLocaleString('pt-BR')
  },

  // Formatar nome (primeira letra maiúscula)
  name: (name: string): string => {
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
}

// Validadores
export const validators = {
  // Validar email
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // Validar CPF
  cpf: (cpf: string): boolean => {
    const cleaned = cpf.replace(/\D/g, '')
    if (cleaned.length !== 11) return false
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleaned)) return false
    
    // Validar dígitos verificadores
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleaned.charAt(i)) * (10 - i)
    }
    let remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cleaned.charAt(9))) return false
    
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleaned.charAt(i)) * (11 - i)
    }
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cleaned.charAt(10))) return false
    
    return true
  },

  // Validar CNPJ
  cnpj: (cnpj: string): boolean => {
    const cleaned = cnpj.replace(/\D/g, '')
    if (cleaned.length !== 14) return false
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{13}$/.test(cleaned)) return false
    
    // Validar primeiro dígito verificador
    let sum = 0
    let weight = 2
    for (let i = 11; i >= 0; i--) {
      sum += parseInt(cleaned.charAt(i)) * weight
      weight = weight === 9 ? 2 : weight + 1
    }
    let remainder = sum % 11
    const digit1 = remainder < 2 ? 0 : 11 - remainder
    if (digit1 !== parseInt(cleaned.charAt(12))) return false
    
    // Validar segundo dígito verificador
    sum = 0
    weight = 2
    for (let i = 12; i >= 0; i--) {
      sum += parseInt(cleaned.charAt(i)) * weight
      weight = weight === 9 ? 2 : weight + 1
    }
    remainder = sum % 11
    const digit2 = remainder < 2 ? 0 : 11 - remainder
    if (digit2 !== parseInt(cleaned.charAt(13))) return false
    
    return true
  },

  // Validar telefone brasileiro
  phone: (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '')
    return cleaned.length === 10 || cleaned.length === 11
  }
}

// Utilitários para permissões
export const permissionUtils = {
  // Agrupar permissões por módulo
  groupPermissionsByModule: (permissions: string[]) => {
    const groups: Record<string, string[]> = {}
    
    permissions.forEach(permission => {
      const [module] = permission.split(':')
      if (!groups[module]) {
        groups[module] = []
      }
      groups[module].push(permission)
    })
    
    return groups
  },

  // Obter nome amigável do módulo
  getModuleName: (module: string): string => {
    const moduleNames: Record<string, string> = {
      users: 'Usuários',
      projects: 'Projetos',
      crm: 'CRM',
      financial: 'Financeiro',
      templates: 'Templates',
      reports: 'Relatórios',
      settings: 'Configurações',
      audit: 'Auditoria'
    }
    return moduleNames[module] || module
  },

  // Obter nome amigável da ação
  getActionName: (action: string): string => {
    const actionNames: Record<string, string> = {
      view: 'Visualizar',
      create: 'Criar',
      edit: 'Editar',
      delete: 'Excluir',
      approve: 'Aprovar',
      export: 'Exportar',
      manage_permissions: 'Gerenciar Permissões'
    }
    return actionNames[action] || action
  },

  // Formatar permissão para exibição
  formatPermission: (permission: string): string => {
    const [module, action] = permission.split(':')
    return `${permissionUtils.getModuleName(module)} - ${permissionUtils.getActionName(action)}`
  }
}

// Utilitários para usuários
export const userUtils = {
  // Obter iniciais do nome
  getInitials: (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  },

  // Obter cor do avatar baseada no nome
  getAvatarColor: (name: string): string => {
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500'
    ]
    
    const hash = name.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc)
    }, 0)
    
    return colors[Math.abs(hash) % colors.length]
  },

  // Verificar se usuário está online (baseado no último login)
  isOnline: (lastLogin: string | null): boolean => {
    if (!lastLogin) return false
    const now = new Date()
    const login = new Date(lastLogin)
    const diffMinutes = (now.getTime() - login.getTime()) / (1000 * 60)
    return diffMinutes < 30 // Considera online se logou nos últimos 30 minutos
  },

  // Obter status de atividade
  getActivityStatus: (user: User): 'online' | 'away' | 'offline' => {
    if (!user.last_login) return 'offline'
    
    const now = new Date()
    const login = new Date(user.last_login)
    const diffMinutes = (now.getTime() - login.getTime()) / (1000 * 60)
    
    if (diffMinutes < 30) return 'online'
    if (diffMinutes < 60 * 24) return 'away' // Últimas 24 horas
    return 'offline'
  }
}

// Utilitários para CSV
export const csvUtils = {
  // Converter array de objetos para CSV
  arrayToCSV: (data: any[], headers: string[]): string => {
    const csvHeaders = headers.join(',')
    const csvRows = data.map(row => 
      headers.map(header => {
        const value = row[header]
        // Escapar aspas e adicionar aspas se necessário
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value || ''
      }).join(',')
    )
    
    return [csvHeaders, ...csvRows].join('\n')
  },

  // Fazer download de CSV
  downloadCSV: (data: any[], filename: string, headers: string[]) => {
    const csv = csvUtils.arrayToCSV(data, headers)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  },

  // Exportar usuários para CSV
  exportUsers: (users: User[]) => {
    const headers = [
      'full_name',
      'email',
      'phone',
      'role',
      'department',
      'team',
      'position',
      'status',
      'created_at'
    ]
    
    const data = users.map(user => ({
      full_name: user.full_name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      department: user.department || '',
      team: user.team || '',
      position: user.position || '',
      status: user.status,
      created_at: formatters.date(user.created_at)
    }))
    
    csvUtils.downloadCSV(data, 'usuarios.csv', headers)
  }
}

// Utilitários para busca e filtros
export const searchUtils = {
  // Busca fuzzy simples
  fuzzySearch: (query: string, text: string): boolean => {
    const queryLower = query.toLowerCase()
    const textLower = text.toLowerCase()
    
    let queryIndex = 0
    for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
      if (textLower[i] === queryLower[queryIndex]) {
        queryIndex++
      }
    }
    
    return queryIndex === queryLower.length
  },

  // Destacar texto da busca
  highlightText: (text: string, query: string): string => {
    if (!query) return text
    
    const regex = new RegExp(`(${query})`, 'gi')
    return text.replace(regex, '<mark>$1</mark>')
  }
}