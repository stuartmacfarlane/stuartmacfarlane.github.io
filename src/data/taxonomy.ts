export interface TermMeta {
  cover?: string;
  description?: string;
}

export const categoryMeta: Record<string, TermMeta> = {};
export const tagMeta: Record<string, TermMeta> = {};
export const categoryAliases: Record<string, string[]> = {};
