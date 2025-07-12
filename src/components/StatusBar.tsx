import React from 'react'
import { GitBranch, CheckCircle } from 'lucide-react'

interface FileItem {
  id: string
  name: string
  type: 'file' | 'folder'
  content?: string
  language?: string
  children?: FileItem[]
  isOpen?: boolean
}

interface StatusBarProps {
  activeFile: FileItem | null
  theme: string
}

const StatusBar: React.FC<StatusBarProps> = ({ activeFile, theme }) => {
  const getLanguageDisplay = (language?: string) => {
    switch (language) {
      case 'typescript':
        return 'TypeScript'
      case 'javascript':
        return 'JavaScript'
      case 'json':
        return 'JSON'
      case 'markdown':
        return 'Markdown'
      default:
        return language || 'Plain Text'
    }
  }

  return (
    <div className={`${theme === 'light' ? 'bg-blue-500' : 'bg-blue-600'} text-white px-4 py-1 flex items-center justify-between text-xs`}>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <GitBranch size={12} />
          <span>main</span>
        </div>
        <div className="flex items-center space-x-1">
          <CheckCircle size={12} className={theme === 'light' ? 'text-green-200' : 'text-green-300'} />
          <span>No issues</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {activeFile && (
          <>
            <span>Ln 1, Col 1</span>
            <span>UTF-8</span>
            <span>{getLanguageDisplay(activeFile.language)}</span>
          </>
        )}
        <span className="capitalize">{theme === 'vs-dark' ? 'Dark' : 'Light'}</span>
      </div>
    </div>
  )
}

export default StatusBar