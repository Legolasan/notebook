'use client';

import { useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  const html = useMemo(() => {
    if (!content) return '';

    // Configure marked for inline rendering
    marked.setOptions({
      breaks: true,
      gfm: true,
    });

    const rawHtml = marked.parse(content) as string;
    return DOMPurify.sanitize(rawHtml);
  }, [content]);

  return (
    <div
      className="prose prose-stone prose-sm max-w-none
                 prose-headings:font-serif prose-headings:text-stone-800
                 prose-p:text-stone-700 prose-p:leading-relaxed
                 prose-strong:text-stone-900
                 prose-code:bg-stone-100 prose-code:px-1 prose-code:rounded
                 prose-a:text-amber-700 prose-a:no-underline hover:prose-a:underline
                 prose-ul:list-disc prose-ol:list-decimal
                 prose-li:text-stone-700"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
