interface PuterAI {
  chat: (prompt: string, options?: { model?: string }) => Promise<{ message?: string; text?: string }>;
}

interface PuterFS {
  upload: (filename: string, blob: Blob) => Promise<{ url?: string; path?: string }>;
}

interface PuterGlobal {
  ai?: PuterAI;
  fs?: PuterFS;
}

declare global {
  interface Window {
    puter?: PuterGlobal;
  }
}

export {};
