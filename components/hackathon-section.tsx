"use client"

import { useEffect, useState } from "react"

export default function HackathonSection() {
  const [glitch, setGlitch] = useState(false)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 50)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      setGlitch(true)
      setTimeout(() => setGlitch(false), 180)
    }, 2800)
    return () => clearInterval(id)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Bebas+Neue&display=swap');

        .hack-root {
          font-family: 'Space Mono', monospace;
          background: transparent;
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 5vw 6vw;
        }

        .hack-inner {
          width: 100%;
        }

        .glitch-title {
          font-family: 'Bebas Neue', sans-serif;
          position: relative;
          letter-spacing: 0.02em;
          display: block;
        }

        .glitch-title::before,
        .glitch-title::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          font-family: 'Bebas Neue', sans-serif;
        }

        .glitch-active .glitch-title::before {
          color: #a855f7;
          animation: glitch-a 0.18s steps(2) forwards;
          clip-path: polygon(0 15%, 100% 15%, 100% 45%, 0 45%);
          opacity: 0.7;
        }

        .glitch-active .glitch-title::after {
          color: #fff;
          animation: glitch-b 0.18s steps(3) forwards;
          clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%);
          opacity: 0.4;
        }

        @keyframes glitch-a {
          0%   { transform: translate(-4px, 2px) skewX(-2deg); }
          33%  { transform: translate(4px, -1px) skewX(1deg); }
          66%  { transform: translate(-2px, 3px); }
          100% { transform: translate(0); }
        }

        @keyframes glitch-b {
          0%   { transform: translate(3px, -2px) skewX(1deg); }
          50%  { transform: translate(-3px, 1px) skewX(-2deg); }
          100% { transform: translate(0); }
        }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes reveal-bar {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        @keyframes flicker {
          0%, 95%, 100% { opacity: 1; }
          96% { opacity: 0.4; }
          97% { opacity: 1; }
          98% { opacity: 0.6; }
          99% { opacity: 1; }
        }

        @keyframes blink-cursor {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }

        .entered .anim-1 { animation: slide-up 0.5s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
        .entered .anim-2 { animation: slide-up 0.5s cubic-bezier(0.22,1,0.36,1) 0.15s both; }
        .entered .anim-3 { animation: slide-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.25s both; }
        .entered .anim-4 { animation: slide-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.35s both; }
        .entered .anim-5 { animation: slide-up 0.6s cubic-bezier(0.22,1,0.36,1) 0.45s both; }
        .entered .anim-bar { animation: reveal-bar 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s both; }

        .cursor-blink { animation: blink-cursor 1s step-end infinite; }

        .stat-card {
          position: relative;
          overflow: hidden;
        }
        .stat-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%);
          pointer-events: none;
        }

        .prize-number {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.03em;
        }

        .btn-primary {
          position: relative;
          overflow: hidden;
        }
        .btn-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transform: translateX(-100%);
          transition: transform 0.5s ease;
        }
        .btn-primary:hover::after { transform: translateX(100%); }

        .register-btn:hover .arrow-icon {
          transform: translateX(4px);
          transition: transform 0.2s ease;
        }

        .flicker-label { animation: flicker 6s ease-in-out infinite; }
        .tag-mono { font-family: 'Space Mono', monospace; }
      `}</style>

      <div
        className={`hack-root ${entered ? 'entered' : ''} ${glitch ? 'glitch-active' : ''}`}
        style={{ minHeight: '100vh', width: '100%' }}
      >
        <div className="hack-inner">

          {/* Accent bar — full width */}
          <div
            className="anim-bar"
            style={{
              height: '0px',
              width: '100%',
              background: 'linear-gradient(to right, #a855f7, rgba(255,255,255,0.4), transparent)',
              marginBottom: '2.5rem',
              transformOrigin: 'left',
            }}
          />

          {/* Top label row */}
          <div className="anim-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                className="flicker-label"
                style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a855f7', boxShadow: '0 0 8px rgba(168,85,247,0.6)' }}
              />
              <span className="tag-mono" style={{ fontSize: '10px', color: '#a855f7', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700 }}>
                Flagship Event
              </span>
            </div>
            <span className="tag-mono" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.52)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              RNSIT_2025
            </span>
          </div>

          {/* Title — full viewport width font size */}
          <div className="anim-2" style={{ marginBottom: '0.1rem' }}>
            <h2
              className="glitch-title"
              data-text="GRAND"
              style={{ fontSize: 'clamp(50px, 10vw, 100px)', fontWeight: 900, lineHeight: 0.92, color: '#fff' }}
            >
              GRAND
            </h2>
          </div>
          <div className="anim-2" style={{ marginBottom: '1rem' }}>
            <h2
              className="glitch-title"
              data-text="HACKATHON"
              style={{
                fontSize: 'clamp(50px, 10vw, 100px)', fontWeight: 900, lineHeight: 0.92,
                WebkitTextStroke: '1.5px rgba(255,255,255,0.55)', color: 'transparent',
              }}
            >
              HACKATHON
            </h2>
          </div>

          {/* Tagline */}
          <div className="anim-3" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span className="tag-mono" style={{ fontSize: '0.875rem', color: '#c084fc', fontStyle: 'italic', textShadow: '0 0 12px rgba(168,85,247,0.35)' }}>build. break. become.</span>
            <span className="cursor-blink tag-mono" style={{ color: 'rgba(255,255,255,0.4)' }}>_</span>
          </div>

          {/* Divider — full width */}
          <div className="anim-3" style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.18)', marginBottom: '1.5rem' }} />

          {/* Bottom section: stats + prize + CTAs in a horizontal layout */}
          <div className="anim-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 2fr auto', gap: '1px', background: 'rgba(255,255,255,0.16)', width: '100%', marginBottom: '1rem' }}>

            {/* Stat: Team Size */}
            <div className="stat-card" style={{ background: 'rgba(5,8,18,0.62)', padding: '1.5rem 1.25rem' }}>
              <p className="tag-mono" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.62)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.6rem' }}>Team Size</p>
              <p className="prize-number" style={{ fontSize: '2.5rem', color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>1</p>
              <p className="tag-mono" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.72)' }}>member</p>
            </div>

            {/* Stat: Duration */}
            <div className="stat-card" style={{ background: 'rgba(5,8,18,0.62)', padding: '1.5rem 1.25rem' }}>
              <p className="tag-mono" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.62)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.6rem' }}>Duration</p>
              <p className="prize-number" style={{ fontSize: '2.5rem', color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>24</p>
              <p className="tag-mono" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.72)' }}>hours</p>
            </div>

            {/* Stat: Mode */}
            <div className="stat-card" style={{ background: 'rgba(5,8,18,0.62)', padding: '1.5rem 1.25rem' }}>
              <p className="tag-mono" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.62)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.6rem' }}>Mode</p>
              <p className="prize-number" style={{ fontSize: '2.5rem', color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>LIVE</p>
              <p className="tag-mono" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.72)' }}>in-person</p>
            </div>

            {/* Prize pool */}
            <div
              style={{
                position: 'relative',
                padding: '1.5rem 1.25rem',
                background: 'linear-gradient(135deg, rgba(168,85,247,0.16) 0%, rgba(8,10,20,0.72) 70%)',
                overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, width: '48px', height: '1px', background: 'rgba(168,85,247,0.6)' }} />
              <div style={{ position: 'absolute', top: 0, left: 0, width: '1px', height: '48px', background: 'rgba(168,85,247,0.6)' }} />
              <p className="tag-mono" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.68)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>Total Prize Pool</p>
              <p className="prize-number" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: '#a855f7', textShadow: '0 0 30px rgba(168,85,247,0.25)', lineHeight: 1 }}>
                ₹1,20,000
              </p>
              <p className="tag-mono" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.62)', marginTop: '0.5rem' }}>Winner takes ₹50,000</p>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'transparent' }}>
              <a
                href="/register"
                className="register-btn btn-primary"
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '0.5rem', padding: '0 2rem',
                  background: '#fff', color: '#000',
                  fontFamily: "'Space Mono', monospace", fontSize: '11px', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.15em',
                  textDecoration: 'none', transition: 'background 0.2s', whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#a855f7')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#fff')}
              >
                <span>Register Now</span>
                <span className="arrow-icon" style={{ display: 'inline-block', transition: 'transform 0.2s' }}>→</span>
              </a>
              <a
                href="/events"
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 2rem',
                  background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.9)',
                  fontFamily: "'Space Mono', monospace", fontSize: '11px',
                  textTransform: 'uppercase', letterSpacing: '0.15em',
                  textDecoration: 'none', transition: 'color 0.2s, background 0.2s', whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.9)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)'; }}
              >
                Details
              </a>
            </div>
          </div>

          {/* Bottom system readout */}
          <div className="anim-5" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="tag-mono" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.48)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              SYS::RNSIT.EDU
            </span>
            <span className="tag-mono" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.48)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              REG_OPEN
            </span>
          </div>

        </div>
      </div>
    </>
  )
}