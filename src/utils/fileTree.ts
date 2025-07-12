// 构建树状结构，将扁平的文件路径映射为文件夹+文件的树形结构
export function buildFileTree(fileMap: Record<string, string>) {
  let id = 1;
  const root: any = { id: 'root', name: '', type: 'folder', children: [] };

  for (const [path, content] of Object.entries(fileMap)) {
    const parts = path.split('/');
    let current = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      let node = (current.children as any[]).find((c) => c.name === part);
      if (!node) {
        node = {
          id: String(id++),
          name: part,
          type: i === parts.length - 1 ? 'file' : 'folder',
          ...(i === parts.length - 1
            ? {
                content,
                language: part.endsWith('.ts') || part.endsWith('.tsx') ? 'typescript' : part.endsWith('.js') ? 'javascript' : part.endsWith('.md') ? 'markdown' : undefined,
              }
            : { children: [] }),
        };
        current.children.push(node);
      }
      current = node;
    }
  }

  // 递归排序：文件夹在前，文件在后
  function sortChildren(nodes: any[]) {
    nodes.sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === 'folder' ? -1 : 1;
    });
    nodes.forEach((node) => {
      if (node.type === 'folder' && node.children) {
        sortChildren(node.children);
      }
    });
  }
  sortChildren(root.children);

  return root.children;
} 