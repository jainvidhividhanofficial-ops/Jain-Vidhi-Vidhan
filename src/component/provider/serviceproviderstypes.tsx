const VerifiedProviders = () => {
  const providers = [
    {
      image:
        "https://i.pinimg.com/736x/4d/91/96/4d9196f317394a862fa43d71333f6876.jpg",
      title: "Pandits",
      description: "Experienced priests for religious ceremonies and rituals",
    },
    {
      image:
        "https://i.pinimg.com/1200x/b4/74/57/b474571e490771734457caacb7dc0d12.jpg",
      title: "Musicians",
      description: "Bhajan mandalis and traditional music performers",
    },
    {
      image:
        "https://i.pinimg.com/736x/c2/43/bd/c243bdc783305f4d0406ffb08cbc5d0f.jpg",
      title: "Decorators",
      description: "Traditional and modern decoration specialists",
    },
    {
      image:
        "https://i.pinimg.com/736x/e8/0b/89/e80b89da5f0ca95ea7930d95f1de33a2.jpg",
      title: "Anchors & MCs",
      description: "Professional event hosts and ceremony coordinators",
    },
  ];

  return (
    <section className="py-12 px-4 md:px-8 lg:px-16 bg-gray-50 text-center">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mb-3">
          Types of Service Providers
        </h2>
        <p className="text-base sm:text-lg text-gray-600 mb-10">
          Find the right professional for your specific needs
        </p>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {providers.map((provider, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-gray-100 rounded-lg shadow-md hover:shadow-xl transition transform hover:-translate-y-1 duration-300 p-5 sm:p-6 md:p-8"
            >
              {/* Circular Image */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center rounded-full overflow-hidden border-4 border-white shadow-md mb-4 sm:mb-6">
                <img
                  src={provider.image}
                  alt={provider.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">
                {provider.title}
              </h3>

              {/* Description */}
              <p className="text-sm sm:text-base text-gray-600 text-center leading-relaxed">
                {provider.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VerifiedProviders;
