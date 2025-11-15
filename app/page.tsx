'use client';
import { useState, useEffect } from 'react';
import './login-form.css';
import ProfileDropdown from './components/ProfileDropdown';

export default function Home() {
  const [activeNav, setActiveNav] = useState('home');
  const [indicatorStyle, setIndicatorStyle] = useState({ left: '0px', width: '40px' });

  const updateIndicator = (navItem: string, element: HTMLButtonElement) => {
    const rect = element.getBoundingClientRect();
    const navRect = element.closest('nav')?.getBoundingClientRect();
    if (navRect) {
      const left = rect.left - navRect.left;
      const width = rect.width;
      setIndicatorStyle({ left: `${left}px`, width: `${width}px` });
    }
  };

  const handleNavClick = (navItem: string, event: React.MouseEvent<HTMLButtonElement>) => {
    setActiveNav(navItem);
    updateIndicator(navItem, event.currentTarget);
  };

  useEffect(() => {
    // Initialize indicator position for Home button on page load
    const homeButton = document.querySelector('button[data-nav="home"]') as HTMLButtonElement;
    if (homeButton) {
      updateIndicator('home', homeButton);
    }
  }, []);
  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Header / Navigation */}
      <header className="relative z-40 px-8 py-6">
        {/* Sunlight Glow */}
        <div className="sunlight-glow absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-32 pointer-events-none z-0"></div>
        
        <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="IGTC Esports Logo"
              width="60"
              height="60"
              className="object-contain"
            />
            <div className="font-bold text-lg tracking-tight leading-tight">
              <div className="text-white">IGTC</div>
              <div className="text-sm font-light tracking-widest">ESPORTS</div>
            </div>
          </div>

          {/* Navigation Bar */}
          <nav className="nav-glow hidden md:flex items-center gap-8 px-10 py-4 rounded-full relative">
            {/* Navbar Background Glow */}
            <div className="navbar-bg-glow absolute inset-0 rounded-full"></div>
            {/* Active Indicator */}
            <div className="nav-indicator absolute bottom-0 h-0.5 bg-orange-400 transition-all duration-300 ease-in-out" style={indicatorStyle}></div>
            <button onClick={(e) => handleNavClick('home', e)} data-nav="home" className={`nav-item text-sm hover:text-orange-400 transition-colors ${activeNav === 'home' ? 'text-orange-400' : ''}`}>
              Home
            </button>
            <button onClick={(e) => handleNavClick('about', e)} className={`nav-item text-sm hover:text-orange-400 transition-colors ${activeNav === 'about' ? 'text-orange-400' : ''}`}>
              About Us
            </button>
            <button onClick={(e) => handleNavClick('esports', e)} data-nav="esports" className={`nav-item text-sm hover:text-orange-400 transition-colors ${activeNav === 'esports' ? 'text-orange-400' : ''}`}>
              Esports
            </button>
            <button onClick={(e) => handleNavClick('teams', e)} data-nav="teams" className={`nav-item text-sm hover:text-orange-400 transition-colors ${activeNav === 'teams' ? 'text-orange-400' : ''}`}>
              Teams
            </button>
            <button onClick={(e) => handleNavClick('games', e)} className={`nav-item text-sm hover:text-orange-400 transition-colors ${activeNav === 'games' ? 'text-orange-400' : ''}`}>
              Games
            </button>
            <button onClick={(e) => handleNavClick('rankings', e)} className={`nav-item text-sm hover:text-orange-400 transition-colors ${activeNav === 'rankings' ? 'text-orange-400' : ''}`}>
              Rankings
            </button>
          </nav>

          {/* Profile Dropdown */}
          <ProfileDropdown />
        </div>
      </header>

      {/* Full-site sparkles layer (covers all black background areas) */}
      <div className="sparkles-site pointer-events-none" aria-hidden="true">
        {Array.from({ length: 36 }).map((_, i) => (
          <span key={i} className={`sparkle site-s${i + 1}`} />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative flex items-start justify-center px-8 py-2 min-h-screen overflow-hidden">
        {/* Content */}
        <div className="max-w-5xl mx-auto text-center relative z-10 mt-16">
          <h1 className="home-title">
            Indo Gamers Territory<br/>
            Conquers
          </h1>
          
          {/* Hero Background */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="bg-layer g1"></div>
            <div className="bg-layer g2"></div>
          </div>

          {/* Sparkles layer positioned above background but beneath text (z-5)
              Constrained to the top area so sparkles appear under the title/curve/paragraph */}
          <div className="sparkles sparkles-hero z-5 pointer-events-none" aria-hidden="true">
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} className={`sparkle s${i + 1}`} />
            ))}
          </div>
          
          <p className="hero-desc max-w-4xl mx-auto lowercase relative z-10">
            we're not just building a gaming community, we're creating a movement.<br/>
            a movement where colleges unite, players compete, and champions rise.
          </p>
          
          {/* Curved Connection Line */}
          <div className="curved-line-container mt-8">
            <svg width="100%" height="120" viewBox="0 0 1000 120" className="curved-line">
              <defs>
                <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="white" stopOpacity="0" />
                  <stop offset="20%" stopColor="white" stopOpacity="0.8" />
                  <stop offset="80%" stopColor="white" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 5 Q500 118 1000 5" stroke="url(#curveGradient)" strokeWidth="3" fill="none" className="glowing-curve" />
            </svg>
          </div>



          {/* About Section */}
          <div className="mt-8 max-w-7xl mx-auto">
            <h2 className="about-title text-center mb-6">About The IGTC</h2>
            
            <div className="chip-container relative flex justify-center items-center">
              <svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-4xl">
                <defs>
                  <linearGradient id="chipGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2d2d2d" />
                    <stop offset="100%" stopColor="#0f0f0f" />
                  </linearGradient>
                  <linearGradient id="textGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#eeeeee" />
                    <stop offset="100%" stopColor="#888888" />
                  </linearGradient>
                  <linearGradient id="pinGradient" x1="1" y1="0" x2="0" y2="0">
                    <stop offset="0%" stopColor="#bbbbbb" />
                    <stop offset="50%" stopColor="#888888" />
                    <stop offset="100%" stopColor="#555555" />
                  </linearGradient>
                  <filter id="chipGlow">
                    <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                <g id="traces">
                  <path d="M100 100 H200 V210 H326" className="trace-bg" />
                  <path d="M100 100 H200 V210 H326" className="trace-flow" style={{stroke: 'rgba(255,255,255,0.9)', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.8))'}} />
                  <path d="M80 180 H180 V230 H326" className="trace-bg" />
                  <path d="M80 180 H180 V230 H326" className="trace-flow" style={{stroke: 'rgba(255,255,255,0.9)', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.8))'}} />
                  <path d="M60 260 H150 V250 H326" className="trace-bg" />
                  <path d="M60 260 H150 V250 H326" className="trace-flow" style={{stroke: 'rgba(255,255,255,0.9)', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.8))'}} />
                  <path d="M100 350 H200 V270 H326" className="trace-bg" />
                  <path d="M100 350 H200 V270 H326" className="trace-flow" style={{stroke: 'rgba(255,255,255,0.9)', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.8))'}} />
                  <path d="M700 90 H560 V210 H474" className="trace-bg" />
                  <path d="M700 90 H560 V210 H474" className="trace-flow" style={{stroke: 'rgba(255,255,255,0.9)', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.8))'}} />
                  <path d="M740 160 H580 V230 H474" className="trace-bg" />
                  <path d="M740 160 H580 V230 H474" className="trace-flow" style={{stroke: 'rgba(255,255,255,0.9)', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.8))'}} />
                  <path d="M720 250 H590 V250 H474" className="trace-bg" />
                  <path d="M720 250 H590 V250 H474" className="trace-flow" style={{stroke: 'rgba(255,255,255,0.9)', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.8))'}} />
                  <path d="M680 340 H570 V270 H474" className="trace-bg" />
                  <path d="M680 340 H570 V270 H474" className="trace-flow" style={{stroke: 'rgba(255,255,255,0.9)', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.8))'}} />
                </g>

                <rect x="320" y="180" width="160" height="120" rx="25" ry="25" fill="rgba(251,146,60,0.05)" stroke="none" filter="url(#chipGlow)" />
                <rect x="330" y="190" width="140" height="100" rx="20" ry="20" fill="rgba(251,146,60,0.1)" stroke="rgba(251,146,60,0.3)" strokeWidth="1" />

                <g>
                  <rect x="322" y="205" width="8" height="10" fill="url(#pinGradient)" rx="2" />
                  <rect x="322" y="225" width="8" height="10" fill="url(#pinGradient)" rx="2" />
                  <rect x="322" y="245" width="8" height="10" fill="url(#pinGradient)" rx="2" />
                  <rect x="322" y="265" width="8" height="10" fill="url(#pinGradient)" rx="2" />
                </g>

                <g>
                  <rect x="470" y="205" width="8" height="10" fill="url(#pinGradient)" rx="2" />
                  <rect x="470" y="225" width="8" height="10" fill="url(#pinGradient)" rx="2" />
                  <rect x="470" y="245" width="8" height="10" fill="url(#pinGradient)" rx="2" />
                  <rect x="470" y="265" width="8" height="10" fill="url(#pinGradient)" rx="2" />
                </g>

                <text x="400" y="240" fontFamily="Arial, sans-serif" fontSize="22" fill="url(#textGradient)" textAnchor="middle" alignmentBaseline="middle">
                  IGTC
                </text>

                <circle cx="100" cy="100" r="5" fill="black" />
                <circle cx="80" cy="180" r="5" fill="black" />
                <circle cx="60" cy="260" r="5" fill="black" />
                <circle cx="100" cy="350" r="5" fill="black" />
                <circle cx="700" cy="90" r="5" fill="black" />
                <circle cx="740" cy="160" r="5" fill="black" />
                <circle cx="720" cy="250" r="5" fill="black" />
                <circle cx="680" cy="340" r="5" fill="black" />
              </svg>
              {/* Additional sparkles for About section (subtle) */}
              <div className="sparkles sparkles-about pointer-events-none" aria-hidden="true">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span key={i} className={`sparkle about-s${i + 1}`} />
                ))}
              </div>
            </div>

            {/* Content Sections Positioned with Traces */}
            <div className="relative">
              {/* Left Side Content - Individual Lines */}
              <div className="absolute -left-36 -top-[29rem] text-white text-sm font-medium w-80">Revolutionary esports organization uniting gamers across India</div>
              <div className="absolute -left-40 -top-[23rem] text-white text-sm font-medium w-80">Creating platforms where passion meets competition and excellence</div>
              <div className="absolute -left-48 -top-[18rem] text-white text-sm font-medium w-80">Building communities where colleges unite and players compete</div>
              <div className="absolute -left-40 -top-[12rem] text-white text-sm font-medium w-80">Fostering environments where champions rise and dreams become reality</div>

              {/* Right Side Content - Individual Lines */}
              <div className="absolute -right-25 -top-[30rem] text-white text-sm font-medium w-80 text-right">Professional gaming tournaments and competitive esports events</div>
              <div className="absolute -right-49 -top-[25rem] text-white text-sm font-medium w-80 text-right">Elite competitions where legends are born and skills are tested</div>
              <div className="absolute -right-35 -top-[19rem] text-white text-sm font-medium w-80 text-right">High-energy atmosphere with adrenaline-pumping gaming action</div>
              <div className="absolute -right-23 -top-[12rem] text-white text-sm font-medium w-80 text-right">Community-driven platform connecting gamers nationwide</div>
            </div>
          </div>
        </div>

        {/* Eye Icon */}
        <div className="absolute bottom-16 right-8 z-20">
          <div className="w-14 h-14 rounded-full border border-white flex items-center justify-center hover:border-orange-400 hover:bg-orange-400/10 transition-all cursor-pointer group">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-white group-hover:text-orange-400 transition-colors fa-bounce"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </div>
        </div>
      </section>



      


    </div>
  )
}
