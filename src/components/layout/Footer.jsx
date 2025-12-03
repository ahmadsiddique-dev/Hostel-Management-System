import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-200 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Hostel<span className="text-blue-500">AI</span></h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Revolutionizing hostel management with AI-driven solutions. Smart, secure, and seamless living for students.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Home</a></li>
              <li><a href="#features" className="hover:text-blue-400 transition-colors">Features</a></li>
              <li><a href="#rooms" className="hover:text-blue-400 transition-colors">Rooms</a></li>
              <li><a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2"><Mail size={16} /> support@hostelai.com</li>
              <li className="flex items-center gap-2"><Phone size={16} /> +1 (555) 123-4567</li>
              <li className="flex items-center gap-2"><MapPin size={16} /> 123 University Ave, Tech City</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Newsletter</h4>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm w-full focus:outline-none focus:border-blue-500"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">© 2025 HostelAI. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="text-slate-400 hover:text-white transition-colors"><Facebook size={18} /></a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors"><Twitter size={18} /></a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors"><Instagram size={18} /></a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors"><Linkedin size={18} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
