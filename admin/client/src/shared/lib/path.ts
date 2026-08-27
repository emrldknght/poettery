export function getFolder(filePath: string): string {
  const parts = filePath.split('/');
  return parts.length > 1 ? parts[0] : 'root';
}

export function stripYamlHeader(content: string): string {
  return content.replace(/^---[\s\S]*?---\n/, '');
}