"use client"

import { useState, useEffect } from 'react'
import { User, UserActivityLog } from '@/lib/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Clock, Activity, Shield, User as UserIcon, Mail, Phone, Building, Users, Calendar } from 'lucide-react'
import { UserService } from '@/lib/user-service'

interface UserDetailsDialogProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
}

export function UserDetailsDialog({ user, isOpen, onClose }: UserDetailsDialogProps) {
  const [activityLogs, setActivityLogs] = useState<UserActivityLog[]>([])
  const [isLoadingLogs, setIsLoadingLogs] = useState(false)

  useEffect(() => {
    if (user && isOpen) {
      loadActivityLogs()
    }
  }, [user, isOpen])

  const loadActivityLogs = async () => {
    if (!user) return
    
    setIsLoadingLogs(true)
    try {
      const logs = await UserService.getActivityLogs(user.id, 20)
      setActivityLogs(logs)
    } catch (error) {
      console.error('Erro ao carregar logs:', error)
    } finally {
      setIsLoadingLogs(false)
    }
  }

  if (!user) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const getActionText = (action: string) => {
    const actions: Record<string, string> = {
      'user_created': 'Usuário criado',
      'user_updated': 'Perfil atualizado',
      'status_changed': 'Status alterado',
      'user_deleted': 'Usuário removido',
      'login': 'Login realizado',
      'logout': 'Logout realizado',
      'password_changed': 'Senha alterada',
      'permissions_updated': 'Permissões atualizadas'
    }
    return actions[action] || action
  }

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserIcon className="w-5 h-5" />
            Detalhes do Usuário
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto">
          {/* Informações do Usuário */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserIcon className="w-5 h-5" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Nome Completo</label>
                  <p className="text-lg font-semibold">{user.full_name}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{user.email}</span>
                </div>

                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{user.phone}</span>
                  </div>
                )}

                {user.birth_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>Nascimento: {new Date(user.birth_date).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}

                {user.cpf_cnpj && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">CPF/CNPJ</label>
                    <p>{user.cpf_cnpj}</p>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Status:</span>
                  <Badge className={getStatusColor(user.status)}>
                    {getStatusText(user.status)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Informações Profissionais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Função</label>
                  <p className="font-semibold">{user.role}</p>
                </div>

                {user.position && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Cargo</label>
                    <p>{user.position}</p>
                  </div>
                )}

                {user.department && (
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-500" />
                    <span>{user.department}</span>
                  </div>
                )}

                {user.team && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>{user.team}</span>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-600">Criado em</label>
                  <p>{formatDate(user.created_at)}</p>
                </div>

                {user.last_login && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Último acesso</label>
                    <p>{formatDate(user.last_login)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Permissões ({user.permissions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                  {user.permissions.map((permission) => (
                    <Badge key={permission} variant="outline" className="justify-start">
                      {permission.replace(':', ' - ').replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Histórico de Atividades */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Histórico de Atividades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                {isLoadingLogs ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : activityLogs.length > 0 ? (
                  <div className="space-y-4">
                    {activityLogs.map((log, index) => (
                      <div key={log.id}>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {getActionText(log.action)}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <p className="text-xs text-gray-500">
                                {formatDate(log.created_at)}
                              </p>
                            </div>
                            {log.details && Object.keys(log.details).length > 0 && (
                              <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                                <pre className="whitespace-pre-wrap">
                                  {JSON.stringify(log.details, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>
                        {index < activityLogs.length - 1 && (
                          <Separator className="my-4" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma atividade registrada</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}