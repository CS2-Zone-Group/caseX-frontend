import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">
          CaseX
        </h1>
        <p className="text-xl mb-8 text-gray-600 dark:text-gray-400">
          CS2 Skinlari uchun O'zbekiston Marketplace
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link 
            href="/marketplace"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Marketplace
          </Link>
          <Link 
            href="/auth/login"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Kirish
          </Link>
        </div>
      </div>
    </main>
  )
}
