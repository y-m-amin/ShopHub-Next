
import React from 'react';
import { ShoppingBag, Twitter, Github, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 py-12 px-4 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <ShoppingBag className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold dark:text-white">NEXUS</span>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            The premium marketplace for digital-native items and hardware. Built for builders, by builders.
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4 dark:text-white">Product</h4>
          <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li><a href="#" className="hover:text-primary-600 transition-colors">Features</a></li>
            <li><a href="#" className="hover:text-primary-600 transition-colors">Integrations</a></li>
            <li><a href="#" className="hover:text-primary-600 transition-colors">Pricing</a></li>
            <li><a href="#" className="hover:text-primary-600 transition-colors">Changelog</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 dark:text-white">Support</h4>
          <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li><a href="#" className="hover:text-primary-600 transition-colors">Documentation</a></li>
            <li><a href="#" className="hover:text-primary-600 transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-primary-600 transition-colors">Guides</a></li>
            <li><a href="#" className="hover:text-primary-600 transition-colors">Status</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 dark:text-white">Stay Connected</h4>
          <div className="flex space-x-4 mb-4">
            <a href="#" className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:text-primary-600 transition-colors dark:text-zinc-400">
              <Twitter size={18} />
            </a>
            <a href="#" className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:text-primary-600 transition-colors dark:text-zinc-400">
              <Github size={18} />
            </a>
            <a href="#" className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:text-primary-600 transition-colors dark:text-zinc-400">
              <Linkedin size={18} />
            </a>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            © 2024 Nexus Marketplace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
