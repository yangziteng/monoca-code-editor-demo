import React from 'react'
import Editor from '@monaco-editor/react'
import { FileText, Moon, Sun } from 'lucide-react'
import FileExplorer from './FileExplorer'

interface FileItem {
  id: string
  name: string
  type: 'file' | 'folder'
  content?: string
  language?: string
  children?: FileItem[]
  isOpen?: boolean
}

interface CodeEditorProps {
  files: FileItem[]
  readOnly?: boolean // 新增
}

const CodeEditor: React.FC<CodeEditorProps> = ({ files, readOnly = true }) => {
  const [theme, setTheme] = React.useState<'vs-dark' | 'light'>('light')
  const [activeFile, setActiveFile] = React.useState<FileItem | null>(null)
  const [openTabs, setOpenTabs] = React.useState<FileItem[]>([])
  const [sidebarWidth, setSidebarWidth] = React.useState(300);
  const sidebarMinWidth = 200;
  const sidebarMaxWidth = 600;
  const isDragging = React.useRef(false);

  // 拖拽相关事件
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      let newWidth = e.clientX;
      if (newWidth < sidebarMinWidth) newWidth = sidebarMinWidth;
      if (newWidth > sidebarMaxWidth) newWidth = sidebarMaxWidth;
      setSidebarWidth(newWidth);
    };
    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
    };
    if (isDragging.current) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
    };
  }, []);

  // 修复拖拽逻辑
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = sidebarWidth;
    const onMouseMove = (moveEvent: MouseEvent) => {
      let newWidth = startWidth + (moveEvent.clientX - startX);
      if (newWidth < sidebarMinWidth) newWidth = sidebarMinWidth;
      if (newWidth > sidebarMaxWidth) newWidth = sidebarMaxWidth;
      setSidebarWidth(newWidth);
    };
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.body.style.cursor = 'col-resize';
  };

  const handleFileSelect = (file: FileItem) => {
    if (file.type === 'file') {
      setActiveFile(file)
      if (!openTabs.find(tab => tab.id === file.id)) {
        setOpenTabs([...openTabs, file])
      }
    }
  }

  const handleTabClose = (fileId: string) => {
    const newTabs = openTabs.filter(tab => tab.id !== fileId)
    setOpenTabs(newTabs)
    if (activeFile?.id === fileId) {
      setActiveFile(newTabs.length > 0 ? newTabs[newTabs.length - 1] : null)
    }
  }

  const toggleTheme = () => {
    setTheme(theme === 'vs-dark' ? 'light' : 'vs-dark')
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div 
        className={`${theme === 'light' ? 'bg-gray-100 border-gray-200' : 'bg-gray-800 border-gray-700'} border-r flex flex-col`}
        style={{ width: sidebarWidth, minWidth: sidebarMinWidth, maxWidth: sidebarMaxWidth }}
      >
        {/* Sidebar Header */}
        <div className={`p-3 border-b flex items-center justify-between ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
          <h2 className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} uppercase tracking-wide`}>
            Editor
          </h2>
          <button
            onClick={toggleTheme}
            className={`ml-2 p-1.5 ${theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-700'} rounded transition-colors`}
            title="切换主题"
          >
            {theme === 'vs-dark' ? <Sun size={16} /> : <Moon size={16} className="text-gray-700" />}
          </button>
        </div>
        {/* File Explorer */}
        <div className="flex-1 overflow-auto">
          <FileExplorer files={files} onFileSelect={handleFileSelect} theme={theme} />
        </div>
      </div>
      {/* 拖拽分割条 */}
      <div
        style={{ width: 6, cursor: 'col-resize', zIndex: 10 }}
        className="bg-gray-200 dark:bg-gray-700 hover:bg-blue-400 transition-colors duration-100"
        onMouseDown={handleDragStart}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Tabs */}
        {openTabs.length > 0 && (
          <div className={`${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-800 border-gray-700'} border-b flex overflow-x-auto`}>
            {openTabs.map((tab) => (
              <div
                key={tab.id}
                className={`flex items-center px-3 py-2 border-r ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'} cursor-pointer min-w-0 ${
                  activeFile?.id === tab.id 
                    ? theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-900 text-white'
                    : theme === 'light' ? 'bg-gray-50 text-gray-600 hover:bg-gray-100' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setActiveFile(tab)}
              >
                <FileText size={14} className="mr-2 flex-shrink-0" />
                <span className="truncate text-sm">{tab.name}</span>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    handleTabClose(tab.id)
                  }}
                  className={`ml-2 ${theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-600'} rounded p-0.5 flex-shrink-0`}
                >
                  <span className="text-xs">×</span>
                </button>
              </div>
            ))}
          </div>
        )}
        {/* Editor */}
        <div className="flex-1 relative">
          {activeFile ? (
            <Editor
              height="100%"
              language={activeFile.language}
              value={activeFile.content}
              theme={theme}
              options={{
                fontSize: 14,
                fontFamily: 'Fira Code, Monaco, Consolas, monospace',
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                insertSpaces: true,
                wordWrap: 'on',
                lineNumbers: 'on',
                renderWhitespace: 'selection',
                bracketPairColorization: { enabled: true },
                guides: {
                  bracketPairs: true,
                  indentation: true
                },
                readOnly // 由 props 控制
              }}
            />
          ) : (
            <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-900'} flex items-center justify-center h-full`}>
              <div className="text-center text-gray-400">
                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                <h3 className={`text-lg font-medium mb-2 ${theme === 'light' ? 'text-gray-600' : ''}`}>请选择左侧文件进行预览</h3>
                <p className="text-sm">支持内容搜索与多标签只读浏览</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CodeEditor