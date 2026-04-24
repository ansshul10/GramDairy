import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import newsletterService from '../../services/newsletterService'
import {
  Building2,
  MapPin,
  PhoneCall,
  Mail,
  ShieldCheck,
  Lock,
  Globe2,
  TerminalSquare,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Server,
  Zap,
  Twitter,
  Linkedin,
  Github,
  LifeBuoy,
  Gift
} from 'lucide-react'

/* ─────────────────────────────────────────────────────────────────────────────
 * ENTERPRISE FOOTER COMPONENT
 * A massive, robust "fat footer" engineered for corporate applications.
 * Includes dense navigation columns, security trust badges, newsletter 
 * capturing, and strict typographic hierarchy without any animation bounce.
 * ───────────────────────────────────────────────────────────────────────────── */

/**
 * Enterprise Trust Badge (Static Component for SVG layout)
 */
const TrustBadge = ({ title, desc, icon: Icon }) => (
  <div className="flex items-start gap-4 p-5 bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded shadow-sm">
    <div className="w-12 h-12 bg-gray-100 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded flex items-center justify-center flex-shrink-0 text-gray-500">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">{title}</h3>
      <p className="text-xs font-medium text-gray-500 leading-relaxed">{desc}</p>
    </div>
  </div>
);

/**
 * Newsletter Form Node
 */
const NewsletterNode = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');
    
    setLoading(true);
    try {
      await newsletterService.subscribe(email);
      toast.success('Thanks for subscribing! Check your email.');
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded p-8 sm:p-10 relative overflow-hidden">
      {/* Abstract background grid */}
      <div
        className="absolute inset-0 opacity-[0.05] dark:opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '16px 16px' }}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="max-w-xl">
          <h3 className="text-2xl font-bold tracking-tight mb-2">Subscribe to our Newsletter</h3>
          <p className="text-sm font-medium opacity-80 leading-relaxed">
            Stay updated with our latest products, special offers, and dairy news delivered straight to your inbox.
          </p>
        </div>

        <div className="flex-1 w-full max-w-md">
          <form className="flex flex-col sm:flex-row w-full gap-3 sm:gap-0" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Your Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 bg-white/10 dark:bg-black/10 border border-white/20 dark:border-black/20 rounded sm:rounded-r-none text-sm font-semibold placeholder:text-white/50 dark:placeholder:text-black/50 focus:outline-none focus:bg-white/20 dark:focus:bg-black/20 transition-colors"
              required
            />
            <button 
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-bold text-sm rounded sm:rounded-l-none shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              {loading ? 'Subscribing...' : 'Subscribe'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] uppercase tracking-widest mt-3 opacity-60 font-semibold inline-flex items-center gap-1.5">
            <Lock className="w-3 h-3" /> 256-bit Secure Transmission
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Main Footer Export
 */
export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-gray-800 font-['Inter',system-ui,sans-serif] pb-safe">

      {/* ──────────────────────────────────────────────────────────────────
       * SECTION 1: GLOBAL TRUST METRICS & BADGES
       * ────────────────────────────────────────────────────────────────── */}
      <div className="border-b border-gray-100 dark:border-gray-800/50 bg-gray-50 dark:bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <TrustBadge
              icon={ShieldCheck}
              title="Certified Quality"
              desc="We follow strict safety and quality standards for every dairy product."
            />
            <TrustBadge
              icon={Server}
              title="Reliable Delivery"
              desc="On-time delivery guaranteed through our efficient local network."
            />
            <TrustBadge
              icon={Zap}
              title="Freshness Guaranteed"
              desc="Milk delivered fresh from the farm to your doorstep within hours."
            />
            <TrustBadge
              icon={CheckCircle2}
              title="Direct From Farms"
              desc="All dairy products are sourced directly from verified local farms."
            />
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────
       * SECTION 2: NEWSLETTER SUBSCRIPTION
       * ────────────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-16 border-b border-gray-100 dark:border-gray-800/50">
        <NewsletterNode />
      </div>

      {/* ──────────────────────────────────────────────────────────────────
       * SECTION 3: MASSIVE DIRECTORY MATRIX
       * ────────────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">

          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-3 mb-6 inline-flex">
              <div className="w-10 h-10 bg-gray-900 dark:bg-white rounded flex items-center justify-center shadow-sm">
                <Building2 className="w-5 h-5 text-white dark:text-[#0a0a0a]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">GramDairy</span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Fresh & Healthy</span>
              </div>
            </Link>

            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed mb-8 max-w-sm">
              GramDairy is your trusted partner for fresh dairy products, delivered directly from local farms to your home with care and efficiency.
            </p>

            <div className="flex flex-col gap-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>Sector 45 Hub, UP</span>
              </div>
              <div className="flex items-center gap-3">
                <PhoneCall className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>+91 1800-DAIRY-HELP (Toll Free)</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>system.admin@gramdairy.com</span>
              </div>
            </div>
          </div>

          {/* Links Directory 1 */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6">Shop & Service</h4>
            <ul className="space-y-4">
              <li><Link to="/products" className="text-sm font-medium text-gray-500 hover:text-primary-600 dark:hover:text-primary-500 transition-colors">Our Products</Link></li>
              <li><Link to="/subscriptions" className="text-sm font-medium text-gray-500 hover:text-primary-600 dark:hover:text-primary-500 transition-colors">Subscriptions</Link></li>
              <li><Link to="/delivery/apply" className="text-sm font-medium text-gray-500 hover:text-primary-600 dark:hover:text-primary-500 transition-colors">Become a Partner</Link></li>
              <li><a href="#" className="text-sm font-medium text-gray-500 hover:text-primary-600 dark:hover:text-primary-500 transition-colors flex items-center gap-1.5">Delivery Areas <Globe2 className="w-3 h-3" /></a></li>
            </ul>
          </div>

          {/* Links Directory 2 */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6">About Us</h4>
            <ul className="space-y-4">
              <li><Link to="/our-story" className="text-sm font-medium text-gray-500 hover:text-primary-600 dark:hover:text-primary-500 transition-colors">Our Story</Link></li>
              <li><Link to="/our-farm" className="text-sm font-medium text-gray-500 hover:text-primary-600 dark:hover:text-primary-500 transition-colors">Our Farms</Link></li>
              <li><a href="#" className="text-sm font-medium text-gray-500 hover:text-primary-600 dark:hover:text-primary-500 transition-colors">Career Pathways</a></li>
              <li><a href="#" className="text-sm font-medium text-gray-500 hover:text-primary-600 dark:hover:text-primary-500 transition-colors">Press & Media</a></li>
              <li><a href="#" className="text-sm font-medium text-gray-500 hover:text-primary-600 dark:hover:text-primary-500 transition-colors">Environmental Impact</a></li>
            </ul>
          </div>

          {/* Links Directory 3 */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/refer-and-earn" className="text-sm font-medium text-emerald-500 hover:text-emerald-400 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors flex items-center gap-2">Refer & Earn <Gift className="w-3.5 h-3.5" /></Link></li>
              <li><Link to="/support" className="text-sm font-medium text-gray-500 hover:text-primary-600 dark:hover:text-primary-500 transition-colors flex items-center gap-2">Contact Support <LifeBuoy className="w-3.5 h-3.5" /></Link></li>
              <li><Link to="/work-with-us" className="text-sm font-medium text-gray-500 hover:text-primary-600 dark:hover:text-primary-500 transition-colors">Work with us</Link></li>
              <li><Link to="/system-status" className="text-sm font-medium text-gray-500 hover:text-primary-600 dark:hover:text-primary-500 transition-colors flex items-center gap-2">System Status <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span></Link></li>
              <li><Link to="/privacy-policy" className="text-sm font-medium text-gray-500 hover:text-primary-600 dark:hover:text-primary-500 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────
       * SECTION 4: LOWER CORPORATE LEGAL BAR
       * ────────────────────────────────────────────────────────────────── */}
      <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#111111]">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-xs font-medium text-gray-500">
              Copyright &copy; {new Date().getFullYear()} GramDairy Technologies Inc.
            </p>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest hidden sm:block">
              All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs font-semibold text-gray-600 dark:text-gray-400">
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Specification</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Cookie Data Handling</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">ISO Certifications</a>
          </div>

          {/* Social Nodes */}
          <div className="flex items-center gap-4">
            <a href="#" className="w-8 h-8 rounded bg-gray-200 dark:bg-[#0a0a0a] border border-gray-300 dark:border-gray-800 flex items-center justify-center text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded bg-gray-200 dark:bg-[#0a0a0a] border border-gray-300 dark:border-gray-800 flex items-center justify-center text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded bg-gray-200 dark:bg-[#0a0a0a] border border-gray-300 dark:border-gray-800 flex items-center justify-center text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <Github className="w-4 h-4" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  )
}
