'use client'

import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-4">Empresa</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Sobre nós</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Carreiras</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Imprensa</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Suporte</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Conta</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Minha Conta</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Planos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cartões Presente</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Preferências</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Conecte-se</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">YouTube</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p>&copy; 2024 Netflix Clone. Todos os direitos reservados.</p>
          <p className="mt-2 text-sm">Este é um projeto educacional e não está afiliado à Netflix, Inc.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer