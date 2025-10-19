import { useState, useEffect, useRef } from 'react';

export default function Counters() {
  const [counters, setCounters] = useState([
    { value: 0, target: 2589, suffix: '', label: 'Happy Clients', icon: '/assets/images/icons/sm-user-icon.png' },
    { value: 0, target: 589, suffix: 'K', label: 'Projects Done', icon: '/assets/images/icons/sm-gear-icon.png' },
    { value: 0, target: 3461, suffix: '', label: 'Cup of coffee', icon: '/assets/images/icons/sm-coffee-icon.png' },
  ]);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounters();
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCounters = () => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    counters.forEach((counter, index) => {
      let current = 0;
      const increment = counter.target / steps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= counter.target) {
          current = counter.target;
          clearInterval(timer);
        }

        setCounters((prev) => {
          const newCounters = [...prev];
          newCounters[index] = { ...newCounters[index], value: Math.floor(current) };
          return newCounters;
        });
      }, interval);
    });
  };

  return (
    <div ref={sectionRef} className="py-20 bg-white">
      <div className="container mx-auto px-3">
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {counters.map((counter, index) => (
            <div key={index} className="flex items-center gap-6 justify-center md:justify-start">
              <div className="flex-shrink-0">
                <img
                  src={counter.icon}
                  alt={counter.label}
                  className="w-16 h-16 object-contain"
                />
              </div>
              <div>
                <h2 className="text-5xl md:text-6xl font-['Teko'] font-medium text-[#d4af37] mb-1">
                  {counter.value.toLocaleString()}{counter.suffix}
                </h2>
                <span className="text-gray-600 text-sm uppercase tracking-wider">
                  {counter.label}
                </span>
              </div>
            </div>
          ))}
          
          {/* Separators */}
          <div className="hidden md:block absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-px h-20 bg-gray-300"></div>
          <div className="hidden md:block absolute top-1/2 left-2/3 transform -translate-x-1/2 -translate-y-1/2 w-px h-20 bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
}