'use client';

import { useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface MarkdownPreviewProps {
  content: string;
}

// Custom extension for highlight syntax ==text==
const highlightExtension = {
  name: 'highlight',
  level: 'inline' as const,
  start(src: string) {
    return src.indexOf('==');
  },
  tokenizer(src: string) {
    const match = src.match(/^==([^=]+)==/);
    if (match) {
      return {
        type: 'highlight',
        raw: match[0],
        text: match[1],
      };
    }
    return undefined;
  },
  renderer(token: { text: string }) {
    return `<mark class="highlight">${token.text}</mark>`;
  },
};

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  const html = useMemo(() => {
    if (!content) return '';

    // Configure marked with highlight extension
    marked.use({
      breaks: true,
      gfm: true,
      extensions: [highlightExtension],
    });

    const rawHtml = marked.parse(content) as string;

    // Allow mark tag in sanitization
    return DOMPurify.sanitize(rawHtml, {
      ADD_TAGS: ['mark'],
      ADD_ATTR: ['class'],
    });
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
                 prose-li:text-stone-700
                 [&_.highlight]:bg-yellow-200 [&_.highlight]:px-1 [&_.highlight]:rounded-sm"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
