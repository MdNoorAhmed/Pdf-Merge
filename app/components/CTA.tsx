'use client'

import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'

export default function CTA() {
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null)
  const [isMerging, setIsMerging] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files
    if (selected) {
      handleFiles(Array.from(selected))
    }
  }

  const handleFiles = (selectedFiles: File[]) => {
    const validFiles = selectedFiles.filter(
      (file) => file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024
    )

    if (validFiles.length < selectedFiles.length) {
      setError('Some files were skipped: only PDFs under 5MB are allowed.')
    } else {
      setError(null)
    }

    setFiles(validFiles)
    setMergedPdfUrl(null)
  }

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleRemoveFile = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name))
  }

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 PDF files to merge.')
      return
    }

    setIsMerging(true)
    setError(null)

    const mergedPdf = await PDFDocument.create()

    for (let file of files) {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer)
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
      copiedPages.forEach((page) => mergedPdf.addPage(page))
    }

    const mergedPdfBytes = await mergedPdf.save()
    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    setMergedPdfUrl(url)
    setIsMerging(false)
  }

  return (
    <section className="text-center text-white">
      <div className="max-w-xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Ready to merge your PDFs?</h2>
        <p className="mb-6 text-lg">Upload your files to get started</p>

        {/* Drag & Drop and Upload Button */}
        <label
          className={`relative w-full max-w-md mx-auto block border-2 border-dashed rounded-lg p-6 transition ${
            isDragging ? 'border-indigo-500 bg-indigo-100' : 'border-white bg-white'
          }`}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div className="text-[#5b21b6] font-medium cursor-pointer">
            📁 {files.length > 0 ? `${files.length} file(s) selected` : 'Click or drag PDF files here'}
          </div>
          <input
            type="file"
            multiple
            accept="application/pdf"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </label>

        {/* Error message */}
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

        {/* File list */}
        {files.length > 0 && (
          <ul className="mt-4 text-sm text-white space-y-1 max-h-40 overflow-auto">
            {files.map((file, i) => (
              <li
                key={i}
                className="flex justify-between items-center bg-[#4c1d95] px-4 py-2 rounded"
              >
                <span className="truncate">{file.name}</span>
                <button
                  onClick={() => handleRemoveFile(file.name)}
                  className="ml-2 text-red-300 hover:text-red-500"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Merge Button with Spinner */}
        {files.length > 1 && (
          <button
            onClick={handleMerge}
            disabled={isMerging}
            className="mt-6 bg-white text-[#5b21b6] font-semibold py-3 px-6 rounded-full hover:bg-gray-200 transition disabled:opacity-50 flex items-center justify-center mx-auto"
          >
            {isMerging ? (
              <span className="animate-spin h-5 w-5 border-2 border-t-transparent border-[#5b21b6] rounded-full mr-2"></span>
            ) : null}
            {isMerging ? 'Merging...' : 'Merge PDFs'}
          </button>
        )}

        {/* Download Link */}
        {mergedPdfUrl && (
          <a
            href={mergedPdfUrl}
            download="merged.pdf"
            className="block mt-6 bg-white text-[#5b21b6] font-semibold py-3 px-6 rounded-full hover:bg-gray-200 transition"
          >
            Download Merged PDF
          </a>
        )}
      </div>
    </section>
  )
}
