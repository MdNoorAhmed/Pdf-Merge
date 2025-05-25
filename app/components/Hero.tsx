'use client'
import { useEffect, useState } from 'react'

const messages = [
  '💡 Secure. Fast. Free.',
  '🔐 No Sign-up Needed.',
  '📎 Instantly Merge PDFs.',
  '🚀 Built with Next.js + pdf-lib ❤️',
]

export default function Hero() {
  const [text, setText] = useState('')
  const [messageIndex, setMessageIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    const currentMessage = messages[messageIndex]
    if (charIndex < currentMessage.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + currentMessage[charIndex])
        setCharIndex(charIndex + 1)
      }, 50)
      return () => clearTimeout(timeout)
    } else {
      const timeout = setTimeout(() => {
        setCharIndex(0)
        setText('')
        setMessageIndex((messageIndex + 1) % messages.length)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [charIndex, messageIndex])

  return (
<section className="text-center text-white m-0 p-0">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-7xl font-bold mb-10">
          Merge PDFs in Seconds
        </h1>
        <div className="inline-block bg-white px-6 py-4 rounded-lg shadow-lg text-2xl md:text-3xl font-semibold text-[#5b21b6] tracking-wide">
          {text}
          <span className="animate-pulse text-[#5b21b6] ml-1">|</span>
        </div>
      </div>
    </section>
  )
}
