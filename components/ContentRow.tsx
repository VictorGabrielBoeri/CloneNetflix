'use client'

import React from 'react'

interface ContentRowProps {
  title: string
  items?: any[]
}

const ContentRow: React.FC<ContentRowProps> = ({ title, items = [] }) => {
  return (
    <div className="mb-8">
      <h2 className="text-white text-2xl font-bold mb-4">{title}</h2>
      <div className="flex space-x-4 overflow-x-auto">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div key={index} className="min-w-[200px] h-[300px] bg-gray-800 rounded">
              <img 
                src={item.thumbnail || '/placeholder.jpg'} 
                alt={item.title}
                className="w-full h-full object-cover rounded"
              />
            </div>
          ))
        ) : (
          // Placeholder items
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="min-w-[200px] h-[300px] bg-gray-800 rounded flex items-center justify-center">
              <span className="text-gray-400">Conteúdo {index + 1}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ContentRow