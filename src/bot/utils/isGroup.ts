export function isGroup(type: string): boolean {
  if (type === 'group' || type === 'supergroup') return true;
  return false;
}
