import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const StatsSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".stat-item", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { number: "99.9", suffix: "%", label: "Uptime" },
    { number: "500", suffix: "+", label: "Active Hostels" },
    { number: "50", suffix: "K+", label: "Students" },
    { number: "24", suffix: "/7", label: "Support" },
  ];

  return (
    <section ref={sectionRef} className="py-20 relative px-4 sm:px-6 bg-gradient-to-b from-black via-zinc-950/50 to-black">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="stat-item text-center">
              <div className="text-5xl font-bold mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  {stat.number}
                </span>
                <span className="text-indigo-400">{stat.suffix}</span>
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

