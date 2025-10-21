"use client"

import { useState, useEffect } from 'react'
import { User, UserFilters } from '@/lib/types'
import { UserService } from '@/lib/user-service'
import { UserCard } from '@/components/user-card'
import { UserFiltersBar } from '@/components/user-filters'
import { CreateUserForm, InviteUserForm, ImportUsersForm } from '@/components/user-forms'
import { UserDetailsDialog } from '@/components/user-details'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, UserPlus, UserCheck, UserX, UserMinus, Activity, Shield, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'

export default function UsersModule() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [filters, setFilters] = useState<UserFilters>({})
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserDetails, setShowUserDetails] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [users, filters])

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const userData = await UserService.getUsers()
      setUsers(userData)
    } catch (error) {
      toast.error('Erro ao carregar usuários')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...users]

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(user => 
        user.full_name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      )
    }

    if (filters.role) {
      filtered = filtered.filter(user => user.role === filters.role)
    }

    if (filters.status) {
      filtered = filtered.filter(user => user.status === filters.status)
    }

    if (filters.department) {
      filtered = filtered.filter(user => 
        user.department?.toLowerCase().includes(filters.department!.toLowerCase())
      )
    }

    if (filters.team) {
      filtered = filtered.filter(user => 
        user.team?.toLowerCase().includes(filters.team!.toLowerCase())
      )
    }

    setFilteredUsers(filtered)
  }

  const handleFiltersChange = (newFilters: UserFilters) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters({})
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setShowUserDetails(true)
  }

  const handleUserUpdated = () => {
    loadUsers()
  }

  // Estatísticas
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    suspended: users.filter(u => u.status === 'suspended').length
  }

  const getGrowthPercentage = () => {
    // Simulação de crescimento (em um app real, você compararia com período anterior)
    return '+12%'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                Módulo de Usuários
              </h1>
              <p className="text-gray-600 mt-2">
                Gerencie usuários, permissões e controle de acesso da plataforma Lasy.ia
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <CreateUserForm onUserCreated={handleUserUpdated} />
              <InviteUserForm onUserInvited={handleUserUpdated} />
              <ImportUsersForm onUsersImported={handleUserUpdated} />
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">{getGrowthPercentage()}</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                  <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% do total
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuários Inativos</p>
                  <p className="text-3xl font-bold text-gray-600">{stats.inactive}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {stats.total > 0 ? Math.round((stats.inactive / stats.total) * 100) : 0}% do total
                  </p>
                </div>
                <div className="p-3 bg-gray-100 rounded-full">
                  <UserX className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuários Suspensos</p>
                  <p className="text-3xl font-bold text-red-600">{stats.suspended}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {stats.total > 0 ? Math.round((stats.suspended / stats.total) * 100) : 0}% do total
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <UserMinus className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <UserFiltersBar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </CardContent>
        </Card>

        {/* Lista de Usuários */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Usuários ({filteredUsers.length})
            </h2>
            
            {filteredUsers.length !== users.length && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {filteredUsers.length} de {users.length} usuários
              </Badge>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onUserUpdated={handleUserUpdated}
                  onEditUser={handleEditUser}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {users.length === 0 ? 'Nenhum usuário cadastrado' : 'Nenhum usuário encontrado'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {users.length === 0 
                    ? 'Comece criando seu primeiro usuário ou importando uma lista.'
                    : 'Tente ajustar os filtros para encontrar o que procura.'
                  }
                </p>
                {users.length === 0 && (
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <CreateUserForm onUserCreated={handleUserUpdated} />
                    <ImportUsersForm onUsersImported={handleUserUpdated} />
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Aviso sobre configuração do Supabase */}
        <Card className="mt-8 border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-orange-800 mb-2">
                  Configuração do Banco de Dados
                </h3>
                <p className="text-orange-700 mb-4">
                  Para que o módulo de usuários funcione completamente, você precisa configurar as tabelas no Supabase.
                  As tabelas necessárias são: <code>users</code>, <code>roles</code>, <code>user_activity_logs</code> e <code>invitations</code>.
                </p>
                <p className="text-sm text-orange-600">
                  💡 <strong>Dica:</strong> Conecte sua conta Supabase nas configurações do projeto para configuração automática.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog de Detalhes do Usuário */}
      <UserDetailsDialog
        user={selectedUser}
        isOpen={showUserDetails}
        onClose={() => {
          setShowUserDetails(false)
          setSelectedUser(null)
        }}
      />
    </div>
  )
}