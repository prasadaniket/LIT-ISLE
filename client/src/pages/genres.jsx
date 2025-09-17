import Navbar from "../components/Navbar";

const categories = [
  {
    title: "Fiction",
    items: ["Fantasy", "Sci-Fi", "Romance", "Mystery", "Thriller", "Historical"],
  },
  {
    title: "Non-Fiction",
    items: ["Biography", "Self-Help", "Science", "Philosophy", "Business"],
  },
  { title: "Kids / Young Adult", items: ["Kids", "Young Adult"] },
  { title: "Comics & Manga", items: ["Comics", "Manga"] },
  { title: "Poetry & Classics", items: ["Poetry", "Classics"] },
];

const Categories = () => {
  return (
    <div className="min-h-screen page-bg">
      <Navbar />
      <section className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-gradient">Library Categories</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.title} className="card">
              <h2 className="text-xl font-semibold mb-3">{cat.title}</h2>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                {cat.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Categories;

