const topics = [
  {
    title: "Festivals",
    desc: "Paryushan, Diwali, and other Jain festival celebrations"
  },
  {
    title: "Traditions",
    desc: "Ancient customs and their modern interpretations"
  },
  {
    title: "Ceremonies",
    desc: "Wedding rituals, naming ceremonies, and life events"
  },
  {
    title: "Spirituality",
    desc: "Meditation, prayers, and spiritual practices"
  },
];

export default function PopularTopics() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <h2 className="text-2xl md:text-3xl font-semibold text-[#a72c3e] mb-6">
        Popular Topics
      </h2>
      <p className="text-gray-700 mb-8">
        Explore articles by category to find content that interests you most
      </p>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        {topics.map((topic, i) => (
          <div
            key={i}
            className="bg-white shadow-md rounded-xl p-6 hover:bg-[#a72c3e] hover:text-white transition"
          >
            <h4 className="text-lg font-semibold mb-2">{topic.title}</h4>
            <p className="text-sm">{topic.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
