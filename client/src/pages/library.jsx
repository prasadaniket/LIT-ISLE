import Navbar from "../components/Navbar";

const collections = [
  "Books to Read Before You’re 30",
  "Award Winning Titles",
  "Beginner’s Starter Pack",
  "Geeky Picks",
  "Weekend Chill Reads",
];

const Collections = () => {
  return (
    <div className="min-h-screen page-bg">
      <Navbar />
      <section className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-gradient">Curated Collections</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((title) => (
            <div key={title} className="card">
              <h2 className="text-xl font-semibold mb-2">{title}</h2>
              <p className="text-gray-600">A hand-picked shelf curated by our editors and community.</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Collections;

