'use client'

import React from 'react'

const ContentLoader = () => {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="bg-gray-700 h-48 rounded"></div>
            <div className="bg-gray-700 h-4 rounded w-3/4"></div>
            <div className="bg-gray-700 h-3 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ContentLoader