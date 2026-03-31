export interface Notebook {
  id: string;
  title: string;
  subject: string;
  coverImage?: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  pages?: Page[];
}

export interface Page {
  id: string;
  pageNumber: number;
  content: string;
  date: Date;
  notebookId: string;
  summary?: Summary | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Summary {
  id: string;
  bullets: string[];
  pageId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Quote {
  id: string;
  text: string;
  author?: string;
}

export interface NotebookWithPages extends Notebook {
  pages: Page[];
}
