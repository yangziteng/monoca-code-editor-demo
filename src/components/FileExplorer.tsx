import React, { useState } from 'react'
import { FileText, Folder, FolderOpen, ChevronRight, ChevronDown } from 'lucide-react'

interface FileItem {
  id: string
  name: string
  type: 'file' | 'folder'
  content?: string
  language?: string
  children?: FileItem[]
  isOpen?: boolean
}

interface FileExplorerProps {
  files: FileItem[]
  onFileSelect: (file: FileItem) => void
  theme: 'vs-dark' | 'light'
}

const FileExplorer: React.FC<FileExplorerProps> = ({ files = [], onFileSelect, theme }) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['1']))
  const [search, setSearch] = useState('')

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  // 递归过滤文件树，返回只包含匹配内容的文件和必要的文件夹结构
  const filterFiles = (items: FileItem[] = []): FileItem[] => {
    return (items || [])
      .map(item => {
        if (item.type === 'folder' && item.children) {
          const filteredChildren = filterFiles(item.children)
          if (filteredChildren.length > 0) {
            return { ...item, children: filteredChildren }
          }
          return null
        } else if (item.type === 'file') {
          if (
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            (item.content && item.content.toLowerCase().includes(search.toLowerCase()))
          ) {
            return item
          }
          return null
        }
        return null
      })
      .filter(Boolean) as FileItem[]
  }

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') {
      return expandedFolders.has(file.id) ? (
        <FolderOpen size={16} className={theme === 'light' ? 'text-blue-500' : 'text-blue-400'} />
      ) : (
        <Folder size={16} className={theme === 'light' ? 'text-blue-500' : 'text-blue-400'} />
      )
    }

    // File type specific icons
    const extension = file.name.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'tsx':
      case 'ts':
        return <FileText size={16} className={theme === 'light' ? 'text-blue-500' : 'text-blue-300'} />
      case 'js':
      case 'jsx':
        return <FileText size={16} className={theme === 'light' ? 'text-yellow-500' : 'text-yellow-300'} />
      case 'json':
        return <FileText size={16} className={theme === 'light' ? 'text-green-500' : 'text-green-300'} />
      case 'md':
        return <FileText size={16} className={theme === 'light' ? 'text-purple-500' : 'text-purple-300'} />
      case 'css':
        return <FileText size={16} className={theme === 'light' ? 'text-pink-500' : 'text-pink-300'} />
      case 'html':
        return <FileText size={16} className={theme === 'light' ? 'text-orange-500' : 'text-orange-300'} />
      default:
        return <FileText size={16} className={theme === 'light' ? 'text-gray-500' : 'text-gray-300'} />
    }
  }

  const renderFileTree = (items: FileItem[] = [], depth = 0) => {
    return (items || []).map((item) => (
      <div key={item.id}>
        <div
          className={`flex items-center py-1 px-2 ${
            theme === 'light' 
              ? 'hover:bg-gray-200 text-gray-700' 
              : 'hover:bg-gray-700 text-gray-200'
          } cursor-pointer text-sm ${
            depth > 0 ? 'ml-' + (depth * 4) : ''
          }`}
          style={{ paddingLeft: `${8 + depth * 16}px` }}
          onClick={() => {
            if (item.type === 'folder') {
              toggleFolder(item.id)
            } else {
              onFileSelect(item)
            }
          }}
        >
          {item.type === 'folder' && (
            <span className="mr-1">
              {expandedFolders.has(item.id) ? (
                <ChevronDown size={12} />
              ) : (
                <ChevronRight size={12} />
              )}
            </span>
          )}
          <span className="mr-2">{getFileIcon(item)}</span>
          <span className="truncate">{item.name}</span>
        </div>
        {item.type === 'folder' && 
         item.children && 
         expandedFolders.has(item.id) && 
         renderFileTree(item.children, depth + 1)}
      </div>
    ))
  }

  // 搜索后文件树
  const filteredFiles = search.trim() ? filterFiles(files) : (files || [])

  return (
    <div className="py-2">
      <div className="px-2 pb-2">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="搜索文件或内容..."
          className={`w-full px-2 py-1 rounded border text-sm outline-none ${theme === 'light' ? 'bg-white border-gray-300 text-gray-700' : 'bg-gray-700 border-gray-600 text-gray-200'}`}
        />
      </div>
      {renderFileTree(filteredFiles)}
    </div>
  )
}

export default FileExplorer