import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="text-3xl font-bold text-red-500">
              CineRec
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Your ultimate destination for movie and TV series ratings, reviews, and personalized recommendations. 
              Discover your next favorite watch.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/movies" className="text-gray-400 hover:text-white transition-colors">
                  Movies
                </Link>
              </li>
              <li>
                <Link href="/series" className="text-gray-400 hover:text-white transition-colors">
                  TV Series
                </Link>
              </li>
              <li>
                <Link href="/top-rated" className="text-gray-400 hover:text-white transition-colors">
                  Top Rated
                </Link>
              </li>
              <li>
                <Link href="/new-releases" className="text-gray-400 hover:text-white transition-colors">
                  New Releases
                </Link>
              </li>
              <li>
                <Link href="/watchlist" className="text-gray-400 hover:text-white transition-colors">
                  My Watchlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/genre/action" className="text-gray-400 hover:text-white transition-colors">
                  Action
                </Link>
              </li>
              <li>
                <Link href="/genre/comedy" className="text-gray-400 hover:text-white transition-colors">
                  Comedy
                </Link>
              </li>
              <li>
                <Link href="/genre/drama" className="text-gray-400 hover:text-white transition-colors">
                  Drama
                </Link>
              </li>
              <li>
                <Link href="/genre/horror" className="text-gray-400 hover:text-white transition-colors">
                  Horror
                </Link>
              </li>
              <li>
                <Link href="/genre/sci-fi" className="text-gray-400 hover:text-white transition-colors">
                  Sci-Fi
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Support</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail className="h-4 w-4" />
                <span>support@cinerec.com</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-3 text-gray-400">
                <MapPin className="h-4 w-4 mt-1" />
                <span>123 Cinema Street<br />Hollywood, CA 90028</span>
              </li>
            </ul>
            <div className="space-y-2">
              <Link href="/help" className="block text-gray-400 hover:text-white transition-colors">
                Help Center
              </Link>
              <Link href="/contact" className="block text-gray-400 hover:text-white transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 CineRec. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}