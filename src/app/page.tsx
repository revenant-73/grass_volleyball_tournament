import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col flex-1 items-center justify-center p-8 sm:p-24 bg-white dark:bg-black">
        <div className="max-w-3xl w-full text-center sm:text-left space-y-8">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-black dark:text-zinc-50">
            Grass Doubles Tournament Platform
          </h1>
          <p className="text-xl leading-relaxed text-zinc-600 dark:text-zinc-400">
            A mobile-first platform to run your volleyball tournaments from signup to final results.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button className="px-8 py-4 bg-black text-white dark:bg-white dark:text-black font-semibold rounded-lg hover:opacity-90 transition-opacity">
              Explore Events
            </button>
            <Link href="/login" className="px-8 py-4 border border-zinc-200 dark:border-zinc-800 text-black dark:text-white font-semibold rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-center">
              Admin Login
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12 border-t border-zinc-100 dark:border-zinc-900">
            <div>
              <h3 className="font-bold text-black dark:text-white">Public Experience</h3>
              <p className="text-sm text-zinc-500 mt-2">Live scores, standings, and brackets for every spectator.</p>
            </div>
            <div>
              <h3 className="font-bold text-black dark:text-white">Easy Registration</h3>
              <p className="text-sm text-zinc-500 mt-2">Mobile-friendly team signups with integrated waivers and payments.</p>
            </div>
            <div>
              <h3 className="font-bold text-black dark:text-white">Admin Control</h3>
              <p className="text-sm text-zinc-500 mt-2">Generate pools and brackets instantly from your phone.</p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="p-8 text-center text-sm text-zinc-400 dark:border-zinc-900 border-t border-zinc-100">
        &copy; {new Date().getFullYear()} Grass Doubles Tournament Platform. Built for the grass.
      </footer>
    </div>
  );
}
