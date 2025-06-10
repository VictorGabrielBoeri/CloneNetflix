'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

const availableAvatars = ['🐧', '🐶', '🧁', '🦊', '🌸', '🐱', '🐰', '🐻', '🐼', '🦁', '🐯', '🐸', '🐙', '🦄', '🐲']
const availableColors = [
  'bg-purple-600',
  'bg-green-600', 
  'bg-yellow-600',
  'bg-blue-600',
  'bg-pink-600',
  'bg-red-600',
  'bg-indigo-600',
  'bg-gray-600',
  'bg-orange-600',
  'bg-teal-600'
]

export default function EditProfilePage() {
  const router = useRouter()
  const params = useParams()
  const profileId = params.id as string
  const { user } = useAuth()
  
  const [profileName, setProfileName] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState('🐧')
  const [selectedColor, setSelectedColor] = useState('bg-purple-600')
  const [profiles, setProfiles] = useState<any[]>([])

  useEffect(() => {
    // Carregar perfis do localStorage
    const savedProfiles = localStorage.getItem('netflix-profiles')
    let currentProfiles = []
    
    if (savedProfiles) {
      currentProfiles = JSON.parse(savedProfiles)
    } else {
      // Perfis padrão se não houver salvos
      currentProfiles = [
        { id: 'usuario_1', name: 'Andrea', avatar: '🐧', color: 'bg-purple-600' },
        { id: 'usuario_2', name: 'Victor Gabriel', avatar: '🐶', color: 'bg-green-600' },
        { id: 'usuario_3', name: 'Rodrigo', avatar: '🧁', color: 'bg-yellow-600' },
        { id: 'usuario_4', name: 'Isa', avatar: '🦊', color: 'bg-blue-600' },
        { id: 'usuario_5', name: 'Virginia', avatar: '🌸', color: 'bg-pink-600' }
      ]
    }
    
    setProfiles(currentProfiles)
    
    // Encontrar o perfil atual
    const currentProfile = currentProfiles.find(p => p.id === profileId)
    if (currentProfile) {
      setProfileName(currentProfile.name)
      setSelectedAvatar(currentProfile.avatar)
      setSelectedColor(currentProfile.color)
    }
  }, [profileId])

  const handleSave = () => {
    // Atualizar o perfil
    const updatedProfiles = profiles.map(profile => 
      profile.id === profileId 
        ? { ...profile, name: profileName, avatar: selectedAvatar, color: selectedColor }
        : profile
    )
    
    // Salvar no localStorage
    localStorage.setItem('netflix-profiles', JSON.stringify(updatedProfiles))
    
    // Voltar para gerenciar perfis
    router.push('/manage-profiles')
  }

  const handleCancel = () => {
    router.push('/manage-profiles')
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl font-light mb-8 text-center">Editar Perfil</h1>
        
        {/* Preview do perfil */}
        <div className="flex flex-col items-center mb-8">
          <div className={`w-32 h-32 ${selectedColor} rounded-lg flex items-center justify-center text-6xl mb-4`}>
            {selectedAvatar}
          </div>
          <input
            type="text"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded text-center text-xl border border-gray-600 focus:border-white focus:outline-none"
            placeholder="Nome do perfil"
            maxLength={20}
          />
        </div>

        {/* Seleção de avatar */}
        <div className="mb-8">
          <h3 className="text-xl mb-4 text-center">Escolha um ícone:</h3>
          <div className="grid grid-cols-5 gap-4 justify-items-center">
            {availableAvatars.map((avatar) => (
              <button
                key={avatar}
                onClick={() => setSelectedAvatar(avatar)}
                className={`w-16 h-16 rounded-lg flex items-center justify-center text-3xl transition-all hover:scale-110 ${
                  selectedAvatar === avatar 
                    ? 'ring-4 ring-white bg-gray-700' 
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                {avatar}
              </button>
            ))}
          </div>
        </div>

        {/* Seleção de cor */}
        <div className="mb-8">
          <h3 className="text-xl mb-4 text-center">Escolha uma cor:</h3>
          <div className="grid grid-cols-5 gap-4 justify-items-center">
            {availableColors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-12 h-12 rounded-lg transition-all hover:scale-110 ${
                  selectedColor === color 
                    ? 'ring-4 ring-white' 
                    : ''
                } ${color}`}
              />
            ))}
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleCancel}
            className="border border-gray-600 text-gray-400 hover:text-white hover:border-white px-8 py-2 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-white text-black px-8 py-2 font-semibold hover:bg-gray-200 transition-colors"
            disabled={!profileName.trim()}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}