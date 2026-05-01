'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Youtube from '@tiptap/extension-youtube'
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Heading3,
  Undo,
  Redo,
  ImageIcon,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react'
import { Youtube as YoutubeIcon } from '@/components/ui/BrandIcons'

interface TipTapEditorProps {
  content: string | Record<string, unknown>
  onChange: (content: Record<string, unknown>) => void
  placeholder?: string
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null

  const addImage = () => {
    const url = window.prompt('Image URL')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const addLink = () => {
    const url = window.prompt('URL')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    } else {
      editor.chain().focus().unsetLink().run()
    }
  }

  const addYoutube = () => {
    const url = window.prompt('YouTube URL')
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run()
    }
  }

  const btnClass = "p-2 rounded-md hover:bg-dc-surface-2 text-dc-muted hover:text-dc-text transition-colors"
  const activeClass = "p-2 rounded-md bg-dc-surface-2 text-dc-green transition-colors"

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-dc-border bg-dc-surface sticky top-0 z-10">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? activeClass : btnClass} title="Bold">
        <Bold className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? activeClass : btnClass} title="Italic">
        <Italic className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? activeClass : btnClass} title="Strikethrough">
        <Strikethrough className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-dc-border mx-1" />

      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? activeClass : btnClass} title="Heading 2">
        <Heading2 className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? activeClass : btnClass} title="Heading 3">
        <Heading3 className="w-4 h-4" />
      </button>
      
      <div className="w-px h-6 bg-dc-border mx-1" />

      <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? activeClass : btnClass} title="Align Left">
        <AlignLeft className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? activeClass : btnClass} title="Align Center">
        <AlignCenter className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? activeClass : btnClass} title="Align Right">
        <AlignRight className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-dc-border mx-1" />

      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? activeClass : btnClass} title="Bullet List">
        <List className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? activeClass : btnClass} title="Ordered List">
        <ListOrdered className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? activeClass : btnClass} title="Quote">
        <Quote className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-dc-border mx-1" />

      <button type="button" onClick={addLink} className={editor.isActive('link') ? activeClass : btnClass} title="Add Link">
        <LinkIcon className="w-4 h-4" />
      </button>
      <button type="button" onClick={addImage} className={btnClass} title="Add Image">
        <ImageIcon className="w-4 h-4" />
      </button>
      <button type="button" onClick={addYoutube} className={btnClass} title="Add YouTube Video">
        <YoutubeIcon className="w-4 h-4" />
      </button>

      <div className="flex-1" />

      <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className={btnClass} title="Undo">
        <Undo className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className={btnClass} title="Redo">
        <Redo className="w-4 h-4" />
      </button>
    </div>
  )
}

export function TipTapEditor({ content, onChange, placeholder = 'Write your story here...' }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      Image.configure({ inline: true }),
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Youtube.configure({ inline: false }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose-dc outline-none min-h-[300px] p-4 font-sans focus:ring-0',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON())
    },
  })

  return (
    <div className="border border-dc-border rounded-lg bg-dc-black overflow-hidden flex flex-col focus-within:border-dc-green transition-colors">
      <MenuBar editor={editor} />
      <div className="flex-1 bg-dc-black overflow-y-auto max-h-[600px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
