import { useState, useEffect } from 'react'
import { User } from '@/lib/types'
import { UserService } from '@/lib/user-service'

// Hook para gerenciar estado dos usuários
export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadUsers = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const userData = await UserService.getUsers()
      setUsers(userData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar usuários')
    } finally {
      setIsLoading(false)
    }
  }

  const createUser = async (userData: any) => {
    try {
      const newUser = await UserService.createUser(userData)
      setUsers(prev => [newUser, ...prev])
      return newUser
    } catch (err) {
      throw err
    }
  }

  const updateUser = async (userData: any) => {
    try {
      const updatedUser = await UserService.updateUser(userData)
      setUsers(prev => prev.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ))
      return updatedUser
    } catch (err) {
      throw err
    }
  }

  const updateUserStatus = async (id: string, status: 'active' | 'inactive' | 'suspended') => {
    try {
      const updatedUser = await UserService.updateUserStatus(id, status)
      setUsers(prev => prev.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ))
      return updatedUser
    } catch (err) {
      throw err
    }
  }

  const deleteUser = async (id: string) => {
    try {
      await UserService.deleteUser(id)
      setUsers(prev => prev.filter(user => user.id !== id))
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  return {
    users,
    isLoading,
    error,
    loadUsers,
    createUser,
    updateUser,
    updateUserStatus,
    deleteUser
  }
}

// Hook para verificar permissões do usuário atual
export function usePermissions(currentUser: User | null) {
  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false
    return currentUser.permissions.includes(permission)
  }

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!currentUser) return false
    return permissions.some(permission => currentUser.permissions.includes(permission))
  }

  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!currentUser) return false
    return permissions.every(permission => currentUser.permissions.includes(permission))
  }

  const isAdmin = (): boolean => {
    return currentUser?.role === 'ADMIN' || false
  }

  const isManager = (): boolean => {
    return currentUser?.role === 'MANAGER' || isAdmin()
  }

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin,
    isManager
  }
}