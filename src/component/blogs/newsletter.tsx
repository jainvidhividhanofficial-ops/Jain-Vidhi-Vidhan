export default function Newsletter() {
  return (
    <section className="max-w-5xl mx-auto bg-[#a72c3e] text-white rounded-2xl py-12 px-6 text-center my-16">
      <h2 className="text-2xl md:text-3xl font-semibold mb-3">Stay Updated</h2>
      <p className="max-w-2xl mx-auto mb-6">
        Subscribe to our newsletter and never miss the latest articles about Jain traditions, festivals, and cultural insights.
      </p>
      <form className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-xl mx-auto">
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full sm:flex-1 px-4 py-3 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#d4a017]"
        />
        <button
          type="submit"
          className="bg-[#d4a017] hover:bg-[#c09414] text-black font-semibold px-6 py-3 rounded-md"
        >
          Subscribe
        </button>
      </form>
    </section>
  );
}
