import { BookSearch } from "@/components/BookSearch";

export default function Home() {
  return (
    <main className="flex-1 w-full bg-[var(--color-accent-pink)]">
      <div className="bg-gradient-to-b from-white to-[var(--color-accent-pink)] pb-12 pt-8">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-black text-[var(--color-primary-pink)] drop-shadow-sm tracking-tight">
            Find Your Next <br />
            <span className="text-[var(--color-primary-green)]">Favorite Berry</span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto">
            Search for books, track your reading progress, and build your digital bookshelf.
          </p>
        </div>
      </div>

      <div className="px-6 pb-20">
        <BookSearch />
      </div>
    </main>
  );
}
