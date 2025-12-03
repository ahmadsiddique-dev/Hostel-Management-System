import React, { useEffect, useRef } from 'react';
import { TrendingUp, Home, Globe } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FeaturesSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
        x: -50,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out"
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);


  const features = [
    {
      icon: TrendingUp,
      title: "Revenue Optimization",
      description: "Dynamic pricing based on demand, season, and market trends. Maximize occupancy while maintaining competitive rates.",
      color: "emerald"
    },
    {
      icon: Home,
      title: "Maintenance Management",
      description: "Track issues, assign tasks, and monitor completion. Keep your facility in perfect condition with minimal effort.",
      color: "blue"
    },
    {
      icon: Globe,
      title: "Multi-Branch Support",
      description: "Manage unlimited locations from one dashboard. Centralized control with local customization.",
      color: "purple"
    }
  ];

  return (
    <section ref={sectionRef} className="py-32 bg-zinc-950 relative px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
          {features.map((feature, i) => (
            <div key={i} className="feature-card flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 items-start group">
              <div className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-${feature.color}-500/10 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform border border-${feature.color}-500/20`}>
                <feature.icon className={`w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-${feature.color}-400`} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-base sm:text-lg leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
