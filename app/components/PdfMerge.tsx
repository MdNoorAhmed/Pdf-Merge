'use client'

import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'

export default function PdfMerge() {
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleMerge = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const mergedPdf = await PDFDocument.create()

    for (let file of Array.from(files)) {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer)
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
      copiedPages.forEach((page) => mergedPdf.addPage(page))
    }

    const mergedPdfBytes = await mergedPdf.save()
    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    setMergedPdfUrl(url)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleMerge(e.dataTransfer.files)
  }

  return (
    <div
      className={`border-2 border-dashed p-8 rounded-xl text-center transition ${
        isDragging ? 'border-indigo-700 bg-indigo-50' : 'border-white bg-white'
      } max-w-xl mx-auto`}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <h2 className="text-2xl font-bold text-[#5b21b6] mb-2">
        Upload PDFs to Merge
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Drag and drop multiple PDF files here, or{' '}
        <label className="underline cursor-pointer text-[#5b21b6] font-medium">
          click to select
          <input
            type="file"
            multiple
            accept="application/pdf"
            className="hidden"
            onChange={(e) => handleMerge(e.target.files)}
          />
        </label>
      </p>

      {mergedPdfUrl && (
        <a
          href={mergedPdfUrl}
          download="merged.pdf"
          className="inline-block mt-4 bg-[#5b21b6] text-white py-2 px-6 rounded-full hover:bg-[#4c1d95] transition"
        >
          Download Merged PDF
        </a>
      )}
    </div>
  )
}
