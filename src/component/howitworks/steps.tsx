const HowItWorks = () => {
  const steps = [
    {
      icon: "🔍",
      step: "Step 1",
      title: "Search & Browse",
      description:
        "Enter your city and browse through verified service providers, event packages, and individual services. Compare prices, ratings, and reviews.",
      points: [
        "Complete event packages",
        "Individual services (Pandit, Musicians, etc.)",
        "Verified provider profiles",
        "Real customer reviews",
      ],
      color: "var(--color-primary)", // primary color
    },
    {
      icon: "📞",
      step: "Step 2",
      title: "Connect & Discuss",
      description:
        "Contact providers directly through our platform. Discuss your requirements, get custom quotes, and clarify all details before booking.",
      points: [
        "Share event details & requirements",
        "Get personalized quotes",
        "Ask about availability",
        "Clarify terms & conditions",
      ],
      color: "#BFA65A", // dark gold
    },
    {
      icon: "🎉",
      step: "Step 3",
      title: "Book & Enjoy",
      description:
        "Confirm your booking with the provider. Enjoy a seamless, authentic Jain event experience with professional service.",
      points: [
        "Receive booking confirmation",
        "Get event timeline & checklist",
        "Direct coordination with provider",
        "Post-event review & rating",
      ],
      color: "#E1C97F", // light gold
    },
  ];

  return (
    <section className="py-20 px-6 md:px-12 lg:px-20 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">
          How It Works
        </h2>
        <p className="text-gray-600 text-lg md:text-xl mt-4">
          Simple steps to book authentic Jain event services. From search to
          celebration — we make it easy.
        </p>
      </div>

      {/* Steps */}
      <div className="relative flex flex-col md:flex-row md:justify-between gap-16">
        {/* Gradient lines */}
        <div
          className="hidden md:block absolute top-10 left-[12%] right-[12%] h-0.5 z-0"
          style={{
            background: `linear-gradient(
              to right,
              ${steps[0].color} 0%,
              ${steps[0].color} 50%,
              ${steps[1].color} 50%,
              ${steps[1].color} 100%
            )`,
          }}
        ></div>
        <div
          className="hidden md:block absolute top-10 left-[50%] right-[12%] h-0.5 z-0"
          style={{
            background: `linear-gradient(
              to right,
              ${steps[1].color} 0%,
              ${steps[1].color} 50%,
              ${steps[2].color} 50%,
              ${steps[2].color} 100%
            )`,
          }}
        ></div>

        {steps.map((step, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center text-center md:w-1/3 relative z-10"
          >
            {/* Circle */}
            <div
              className="w-20 h-20 flex items-center justify-center rounded-full text-white text-3xl font-bold shadow-md relative"
              style={{ backgroundColor: step.color }}
            >
              {step.icon}
            </div>

            {/* Step Badge */}
            <div
              className="mt-4 px-6 py-1.5 rounded-md font-semibold"
              style={{
                backgroundColor: `${step.color}20`, // lighter bg
                color: step.color,
              }}
            >
              {step.step}
            </div>

            {/* Title */}
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mt-3">
              {step.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-base mt-3">{step.description}</p>

            {/* Points Box - light gray and center aligned */}
            <div className="bg-gray-100 mt-5 p-4 rounded-lg w-full max-w-xs md:max-w-sm text-center text-gray-700 text-sm">
              {step.points.map((point, i) => (
                <p key={i} className="mb-1">
                  • {point}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
