
const WhyChooseUs = () => {
  const features = [
    {
      icon: '✓', // A simple checkmark
      title: 'All-Inclusive',
      description: 'Everything you need in one package - no hidden costs or surprises',
      bgColor: 'bg-green-100', // A light green
      textColor: 'text-green-600' // A darker green for the icon
    },
    {
      icon: '🤝', // A handshake for expert team
      title: 'Expert Team',
      description: 'Verified professionals who understand Jain traditions and customs',
      bgColor: 'bg-yellow-100', // A light yellow/orange
      textColor: 'text-yellow-600' // A darker yellow/orange for the icon
    },
    {
      icon: '⭐', // Star for quality
      title: 'Quality Assured',
      description: 'High standards maintained across all services and providers',
      bgColor: 'bg-indigo-100', // A light indigo/blue
      textColor: 'text-indigo-600' // A darker indigo/blue for the icon
    },
    {
      icon: '⏱️', // Timer for time saving
      title: 'Time Saving',
      description: 'No need to coordinate multiple vendors - we handle everything',
      bgColor: 'bg-teal-100', // A light teal
      textColor: 'text-teal-600' // A darker teal for the icon
    },
  ];

  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 bg-white text-center">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-2">Why Choose Our Event Packages?</h2>
        <p className="text-lg text-gray-600 mb-12">
          Complete solutions that take care of every detail for your special occasions
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center p-6 bg-white rounded-lg">
              <div className={`w-16 h-16 flex items-center justify-center rounded-full ${feature.bgColor} ${feature.textColor} text-3xl mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-center text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;