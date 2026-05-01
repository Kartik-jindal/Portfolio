'use client';

/**
 * RichTextEditor — Tiptap-based WYSIWYG editor for blog post content.
 *
 * Outputs clean HTML that is compatible with the existing
 * @tailwindcss/typography prose renderer on the public blog post page.
 *
 * Design: matches the admin panel's dark glass aesthetic.
 * No public-facing code is touched.
 */

import React, { useEffect } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import CharacterCount from '@tiptap/extension-character-count';
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    Heading1, Heading2, Heading3,
    List, ListOrdered, Quote, Code, Minus,
    AlignLeft, AlignCenter, AlignRight,
    Link as LinkIcon, Image as ImageIcon,
    Highlighter, Undo, Redo,
    AlertTriangle,
} from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    minHeight?: string;
}

// ── Toolbar button ────────────────────────────────────────────────────────────
const ToolBtn = ({
    onClick,
    active,
    disabled,
    title,
    children,
}: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
}) => (
    <button
        type="button"
        onMouseDown={(e) => { e.preventDefault(); onClick(); }}
        disabled={disabled}
        title={title}
        className={`
      w-8 h-8 rounded-lg flex items-center justify-center transition-all text-[11px]
      ${active
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'
            }
      ${disabled ? 'opacity-30 cursor-not-allowed' : ''}
    `}
    >
        {children}
    </button>
);

const Divider = () => <div className="w-px h-5 bg-white/10 mx-1" />;

// ── Main component ────────────────────────────────────────────────────────────
export const RichTextEditor = ({
    value,
    onChange,
    placeholder = 'Begin the narrative...',
    minHeight = '500px',
}: RichTextEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
                codeBlock: { HTMLAttributes: { class: 'not-prose bg-white/5 rounded-xl p-4 font-mono text-sm text-white/80 overflow-x-auto' } },
                blockquote: { HTMLAttributes: { class: 'border-l-2 border-primary/50 pl-6 italic text-white/60' } },
            }),
            Underline,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Highlight.configure({ multicolor: false }),
            Image.configure({ inline: false, allowBase64: false }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: 'text-primary underline underline-offset-2 hover:text-accent transition-colors', rel: 'noopener noreferrer' },
            }),
            Placeholder.configure({ placeholder }),
            CharacterCount,
        ],
        content: value || '',
        editorProps: {
            attributes: {
                class: 'prose prose-invert prose-lg max-w-none focus:outline-none text-white/80 leading-relaxed font-body',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // Sync external value changes (e.g. clone loading)
    useEffect(() => {
        if (!editor) return;
        const current = editor.getHTML();
        if (value !== current) {
            editor.commands.setContent(value || '', false);
        }
    }, [value, editor]);

    if (!editor) return null;

    const addLink = () => {
        const url = window.prompt('Enter URL:');
        if (!url) return;
        if (editor.state.selection.empty) {
            editor.chain().focus().insertContent(`<a href="${url}">${url}</a>`).run();
        } else {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const addImage = () => {
        const url = window.prompt('Enter image URL:');
        if (url) editor.chain().focus().setImage({ src: url }).run();
    };

    const wordCount = editor.storage.characterCount?.words() ?? 0;
    const charCount = editor.storage.characterCount?.characters() ?? 0;

    return (
        <div className="rounded-[1.5rem] border border-white/5 bg-white/[0.02] overflow-hidden">
            {/* ── Toolbar ── */}
            <div className="flex flex-wrap items-center gap-1 p-3 border-b border-white/5 bg-white/[0.02]">
                {/* History */}
                <ToolBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
                    <Undo className="w-3.5 h-3.5" />
                </ToolBtn>
                <ToolBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
                    <Redo className="w-3.5 h-3.5" />
                </ToolBtn>

                <Divider />

                {/* Headings */}
                <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Heading 1">
                    <Heading1 className="w-3.5 h-3.5" />
                </ToolBtn>
                <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">
                    <Heading2 className="w-3.5 h-3.5" />
                </ToolBtn>
                <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">
                    <Heading3 className="w-3.5 h-3.5" />
                </ToolBtn>

                <Divider />

                {/* Inline formatting */}
                <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
                    <Bold className="w-3.5 h-3.5" />
                </ToolBtn>
                <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
                    <Italic className="w-3.5 h-3.5" />
                </ToolBtn>
                <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
                    <UnderlineIcon className="w-3.5 h-3.5" />
                </ToolBtn>
                <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
                    <Strikethrough className="w-3.5 h-3.5" />
                </ToolBtn>
                <ToolBtn onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')} title="Highlight">
                    <Highlighter className="w-3.5 h-3.5" />
                </ToolBtn>
                <ToolBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline code">
                    <Code className="w-3.5 h-3.5" />
                </ToolBtn>

                <Divider />

                {/* Alignment */}
                <ToolBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align left">
                    <AlignLeft className="w-3.5 h-3.5" />
                </ToolBtn>
                <ToolBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align center">
                    <AlignCenter className="w-3.5 h-3.5" />
                </ToolBtn>
                <ToolBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align right">
                    <AlignRight className="w-3.5 h-3.5" />
                </ToolBtn>

                <Divider />

                {/* Block elements */}
                <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
                    <List className="w-3.5 h-3.5" />
                </ToolBtn>
                <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered list">
                    <ListOrdered className="w-3.5 h-3.5" />
                </ToolBtn>
                <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">
                    <Quote className="w-3.5 h-3.5" />
                </ToolBtn>
                <ToolBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code block">
                    <Code className="w-3.5 h-3.5" />
                </ToolBtn>
                <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule">
                    <Minus className="w-3.5 h-3.5" />
                </ToolBtn>

                <Divider />

                {/* Media */}
                <ToolBtn onClick={addLink} active={editor.isActive('link')} title="Insert link">
                    <LinkIcon className="w-3.5 h-3.5" />
                </ToolBtn>
                <ToolBtn onClick={addImage} title="Insert image by URL">
                    <ImageIcon className="w-3.5 h-3.5" />
                </ToolBtn>

                {/* Word count — right-aligned */}
                <div className="ml-auto flex items-center gap-3 text-[9px] font-mono text-white/20 pr-1">
                    <span>{wordCount} words</span>
                    <span>{charCount} chars</span>
                </div>
            </div>

            {/* ── Bubble menu for selected text ── */}
            <BubbleMenu
                editor={editor}
                tippyOptions={{ duration: 100 }}
                className="flex items-center gap-1 bg-[#0a0a0a] border border-white/10 rounded-xl p-1.5 shadow-2xl"
            >
                <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
                    <Bold className="w-3 h-3" />
                </ToolBtn>
                <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
                    <Italic className="w-3 h-3" />
                </ToolBtn>
                <ToolBtn onClick={addLink} active={editor.isActive('link')} title="Link">
                    <LinkIcon className="w-3 h-3" />
                </ToolBtn>
                {editor.isActive('link') && (
                    <ToolBtn onClick={() => editor.chain().focus().unsetLink().run()} title="Remove link">
                        <span className="text-[9px] font-black">✕</span>
                    </ToolBtn>
                )}
            </BubbleMenu>

            {/* ── Editor content area ── */}
            <div
                className="px-8 py-6"
                style={{ minHeight }}
                onClick={() => editor.commands.focus()}
            >
                <EditorContent editor={editor} />
            </div>

            {/* ── Empty state warning ── */}
            {editor.isEmpty && (
                <div className="px-8 pb-4 flex items-center gap-2 text-yellow-500/60">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Body Empty</span>
                </div>
            )}
        </div>
    );
};
