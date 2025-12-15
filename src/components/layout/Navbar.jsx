import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

const Navbar = () => {
  const handleScroll = (e, targetId) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      gsap.to(window, { duration: 1, scrollTo: target, ease: "power3.inOut" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10 supports-[backdrop-filter]:bg-black/20">
      <div className="container mx-auto px-6 h-20 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-tighter flex items-center gap-2 text-white">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">G</div>
          <span>Gravity<span className="text-indigo-400">Hostel</span></span>
        </Link>
        
        {/* <div className="hidden md:flex items-center space-x-8">
          <a href="#features" onClick={(e) => handleScroll(e, '#features')} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Features</a>
          <a href="#rooms" onClick={(e) => handleScroll(e, '#rooms')} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Rooms</a>
          <a href="#testimonials" onClick={(e) => handleScroll(e, '#testimonials')} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Testimonials</a>
        </div> */}

        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button className="bg-white text-black hover:bg-gray-200 font-medium shadow-lg shadow-white/10 transition-all hover:scale-105">Student Login</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
