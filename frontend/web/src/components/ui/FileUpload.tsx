import React, { forwardRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { Upload, X, File, Image, FileText, Film } from 'lucide-react'

export interface FileUploadProps {
    accept?: string
    multiple?: boolean
    maxSize?: number // in bytes
    maxFiles?: number
    label?: string
    helperText?: string
    error?: string
    disabled?: boolean
    onChange?: (files: File[]) => void
    className?: string
}

const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(
    (
        {
            accept,
            multiple = false,
            maxSize = 10 * 1024 * 1024, // 10MB default
            maxFiles = 5,
            label,
            helperText,
            error,
            disabled = false,
            onChange,
            className,
        },
        ref
    ) => {
        const [files, setFiles] = useState<File[]>([])
        const [isDragging, setIsDragging] = useState(false)
        const [uploadError, setUploadError] = useState<string | null>(null)

        const getFileIcon = (file: File) => {
            const type = file.type.split('/')[0]
            switch (type) {
                case 'image':
                    return <Image className="w-5 h-5" />
                case 'video':
                    return <Film className="w-5 h-5" />
                case 'text':
                    return <FileText className="w-5 h-5" />
                default:
                    return <File className="w-5 h-5" />
            }
        }

        const formatFileSize = (bytes: number) => {
            if (bytes === 0) return '0 Bytes'
            const k = 1024
            const sizes = ['Bytes', 'KB', 'MB', 'GB']
            const i = Math.floor(Math.log(bytes) / Math.log(k))
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
        }

        const validateFiles = useCallback(
            (fileList: File[]): File[] => {
                setUploadError(null)
                let validFiles = fileList

                // Check max files
                if (multiple && validFiles.length > maxFiles) {
                    setUploadError(`Maximum ${maxFiles} files allowed`)
                    validFiles = validFiles.slice(0, maxFiles)
                }

                // Check file sizes
                validFiles = validFiles.filter((file) => {
                    if (file.size > maxSize) {
                        setUploadError(`File ${file.name} exceeds ${formatFileSize(maxSize)}`)
                        return false
                    }
                    return true
                })

                return validFiles
            },
            [maxFiles, maxSize, multiple]
        )

        const handleDrop = useCallback(
            (e: React.DragEvent<HTMLDivElement>) => {
                e.preventDefault()
                setIsDragging(false)

                if (disabled) return

                const droppedFiles = Array.from(e.dataTransfer.files)
                const validFiles = validateFiles(droppedFiles)

                if (validFiles.length > 0) {
                    const newFiles = multiple ? [...files, ...validFiles] : validFiles
                    setFiles(newFiles)
                    onChange?.(newFiles)
                }
            },
            [disabled, files, multiple, onChange, validateFiles]
        )

        const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!e.target.files || disabled) return

            const selectedFiles = Array.from(e.target.files)
            const validFiles = validateFiles(selectedFiles)

            if (validFiles.length > 0) {
                const newFiles = multiple ? [...files, ...validFiles] : validFiles
                setFiles(newFiles)
                onChange?.(newFiles)
            }
        }

        const removeFile = (index: number) => {
            const newFiles = files.filter((_, i) => i !== index)
            setFiles(newFiles)
            onChange?.(newFiles)
        }

        return (
            <div ref={ref} className={cn('flex flex-col gap-2', className)}>
                {label && (
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {label}
                    </label>
                )}

                <motion.div
                    onDragOver={(e) => {
                        e.preventDefault()
                        setIsDragging(true)
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    animate={{
                        borderColor: isDragging ? 'var(--color-primary)' : undefined,
                        backgroundColor: isDragging ? 'rgba(79, 70, 229, 0.05)' : undefined,
                    }}
                    className={cn(
                        'relative flex flex-col items-center justify-center gap-3 p-6',
                        'border-2 border-dashed rounded-lg',
                        'transition-colors duration-200',
                        disabled
                            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                            : 'border-gray-300 dark:border-gray-600 hover:border-primary cursor-pointer',
                        error && 'border-error'
                    )}
                >
                    <input
                        type="file"
                        accept={accept}
                        multiple={multiple}
                        onChange={handleFileSelect}
                        disabled={disabled}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />

                    <div
                        className={cn(
                            'p-3 rounded-full',
                            isDragging ? 'bg-primary/10' : 'bg-gray-100 dark:bg-gray-800'
                        )}
                    >
                        <Upload
                            className={cn(
                                'w-6 h-6',
                                isDragging ? 'text-primary' : 'text-gray-400'
                            )}
                        />
                    </div>

                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {isDragging ? 'Drop files here' : 'Drag & drop files here'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            or click to browse
                        </p>
                    </div>

                    <p className="text-xs text-gray-400">
                        Max size: {formatFileSize(maxSize)}
                        {multiple && ` • Max files: ${maxFiles}`}
                    </p>
                </motion.div>

                {files.length > 0 && (
                    <div className="space-y-2">
                        {files.map((file, index) => (
                            <motion.div
                                key={`${file.name}-${index}`}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                            >
                                <div className="text-gray-400">{getFileIcon(file)}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    className="p-1 text-gray-400 hover:text-error rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}

                {(error || uploadError || helperText) && (
                    <p
                        className={cn(
                            'text-xs',
                            error || uploadError
                                ? 'text-error'
                                : 'text-gray-500 dark:text-gray-400'
                        )}
                    >
                        {error || uploadError || helperText}
                    </p>
                )}
            </div>
        )
    }
)

FileUpload.displayName = 'FileUpload'

export default FileUpload
