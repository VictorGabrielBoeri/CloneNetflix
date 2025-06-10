'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import ContentManagement from '@/components/admin/ContentManagement'
import UserManagement from '@/components/admin/UserManagement'
import Analytics from '@/components/admin/Analytics'
import SubscriptionManagement from '@/components/admin/SubscriptionManagement'

export default function AdminDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('analytics')

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
    </div>
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <Analytics />
      case 'content':
        return <ContentManagement />
      case 'users':
        return <UserManagement />
      case 'subscriptions':
        return <SubscriptionManagement />
      default:
        return <Analytics />
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-900">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">
            Admin Dashboard
          </h1>
          {renderContent()}
        </div>
      </main>
    </div>
  )
}