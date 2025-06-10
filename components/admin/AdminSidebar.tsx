'use client'

interface AdminSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      {/* Sidebar content */}
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
      {/* Navigation items */}
    </div>
  )
}