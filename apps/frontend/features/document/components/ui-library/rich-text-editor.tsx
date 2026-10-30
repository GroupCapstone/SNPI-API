'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Check,
  Copy,
  Layers,
} from '@/components/icons';

// ============================================================================
// 04 ALLOWLIST SANITIZER & 05 URL SCHEME GUARD
// ============================================================================

const ALLOWED_TAGS = new Set([
  'B',
  'STRONG',
  'I',
  'EM',
  'U',
  'S',
  'STRIKE',
  'H1',
  'H2',
  'H3',
  'H4',
  'P',
  'BR',
  'UL',
  'OL',
  'LI',
  'BLOCKQUOTE',
  'CODE',
  'PRE',
  'A',
]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  A: new Set(['href', 'title', 'target', 'rel']),
};

export function sanitizeHtmlAllowlist(rawHtml: string): string {
  if (typeof window === 'undefined') return rawHtml;
  if (!rawHtml || !rawHtml.trim()) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, 'text/html');

  function cleanNode(node: Node): Node | null {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.cloneNode(true);
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return null;
    }

    const el = node as HTMLElement;
    const tagName = el.tagName.toUpperCase();

    // Strip dangerous tags completely including their children (scripts, styles, iframes)
    if (['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'NOSCRIPT', 'SVG'].includes(tagName)) {
      return null;
    }

    // If tag is not in allowlist, flatten children into a fragment
    if (!ALLOWED_TAGS.has(tagName)) {
      const fragment = document.createDocumentFragment();
      el.childNodes.forEach((child) => {
        const cleaned = cleanNode(child);
        if (cleaned) fragment.appendChild(cleaned);
      });
      return fragment;
    }

    // Tag is allowed: create clean element
    const cleanEl = document.createElement(tagName.toLowerCase());

    // Filter attributes
    const allowedAttrSet = ALLOWED_ATTRS[tagName];
    if (allowedAttrSet) {
      Array.from(el.attributes).forEach((attr) => {
        const attrName = attr.name.toLowerCase();
        if (allowedAttrSet.has(attrName)) {
          const val = attr.value;
          if (attrName === 'href') {
            // 05 URL Scheme Guard: reject javascript:, data:, vbscript:
            const cleanVal = val.trim().toLowerCase();
            if (
              cleanVal.startsWith('javascript:') ||
              cleanVal.startsWith('data:') ||
              cleanVal.startsWith('vbscript:')
            ) {
              return; // drop dangerous URL scheme
            }
            cleanEl.setAttribute('href', val);
            cleanEl.setAttribute('rel', 'noopener nofollow');
            cleanEl.setAttribute('target', '_blank');
          } else {
            cleanEl.setAttribute(attrName, val);
          }
        }
      });
    }

    // Recursively clean children
    el.childNodes.forEach((child) => {
      const cleaned = cleanNode(child);
      if (cleaned) cleanEl.appendChild(cleaned);
    });

    return cleanEl;
  }

  const fragment = document.createDocumentFragment();
  doc.body.childNodes.forEach((child) => {
    const cleaned = cleanNode(child);
    if (cleaned) fragment.appendChild(cleaned);
  });

  const tempDiv = document.createElement('div');
  tempDiv.appendChild(fragment);
  return tempDiv.innerHTML;
}

// ============================================================================
// RICH TEXT EDITOR COMPONENT
// ============================================================================

export interface RichTextEditorProps {
  initialContent?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  theme?: 'light' | 'dark';
  className?: string;
  minHeight?: number;
}

export function RichTextEditor({
  initialContent = '<p>Welcome to the <strong>SNP-SMS</strong> institutional document editor. Select text to apply formatting, or try pasting HTML from other sources.</p>',
  onChange,
  placeholder = 'Type your formatted content here...',
  theme = 'light',
  className,
  minHeight = 180,
}: RichTextEditorProps) {
  const isDark = theme === 'dark';
  const editorRef = React.useRef<HTMLDivElement>(null);

  // 06 HTML Source View state
  const [isHtmlView, setIsHtmlView] = React.useState<boolean>(false);
  const [rawHtml, setRawHtml] = React.useState<string>(initialContent);
  const [sanitizedNotice, setSanitizedNotice] = React.useState<string | null>(null);

  // 03 Live State Sync for active formatting buttons
  const [activeStates, setActiveStates] = React.useState<{ [key: string]: boolean }>({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    insertUnorderedList: false,
    insertOrderedList: false,
    h2: false,
    blockquote: false,
  });

  // Populate initial content once on mount
  React.useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = sanitizeHtmlAllowlist(initialContent);
    }
  }, [initialContent]);

  // 03 Live State Sync: queries active document command state under current caret
  const updateActiveStates = React.useCallback(() => {
    if (isHtmlView || typeof document === 'undefined') return;

    try {
      const isH2 = document.queryCommandValue('formatBlock') === 'h2';
      const isQuote = document.queryCommandValue('formatBlock') === 'blockquote';

      setActiveStates({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strikeThrough: document.queryCommandState('strikeThrough'),
        insertUnorderedList: document.queryCommandState('insertUnorderedList'),
        insertOrderedList: document.queryCommandState('insertOrderedList'),
        h2: isH2,
        blockquote: isQuote,
      });
    } catch {
      // Ignored if queryCommandState is unavailable
    }
  }, [isHtmlView]);

  // 02 Command Toolbar execution seam
  const exec = (command: string, value: string | undefined = undefined) => {
    if (isHtmlView) return;
    document.execCommand(command, false, value);
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setRawHtml(html);
      onChange?.(html);
    }
    updateActiveStates();
  };

  // 05 URL Scheme Guard when adding hyperlinks
  const handleInsertLink = () => {
    if (isHtmlView) return;
    const url = window.prompt('Enter link URL (e.g. https://snpi.edu.kh):', 'https://');
    if (!url) return;

    const trimmed = url.trim();
    const lower = trimmed.toLowerCase();

    // 05 URL Scheme Guard: reject javascript:, data:, vbscript:
    if (
      lower.startsWith('javascript:') ||
      lower.startsWith('data:') ||
      lower.startsWith('vbscript:')
    ) {
      alert(
        'Security Warning: Disallowed URL scheme. javascript:, data:, and vbscript: are blocked.',
      );
      return;
    }

    const safeUrl =
      lower.startsWith('http://') || lower.startsWith('https://') || lower.startsWith('mailto:')
        ? trimmed
        : `https://${trimmed}`;

    document.execCommand('createLink', false, safeUrl);

    // Apply 05 rel="noopener nofollow" and target="_blank"
    if (editorRef.current) {
      const links = editorRef.current.querySelectorAll('a');
      links.forEach((a) => {
        a.setAttribute('rel', 'noopener nofollow');
        a.setAttribute('target', '_blank');
      });
      const html = editorRef.current.innerHTML;
      setRawHtml(html);
      onChange?.(html);
    }
    updateActiveStates();
  };

  // 04 Allowlist Sanitizer: Intercept onPaste
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const htmlData = e.clipboardData.getData('text/html');
    const textData = e.clipboardData.getData('text/plain');

    const cleanHtml = htmlData ? sanitizeHtmlAllowlist(htmlData) : textData;
    document.execCommand('insertHTML', false, cleanHtml);

    setSanitizedNotice('Pasted HTML stripped to safe allowlist (scripts & unknown tags removed).');
    setTimeout(() => setSanitizedNotice(null), 3500);

    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setRawHtml(html);
      onChange?.(html);
    }
    updateActiveStates();
  };

  // 08 Keyboard Shortcuts: Ctrl/Cmd + B, I, U, K
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.metaKey || e.ctrlKey) {
      const key = e.key.toLowerCase();
      if (key === 'b') {
        e.preventDefault();
        exec('bold');
      } else if (key === 'i') {
        e.preventDefault();
        exec('italic');
      } else if (key === 'u') {
        e.preventDefault();
        exec('underline');
      } else if (key === 'k') {
        e.preventDefault();
        handleInsertLink();
      }
    }
  };

  // 06 HTML Source View Toggle
  const toggleHtmlView = () => {
    if (isHtmlView) {
      // Switching from HTML source view back to visual WYSIWYG:
      // Re-sanitize whatever was typed in raw textarea to guarantee safety
      const clean = sanitizeHtmlAllowlist(rawHtml);
      setRawHtml(clean);
      if (editorRef.current) {
        editorRef.current.innerHTML = clean;
      }
      setIsHtmlView(false);
      onChange?.(clean);
    } else {
      // Switching from WYSIWYG to raw HTML textarea
      if (editorRef.current) {
        setRawHtml(editorRef.current.innerHTML);
      }
      setIsHtmlView(true);
    }
  };

  // Content change handler
  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setRawHtml(html);
      onChange?.(html);
    }
    updateActiveStates();
  };

  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-2xl border transition-colors',
        isDark
          ? 'border-slate-800 bg-[#00081C] text-slate-100'
          : 'border-slate-200 bg-white text-slate-900 shadow-xs',
        className,
      )}
    >
      {/* ======================================================== */}
      {/* 02 COMMAND TOOLBAR (role="toolbar")                      */}
      {/* 07 Selection-Safe Buttons (onMouseDown preventDefault)   */}
      {/* ======================================================== */}
      <div
        role="toolbar"
        aria-label="Formatting controls"
        className={cn(
          'flex flex-wrap items-center justify-between gap-1 border-b px-3 py-2 font-mono text-xs select-none',
          isDark
            ? 'border-slate-800 bg-slate-900/60 text-slate-300'
            : 'border-slate-100 bg-slate-50 text-slate-700',
        )}
      >
        <div className="flex flex-wrap items-center gap-1">
          {/* Bold */}
          <button
            type="button"
            disabled={isHtmlView}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec('bold')}
            aria-label="Bold (Ctrl+B)"
            aria-pressed={activeStates.bold}
            className={cn(
              'flex size-7 items-center justify-center rounded-lg border transition-all',
              activeStates.bold
                ? 'border-[#CAD3F5] bg-[#E3E7FC] font-bold text-[#0056FF] dark:border-cyan-500/40 dark:bg-cyan-500/20 dark:text-cyan-400'
                : 'border-transparent text-slate-600 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800',
            )}
          >
            <Bold className="size-3.5" />
          </button>

          {/* Italic */}
          <button
            type="button"
            disabled={isHtmlView}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec('italic')}
            aria-label="Italic (Ctrl+I)"
            aria-pressed={activeStates.italic}
            className={cn(
              'flex size-7 items-center justify-center rounded-lg border transition-all',
              activeStates.italic
                ? 'border-[#CAD3F5] bg-[#E3E7FC] font-bold text-[#0056FF] dark:border-cyan-500/40 dark:bg-cyan-500/20 dark:text-cyan-400'
                : 'border-transparent text-slate-600 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800',
            )}
          >
            <Italic className="size-3.5" />
          </button>

          {/* Underline */}
          <button
            type="button"
            disabled={isHtmlView}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec('underline')}
            aria-label="Underline (Ctrl+U)"
            aria-pressed={activeStates.underline}
            className={cn(
              'flex size-7 items-center justify-center rounded-lg border transition-all',
              activeStates.underline
                ? 'border-[#CAD3F5] bg-[#E3E7FC] font-bold text-[#0056FF] dark:border-cyan-500/40 dark:bg-cyan-500/20 dark:text-cyan-400'
                : 'border-transparent text-slate-600 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800',
            )}
          >
            <Underline className="size-3.5" />
          </button>

          {/* Strikethrough */}
          <button
            type="button"
            disabled={isHtmlView}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec('strikeThrough')}
            aria-label="Strikethrough"
            aria-pressed={activeStates.strikeThrough}
            className={cn(
              'flex size-7 items-center justify-center rounded-lg border transition-all',
              activeStates.strikeThrough
                ? 'border-[#CAD3F5] bg-[#E3E7FC] font-bold text-[#0056FF] dark:border-cyan-500/40 dark:bg-cyan-500/20 dark:text-cyan-400'
                : 'border-transparent text-slate-600 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800',
            )}
          >
            <Strikethrough className="size-3.5" />
          </button>

          <span className="mx-0.5 h-4 w-px bg-slate-200 dark:bg-slate-800" />

          {/* Heading 2 */}
          <button
            type="button"
            disabled={isHtmlView}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec('formatBlock', activeStates.h2 ? '<p>' : '<h2>')}
            aria-label="Heading 2"
            aria-pressed={activeStates.h2}
            className={cn(
              'flex size-7 items-center justify-center rounded-lg border transition-all',
              activeStates.h2
                ? 'border-[#CAD3F5] bg-[#E3E7FC] font-bold text-[#0056FF] dark:border-cyan-500/40 dark:bg-cyan-500/20 dark:text-cyan-400'
                : 'border-transparent text-slate-600 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800',
            )}
          >
            <Heading2 className="size-3.5" />
          </button>

          {/* Bullet List */}
          <button
            type="button"
            disabled={isHtmlView}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec('insertUnorderedList')}
            aria-label="Bullet list"
            aria-pressed={activeStates.insertUnorderedList}
            className={cn(
              'flex size-7 items-center justify-center rounded-lg border transition-all',
              activeStates.insertUnorderedList
                ? 'border-[#CAD3F5] bg-[#E3E7FC] font-bold text-[#0056FF] dark:border-cyan-500/40 dark:bg-cyan-500/20 dark:text-cyan-400'
                : 'border-transparent text-slate-600 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800',
            )}
          >
            <List className="size-3.5" />
          </button>

          {/* Numbered List */}
          <button
            type="button"
            disabled={isHtmlView}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec('insertOrderedList')}
            aria-label="Numbered list"
            aria-pressed={activeStates.insertOrderedList}
            className={cn(
              'flex size-7 items-center justify-center rounded-lg border transition-all',
              activeStates.insertOrderedList
                ? 'border-[#CAD3F5] bg-[#E3E7FC] font-bold text-[#0056FF] dark:border-cyan-500/40 dark:bg-cyan-500/20 dark:text-cyan-400'
                : 'border-transparent text-slate-600 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800',
            )}
          >
            <ListOrdered className="size-3.5" />
          </button>

          {/* Blockquote */}
          <button
            type="button"
            disabled={isHtmlView}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec('formatBlock', activeStates.blockquote ? '<p>' : '<blockquote>')}
            aria-label="Quote block"
            aria-pressed={activeStates.blockquote}
            className={cn(
              'flex size-7 items-center justify-center rounded-lg border transition-all',
              activeStates.blockquote
                ? 'border-[#CAD3F5] bg-[#E3E7FC] font-bold text-[#0056FF] dark:border-cyan-500/40 dark:bg-cyan-500/20 dark:text-cyan-400'
                : 'border-transparent text-slate-600 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800',
            )}
          >
            <Quote className="size-3.5" />
          </button>

          {/* Code */}
          <button
            type="button"
            disabled={isHtmlView}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec('formatBlock', '<pre>')}
            aria-label="Code block"
            className="flex size-7 items-center justify-center rounded-lg border border-transparent text-slate-600 transition-all hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <Code className="size-3.5" />
          </button>

          {/* Link */}
          <button
            type="button"
            disabled={isHtmlView}
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleInsertLink}
            aria-label="Insert Link (Ctrl+K)"
            className="flex size-7 items-center justify-center rounded-lg border border-transparent text-slate-600 transition-all hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <LinkIcon className="size-3.5" />
          </button>

          <span className="mx-0.5 h-4 w-px bg-slate-200 dark:bg-slate-800" />

          {/* Clear Format */}
          <button
            type="button"
            disabled={isHtmlView}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec('removeFormat')}
            aria-label="Clear formatting"
            className="flex size-7 items-center justify-center rounded-lg border border-transparent text-[11px] font-bold text-slate-500 transition-all hover:bg-slate-200/60 hover:text-slate-900 dark:hover:bg-slate-800"
          >
            T<span className="text-[9px] line-through">x</span>
          </button>
        </div>

        {/* 06 HTML Source View Toggle */}
        <div className="flex items-center gap-1.5 pt-1 sm:pt-0">
          <button
            type="button"
            onClick={toggleHtmlView}
            className={cn(
              'flex items-center gap-1 rounded-lg border px-2.5 py-1 font-mono text-[11px] font-bold transition-colors',
              isHtmlView
                ? 'border-[#CAD3F5] bg-[#E3E7FC] text-[#0056FF] dark:border-cyan-500/40 dark:bg-cyan-500/20 dark:text-cyan-400'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300',
            )}
          >
            <Code className="size-3" />
            <span>{isHtmlView ? 'Visual Mode' : '</> HTML Source'}</span>
          </button>
        </div>
      </div>

      {/* Sanitized notice banner */}
      {sanitizedNotice && (
        <div className="flex items-center gap-1.5 border-b border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="size-3.5" />
          <span>{sanitizedNotice}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 01 CONTENTEDITABLE SURFACE vs 06 HTML SOURCE VIEW        */}
      {/* ======================================================== */}
      {isHtmlView ? (
        <textarea
          value={rawHtml}
          onChange={(e) => setRawHtml(e.target.value)}
          style={{ minHeight: `${minHeight}px` }}
          aria-label="Raw HTML Source"
          className={cn(
            'w-full resize-y p-4 font-mono text-xs leading-relaxed outline-none',
            isDark ? 'bg-slate-950 text-cyan-300' : 'bg-slate-900 text-slate-100',
          )}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          role="textbox"
          aria-multiline="true"
          onInput={handleInput}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          onKeyUp={updateActiveStates}
          onMouseUp={updateActiveStates}
          data-placeholder={placeholder}
          style={{ minHeight: `${minHeight}px` }}
          className={cn(
            'p-4 font-sans text-xs leading-relaxed transition-colors outline-none focus:outline-none',
            '[&_h2]:mt-3 [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-bold',
            '[&_p]:mb-2.5',
            '[&_ul]:mb-2.5 [&_ul]:list-disc [&_ul]:pl-5',
            '[&_ol]:mb-2.5 [&_ol]:list-decimal [&_ol]:pl-5',
            '[&_blockquote]:mb-2.5 [&_blockquote]:border-l-2 [&_blockquote]:border-[#0056FF] [&_blockquote]:pl-3 [&_blockquote]:italic dark:[&_blockquote]:border-cyan-400',
            '[&_pre]:mb-2.5 [&_pre]:rounded-xl [&_pre]:bg-slate-100 [&_pre]:p-2.5 [&_pre]:font-mono [&_pre]:dark:bg-slate-900',
            '[&_code]:rounded-md [&_code]:bg-slate-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:dark:bg-slate-800',
            '[&_a]:text-[#0056FF] [&_a]:underline [&_a]:dark:text-[#38BDF8]',
          )}
        />
      )}

      {/* Editor Status Bar */}
      <div
        className={cn(
          'flex flex-wrap items-center justify-between gap-2 border-t px-4 py-2 font-mono text-[10px]',
          isDark
            ? 'border-slate-800/80 bg-slate-900/40 text-slate-500'
            : 'border-slate-100 bg-slate-50 text-slate-400',
        )}
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <ShieldCheck className="size-3 text-emerald-500" />
            <span>Sanitized Allowlist Active</span>
          </span>
          <span>&middot;</span>
          <span>URL Schemes Guarded</span>
        </div>

        <div className="flex items-center gap-2">
          <span>Shortcuts: ⌘+B &middot; ⌘+I &middot; ⌘+U &middot; ⌘+K</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// INTERACTIVE DOCUMENTATION DEMO: RichTextEditorDemo
// ============================================================================

export function RichTextEditorDemo() {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const [editorContent, setEditorContent] = React.useState<string>(
    '<h2>SNP-SMS Academic Ledger Protocol</h2><p>Student evaluations and credit transfers are authenticated using <strong>constant-time cryptographic checks</strong>. Never store plaintext credentials or allow unsanitized input in institutional archives.</p><ul><li>Automatic allowlist filtering</li><li>Scheme rejection for <code>javascript:</code> and <code>data:</code></li><li>Preserved caret selection on toolbar clicks</li></ul>',
  );

  const simulateMaliciousPaste = () => {
    const dirtyHtml = `
      <div style="background: red; font-size: 30px;">
        <h3>Suspicious Web Snippet</h3>
        <script>alert('malicious exploit script');</script>
        <p style="color: blue;">Legitimate content with inline styles.</p>
        <a href="javascript:alert('xss')">Dangerous Link</a>
        <a href="https://snpi.edu.kh">Official Portal Link</a>
        <iframe src="https://evil.com"></iframe>
      </div>
    `;
    const clean = sanitizeHtmlAllowlist(dirtyHtml);
    setEditorContent((prev) => `${prev} <hr/> ${clean}`);
  };

  return (
    <div className="w-full space-y-6">
      {/* Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold tracking-wider text-slate-400 uppercase">
            Theme:
          </span>
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={cn(
              'rounded-full px-2.5 py-0.5 font-mono text-[11px] font-bold transition-colors',
              theme === 'light'
                ? 'bg-[#0056FF] text-white'
                : 'border border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900',
            )}
          >
            Light
          </button>
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={cn(
              'rounded-full px-2.5 py-0.5 font-mono text-[11px] font-bold transition-colors',
              theme === 'dark'
                ? 'bg-slate-900 text-white'
                : 'border border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900',
            )}
          >
            Dark
          </button>
        </div>

        {/* Security Test Button */}
        <button
          type="button"
          onClick={simulateMaliciousPaste}
          className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1 font-mono text-xs font-bold text-red-600 transition-colors hover:bg-red-500/20 dark:text-red-400"
        >
          <ShieldCheck className="size-3.5" />
          <span>Simulate Dirty Paste (Strip Scripts)</span>
        </button>
      </div>

      {/* The Rich Text Editor Instance */}
      <RichTextEditor
        theme={theme}
        initialContent={editorContent}
        onChange={setEditorContent}
        minHeight={200}
      />

      {/* Feature & Security Architecture Grid */}
      <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-4">
        <div className="space-y-1 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/40">
          <span className="font-mono text-[10px] font-bold text-[#0056FF] dark:text-[#38BDF8]">
            01 Surface
          </span>
          <p className="font-bold text-slate-800 dark:text-slate-200">contenteditable</p>
          <p className="text-[11px] text-slate-500">
            Native DOM surface with role=&quot;textbox&quot;, no iframe.
          </p>
        </div>

        <div className="space-y-1 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/40">
          <span className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            04 Sanitizer
          </span>
          <p className="font-bold text-slate-800 dark:text-slate-200">Detached Allowlist</p>
          <p className="text-[11px] text-slate-500">
            Strips script, style, and unknown tags on paste.
          </p>
        </div>

        <div className="space-y-1 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/40">
          <span className="font-mono text-[10px] font-bold text-amber-600 dark:text-amber-400">
            05 URL Guard
          </span>
          <p className="font-bold text-slate-800 dark:text-slate-200">Scheme Shield</p>
          <p className="text-[11px] text-slate-500">
            Rejects javascript: & data:; appends noopener.
          </p>
        </div>

        <div className="space-y-1 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/40">
          <span className="font-mono text-[10px] font-bold text-purple-600 dark:text-purple-400">
            07 Selection
          </span>
          <p className="font-bold text-slate-800 dark:text-slate-200">Safe Toolbar</p>
          <p className="text-[11px] text-slate-500">
            preventDefault on mousedown preserves selection range.
          </p>
        </div>
      </div>
    </div>
  );
}
