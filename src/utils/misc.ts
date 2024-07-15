export function sanitizeSearchTerm(searchTerm: string): string {
  // Remove quotes which can cause issues in tsquery
  return searchTerm.replace(/['"]/g, '');
}


