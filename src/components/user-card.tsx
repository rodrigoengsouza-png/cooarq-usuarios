"use client"

import { useState } from 'react'
import { User } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { MoreHorizontal, Edit, Trash2, UserCheck, UserX, UserMinus, Shield, Clock, Mail, Phone, Building, Users } from 'lucide-react'
import { UserService } from '@/lib/user-service'
import { toast } from 'sonner'

interface UserCardProps {
  user: User
  onUserUpdated: () => void
  onEditUser: (user: User) => void
}

export function UserCard({ user, onUserUpdated, onEditUser }: UserCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <UserCheck className="w-3 h-3" />
      case 'inactive':
        return <UserX className="w-3 h-3" />
      case 'suspended':
        return <UserMinus className="w-3 h-3" />
      default:
        return <UserX className="w-3 h-3" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo'
      case 'inactive':
        return 'Inativo'
      case 'suspended':
        return 'Suspenso'
      default:
        return 'Desconhecido'
    }
  }

  const handleStatusChange = async (newStatus: 'active' | 'inactive' | 'suspended') => {
    setIsLoading(true)
    try {
      await UserService.updateUserStatus(user.id, newStatus)
      toast.success('Status atualizado com sucesso!')
      onUserUpdated()
    } catch (error) {
      toast.error('Erro ao atualizar status')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await UserService.deleteUser(user.id)
      toast.success('Usuário removido com sucesso!')
      onUserUpdated()
    } catch (error) {
      toast.error('Erro ao remover usuário')
      console.error(error)
    } finally {
      setIsLoading(false)
      setShowDeleteDialog(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={user.avatar_url} alt={user.full_name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                  {getInitials(user.full_name)}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{user.full_name}</h3>
                <p className="text-sm text-gray-600">{user.position || user.role}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge className={`${getStatusColor(user.status)} flex items-center gap-1`}>
                {getStatusIcon(user.status)}
                {getStatusText(user.status)}
              </Badge>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" disabled={isLoading}>
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEditUser(user)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  {user.status !== 'active' && (
                    <DropdownMenuItem onClick={() => handleStatusChange('active')}>
                      <UserCheck className="w-4 h-4 mr-2" />
                      Ativar
                    </DropdownMenuItem>
                  )}
                  
                  {user.status !== 'inactive' && (
                    <DropdownMenuItem onClick={() => handleStatusChange('inactive')}>
                      <UserX className="w-4 h-4 mr-2" />
                      Desativar
                    </DropdownMenuItem>
                  )}
                  
                  {user.status !== 'suspended' && (
                    <DropdownMenuItem onClick={() => handleStatusChange('suspended')}>
                      <UserMinus className="w-4 h-4 mr-2" />
                      Suspender
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remover
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="w-4 h-4 mr-2" />
              {user.email}
            </div>

            {user.phone && (
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                {user.phone}
              </div>
            )}

            {user.department && (
              <div className="flex items-center text-sm text-gray-600">
                <Building className="w-4 h-4 mr-2" />
                {user.department}
              </div>
            )}

            {user.team && (
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                {user.team}
              </div>
            )}

            <div className="flex items-center text-sm text-gray-600">
              <Shield className="w-4 h-4 mr-2" />
              {user.permissions.length} permissões
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              Criado em {formatDate(user.created_at)}
            </div>

            {user.last_login && (
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                Último acesso: {formatDate(user.last_login)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover o usuário <strong>{user.full_name}</strong>? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? 'Removendo...' : 'Remover'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}