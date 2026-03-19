const WhyOurProvidersAreTrusted = () => {
  const trustPoints = [
    {
      icon: '✔️',
      title: 'Verified Profiles',
      description: 'All providers undergo thorough verification including background checks and credential validation.',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      icon: '🌟',
      title: 'Rated by Community',
      description: 'Real reviews and ratings from families who have used their services for events.',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600'
    },
    {
      icon: '🏆',
      title: 'Quality Assured',
      description: 'Continuous monitoring and feedback collection to maintain service quality standards.',
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-600'
    },
  ];

  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 bg-gray-50 text-center">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-2">
          Why Our Providers Are Trusted
        </h2>
        <p className="text-lg text-gray-600 mb-12">
          We maintain high standards to ensure you get the best service
        </p>

        {/* Trust Points Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {trustPoints.map((point, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 duration-300 p-6 sm:p-8"
            >
              {/* Icon Circle */}
              <div className={`w-16 h-16 flex items-center justify-center rounded-full ${point.bgColor} ${point.textColor} text-3xl mb-4`}>
                {point.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {point.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-center text-sm sm:text-base leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyOurProvidersAreTrusted;
