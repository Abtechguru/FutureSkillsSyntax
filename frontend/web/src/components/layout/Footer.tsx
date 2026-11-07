import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Heart, Sparkles } from 'lucide-react'

const Footer: React.FC = () => (
  <footer className="bg-[#101d2b] py-14 text-[#d3deea] sm:py-16">
    <div className="container-custom">
      <div className="grid gap-12 md:grid-cols-[1.25fr_1fr_1fr] md:gap-10">
        <div className="max-w-sm">
          <Link to="/" aria-label="Future Syntax home" className="inline-flex items-center gap-3 text-white">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#4e56ca]">
              <Sparkles className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="text-2xl font-extrabold tracking-[-0.05em]">Future Syntax<span className="text-[#f5bd72]">.</span></span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-7 text-[#a9bac8]">
            Creating room for boys to learn, belong and become more than they imagined.
          </p>
          <p className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#f5bd72]">
            <Heart className="h-4 w-4" aria-hidden="true" /> Built with purpose
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold tracking-wide text-white">Explore</h2>
          <nav aria-label="Footer programme links" className="mt-5 flex flex-col items-start gap-4 text-sm text-[#b6c5d1]">
            <Link to="/" className="transition hover:text-white">Home</Link>
            <a href="/#programme" className="transition hover:text-white">The programme</a>
            <a href="/#story" className="transition hover:text-white">Our story</a>
            <a href="/#approach" className="transition hover:text-white">How we work</a>
          </nav>
        </div>

        <div>
          <h2 className="text-sm font-bold tracking-wide text-white">Get involved</h2>
          <nav aria-label="Footer account links" className="mt-5 flex flex-col items-start gap-4 text-sm text-[#b6c5d1]">
            <Link to="/register" className="inline-flex items-center gap-1.5 transition hover:text-white">Adult registration <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
            <Link to="/login" className="transition hover:text-white">Sign in</Link>
            <a href="/#safeguarding" className="transition hover:text-white">Safeguarding</a>
          </nav>
          <p className="mt-5 max-w-xs text-xs leading-6 text-[#91a5b5]">
            Guardian consent and programme approval are required before a child participates.
          </p>
        </div>
      </div>

      <div className="mt-14 flex flex-col gap-3 border-t border-white/15 pt-6 text-xs leading-6 text-[#91a5b5] sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Future Syntax. All rights reserved.</span>
        <span>A community mentorship and digital-skills initiative · MCN 2026</span>
      </div>
    </div>
  </footer>
)

export default Footer
