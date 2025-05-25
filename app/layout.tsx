import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-[#5b21b6] text-white font-sans min-h-screen flex flex-col">
          <header className="flex justify-between items-center px-6 py-4 shadow-md border-b border-indigo-700 bg-[#5b21b6]">
            <div className="text-xl font-bold tracking-wide">📎 PDFMerge</div>
            <div className="flex gap-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-white font-semibold hover:text-indigo-200 transition">
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="text-white font-semibold hover:text-indigo-200 transition">
                    Sign up
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </header>
          <main className="flex-grow flex flex-col justify-center">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}
