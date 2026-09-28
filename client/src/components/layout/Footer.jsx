import { Link } from 'react-router-dom'
import { Compass, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-emerald-100 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand info */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800 text-sm tracking-tight">CLUBVERSE</span>
            <span className="text-slate-300">|</span>
            <p className="text-xs text-slate-500">
              College Club Event Management Platform
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <Link to="/" className="hover:text-emerald-600 transition-colors">
              Home
            </Link>
            <Link to="/events" className="hover:text-emerald-600 transition-colors">
              Browse Events
            </Link>
            <Link to="/admin/login" className="hover:text-emerald-600 transition-colors">
              Admin Gateway
            </Link>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <p>© 2026 CLUBVERSE. Designed for campus student organizations.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-emerald-500 fill-emerald-500" /> for campus life
          </p>
        </div>
      </div>
    </footer>
  )
}
