export const slugify = s => s
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[\u0300-\u036F]/g, '') // Remove common accents.
  .replace(/[æ]/g, 'ae')           // Special case
  .replace(/[\s:]/g, '-')
  .replace(/[^a-z0-9-]/g, '')
  .replace(/-{2,}/g, '-')    // Trim consecutive separators.
  .replace(/^-+|-+$/g, '')   // Trim prefix and postfix separators.