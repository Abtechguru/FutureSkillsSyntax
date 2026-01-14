import React, { useState, useRef, useCallback } from 'react'
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    List,
    ListOrdered,
    Link,
    Image,
    Code,
    Quote,
    Heading1,
    Heading2,
    Undo,
    Redo,
    AlignLeft,
    AlignCenter,
    AlignRight,
} from 'lucide-react'

import { cn } from '@/utils/cn'

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    minHeight?: string
    maxHeight?: string
    className?: string
}

const toolbarButtons = [
    { id: 'bold', icon: Bold, command: 'bold', title: 'Bold' },
    { id: 'italic', icon: Italic, command: 'italic', title: 'Italic' },
    { id: 'underline', icon: Underline, command: 'underline', title: 'Underline' },
    { id: 'strikethrough', icon: Strikethrough, command: 'strikeThrough', title: 'Strikethrough' },
    { id: 'divider1', type: 'divider' },
    { id: 'h1', icon: Heading1, command: 'formatBlock', value: 'H2', title: 'Heading 1' },
    { id: 'h2', icon: Heading2, command: 'formatBlock', value: 'H3', title: 'Heading 2' },
    { id: 'divider2', type: 'divider' },
    { id: 'ul', icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
    { id: 'ol', icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
    { id: 'quote', icon: Quote, command: 'formatBlock', value: 'BLOCKQUOTE', title: 'Quote' },
    { id: 'code', icon: Code, command: 'formatBlock', value: 'PRE', title: 'Code Block' },
    { id: 'divider3', type: 'divider' },
    { id: 'alignLeft', icon: AlignLeft, command: 'justifyLeft', title: 'Align Left' },
    { id: 'alignCenter', icon: AlignCenter, command: 'justifyCenter', title: 'Align Center' },
    { id: 'alignRight', icon: AlignRight, command: 'justifyRight', title: 'Align Right' },
    { id: 'divider4', type: 'divider' },
    { id: 'link', icon: Link, command: 'createLink', title: 'Insert Link', needsValue: true },
    { id: 'image', icon: Image, command: 'insertImage', title: 'Insert Image', needsValue: true },
]

const RichTextEditor: React.FC<RichTextEditorProps> = ({
    value,
    onChange,
    placeholder = 'Start writing...',
    minHeight = '200px',
    maxHeight = '500px',
    className,
}) => {
    const editorRef = useRef<HTMLDivElement>(null)
    const [showLinkModal, setShowLinkModal] = useState(false)
    const [linkUrl, setLinkUrl] = useState('')

    const execCommand = useCallback((command: string, value?: string) => {
        document.execCommand(command, false, value)
        editorRef.current?.focus()
        handleContentChange()
    }, [])

    const handleToolbarClick = (button: typeof toolbarButtons[0]) => {
        if ('type' in button && button.type === 'divider') return

        if ('needsValue' in button && button.needsValue) {
            if (button.command === 'createLink') {
                const url = window.prompt('Enter URL:')
                if (url) {
                    execCommand('createLink', url)
                }
            } else if (button.command === 'insertImage') {
                const url = window.prompt('Enter image URL:')
                if (url) {
                    execCommand('insertImage', url)
                }
            }
        } else if ('value' in button && button.value) {
            execCommand(button.command!, button.value)
        } else if ('command' in button && button.command) {
            execCommand(button.command)
        }
    }

    const handleContentChange = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML)
        }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const text = e.clipboardData.getData('text/plain')
        document.execCommand('insertText', false, text)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Handle keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'b':
                    e.preventDefault()
                    execCommand('bold')
                    break
                case 'i':
                    e.preventDefault()
                    execCommand('italic')
                    break
                case 'u':
                    e.preventDefault()
                    execCommand('underline')
                    break
                case 'z':
                    e.preventDefault()
                    if (e.shiftKey) {
                        execCommand('redo')
                    } else {
                        execCommand('undo')
                    }
                    break
            }
        }
    }

    return (
        <div className={cn(
            'border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden',
            className
        )}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                {toolbarButtons.map((button) => {
                    if ('type' in button && button.type === 'divider') {
                        return (
                            <div
                                key={button.id}
                                className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"
                            />
                        )
                    }

                    const Icon = button.icon!
                    return (
                        <button
                            key={button.id}
                            onClick={() => handleToolbarClick(button)}
                            title={button.title}
                            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <Icon className="w-4 h-4" />
                        </button>
                    )
                })}

                <div className="ml-auto flex gap-0.5">
                    <button
                        onClick={() => execCommand('undo')}
                        title="Undo"
                        className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                    >
                        <Undo className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => execCommand('redo')}
                        title="Redo"
                        className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                    >
                        <Redo className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Editor */}
            <div
                ref={editorRef}
                contentEditable
                dangerouslySetInnerHTML={{ __html: value }}
                onInput={handleContentChange}
                onPaste={handlePaste}
                onKeyDown={handleKeyDown}
                data-placeholder={placeholder}
                className={cn(
                    'p-4 focus:outline-none prose prose-sm dark:prose-invert max-w-none',
                    'min-h-[200px] overflow-y-auto',
                    '[&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-gray-400',
                )}
                style={{ minHeight, maxHeight }}
            />

            {/* Character count or word count could go here */}
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500">
                <span>
                    {value.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length} words
                </span>
            </div>
        </div>
    )
}

export default RichTextEditor
