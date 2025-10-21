"use client"

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, Filter, X } from 'lucide-react'
import { UserFilters, DEFAULT_ROLES } from '@/lib/types'

interface UserFiltersBarProps {
  filters: UserFilters
  onFiltersChange: (filters: UserFilters) => void
  onClearFilters: () => void
}

export function UserFiltersBar({ filters, onFiltersChange, onClearFilters }: UserFiltersBarProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search })
  }

  const handleRoleChange = (role: string) => {
    onFiltersChange({ ...filters, role: role === 'all' ? undefined : role })
  }

  const handleStatusChange = (status: string) => {
    onFiltersChange({ 
      ...filters, 
      status: status === 'all' ? undefined : status as 'active' | 'inactive' | 'suspended'
    })
  }

  const handleDepartmentChange = (department: string) => {
    onFiltersChange({ ...filters, department })
  }

  const handleTeamChange = (team: string) => {
    onFiltersChange({ ...filters, team })
  }

  const hasActiveFilters = filters.role || filters.status || filters.department || filters.team

  return (
    <div className="space-y-4">
      {/* Barra de busca principal */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar por nome, e-mail..."
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className={hasActiveFilters ? 'border-blue-500 text-blue-600' : ''}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
            {hasActiveFilters && (
              <span className="ml-2 bg-blue-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {[filters.role, filters.status, filters.department, filters.team].filter(Boolean).length}
              </span>
            )}
          </Button>
          
          {hasActiveFilters && (
            <Button variant="outline" onClick={onClearFilters}>
              <X className="w-4 h-4 mr-2" />
              Limpar
            </Button>
          )}
        </div>
      </div>

      {/* Filtros expandidos */}
      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Função
            </label>
            <Select value={filters.role || 'all'} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as funções</SelectItem>
                {Object.entries(DEFAULT_ROLES).map(([key, role]) => (
                  <SelectItem key={key} value={key}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <Select value={filters.status || 'all'} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
                <SelectItem value="suspended">Suspenso</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departamento
            </label>
            <Input
              placeholder="Filtrar por departamento"
              value={filters.department || ''}
              onChange={(e) => handleDepartmentChange(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Equipe
            </label>
            <Input
              placeholder="Filtrar por equipe"
              value={filters.team || ''}
              onChange={(e) => handleTeamChange(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  )
}