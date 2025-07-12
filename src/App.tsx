import CodeEditor from './components/CodeEditor'
import { buildFileTree } from './utils/fileTree'

// 示例：输入对象 { [文件名称]: [文件内容] }
const fileMap = {
  'hello.ts': `export const hello = () => 'Hello, world!';`,
  'readme.md': `# 示例\n这是一个只读代码编辑器演示。`,
  'utils.js': `export function sum(a, b) { return a + b }`,
  'src/index.tsx': `export const index = () => 'index';`
}

const files = buildFileTree(fileMap);

function App() {
  return (
    <CodeEditor files={files} readOnly={false} />
  )
}

export default App