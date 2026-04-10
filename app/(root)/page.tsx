import HeroSection from "@/components/HeroSection";
import { sampleBooks } from "@/lib/constants";
import BookCard from "@/components/BookCard";

const HomePage = () => {
  return (
    <main className="wrapper container">
      <HeroSection />
      <div className="max-w-7xl px-5 mx-auto w-full pb-12">
        <div className="library-books-grid">
          {sampleBooks.map((book) => (
            <BookCard
              key={book._id}
              title={book.title}
              author={book.author}
              coverURL={book.coverURL}
              slug={book.slug}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default HomePage;
