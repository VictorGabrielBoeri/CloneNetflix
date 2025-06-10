'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function ManageProfilesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [profiles, setProfiles] = useState([
    {
      id: 'usuario_1',
      name: 'Andrea',
      avatar: '🐧',
      color: 'bg-purple-600'
    },
    {
      id: 'usuario_2',
      name: 'Victor Gabriel',
      avatar: '🐶',
      color: 'bg-green-600'
    },
    {
      id: 'usuario_3',
      name: 'Rodrigo',
      avatar: '🧁',
      color: 'bg-yellow-600'
    },
    {
      id: 'usuario_4',
      name: 'Isa',
      avatar: '🦊',
      color: 'bg-blue-600'
    },
    {
      id: 'usuario_5',
      name: 'Virginia',
      avatar: '🌸',
      color: 'bg-pink-600'
    }
  ])

  useEffect(() => {
    // Carregar perfis salvos do localStorage
    const savedProfiles = localStorage.getItem('netflix-profiles')
    if (savedProfiles) {
      setProfiles(JSON.parse(savedProfiles))
    }
  }, [])

  const handleEditProfile = (profileId: string) => {
    router.push(`/edit-profile/${profileId}`)
  }

  const handleFinish = () => {
    router.push('/profiles')
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-light mb-8">Gerenciar perfis:</h1>
      </div>

      <div className="flex flex-wrap justify-center gap-8 mb-12">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            onClick={() => handleEditProfile(profile.id)}
            className="flex flex-col items-center cursor-pointer group transition-transform hover:scale-105 relative"
          >
            <div className={`w-32 h-32 ${profile.color} rounded-lg flex items-center justify-center text-6xl mb-4 group-hover:ring-4 group-hover:ring-white transition-all relative`}>
              {profile.avatar}
              {/* Ícone de edição */}
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
            </div>
            <span className="text-gray-400 group-hover:text-white transition-colors text-lg">
              {profile.name}
            </span>
          </div>
        ))}
      </div>

      <button 
        onClick={handleFinish}
        className="bg-white text-black px-8 py-2 font-semibold hover:bg-gray-200 transition-colors"
      >
        Concluído
      </button>
    </div>
  )
}