'use client';

import { useCallback, useRef, KeyboardEvent } from 'react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = useCallback((before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);

    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  }, [value, onChange]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          insertMarkdown('**', '**');
          break;
        case 'i':
          e.preventDefault();
          insertMarkdown('*', '*');
          break;
        case 'k':
          e.preventDefault();
          insertMarkdown('[', '](url)');
          break;
        case '`':
          e.preventDefault();
          insertMarkdown('`', '`');
          break;
      }
    }

    // Handle list auto-continue
    if (e.key === 'Enter') {
      const textarea = e.currentTarget;
      const cursorPos = textarea.selectionStart;
      const textBefore = value.substring(0, cursorPos);
      const lines = textBefore.split('\n');
      const currentLine = lines[lines.length - 1];

      // Check for list patterns
      const listMatch = currentLine.match(/^(\s*)([-*+]|\d+\.)\s/);
      if (listMatch) {
        const [, indent, bullet] = listMatch;

        // If current line is empty list item, remove it
        if (currentLine.trim() === bullet || currentLine.trim() === `${bullet} `) {
          e.preventDefault();
          const newValue = value.substring(0, cursorPos - currentLine.length) + value.substring(cursorPos);
          onChange(newValue);
          return;
        }

        e.preventDefault();
        const nextBullet = bullet.match(/\d+/)
          ? `${parseInt(bullet) + 1}.`
          : bullet;
        const insertion = `\n${indent}${nextBullet} `;
        const newValue = value.substring(0, cursorPos) + insertion + value.substring(cursorPos);
        onChange(newValue);

        setTimeout(() => {
          textarea.setSelectionRange(cursorPos + insertion.length, cursorPos + insertion.length);
        }, 0);
      }
    }
  }, [value, onChange, insertMarkdown]);

  return (
    <div className="relative h-full">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || "Start writing your notes...\n\nKeyboard shortcuts:\n- Ctrl/Cmd + B: Bold\n- Ctrl/Cmd + I: Italic\n- Ctrl/Cmd + K: Link\n- Ctrl/Cmd + `: Code"}
        className="w-full h-full resize-none bg-transparent font-mono text-stone-800
                   leading-relaxed focus:outline-none placeholder:text-stone-400
                   selection:bg-amber-200"
        style={{
          lineHeight: '1.8rem',
        }}
      />
    </div>
  );
}
