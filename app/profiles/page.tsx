'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function ProfilesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [selectedProfile, setSelectedProfile] = useState('')
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
    } else {
      // Salvar perfis padrão no localStorage na primeira vez
      localStorage.setItem('netflix-profiles', JSON.stringify(profiles))
    }
  }, [])

  const handleProfileSelect = (profileId: string) => {
    localStorage.setItem('selected-profile', profileId)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-light mb-8">Quem está assistindo?</h1>
      </div>

      <div className="flex flex-wrap justify-center gap-8 mb-12">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            onClick={() => handleProfileSelect(profile.id)}
            className="flex flex-col items-center cursor-pointer group transition-transform hover:scale-105"
          >
            <div className={`w-32 h-32 ${profile.color} rounded-lg flex items-center justify-center text-6xl mb-4 group-hover:ring-4 group-hover:ring-white transition-all`}>
              {profile.avatar}
            </div>
            <span className="text-gray-400 group-hover:text-white transition-colors text-lg">
              {profile.name}
            </span>
          </div>
        ))}
      </div>

      <button 
        onClick={() => router.push('/manage-profiles')}
        className="border border-gray-600 text-gray-400 hover:text-white hover:border-white px-8 py-2 transition-colors"
      >
        Gerenciar perfis
      </button>
    </div>
  )
}