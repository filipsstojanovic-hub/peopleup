'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const text3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current || !circleRef.current || !text1Ref.current || !text2Ref.current || !text3Ref.current) return;

    // Initialize Lenis smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    // Connect Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Animate the hole expanding on scroll with pin
    gsap.fromTo(
      circleRef.current,
      {
        '--hole-size': '100px', // Start with small hole
      },
      {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=100%', // Pin for one viewport height of scrolling
          scrub: 1,
          pin: true, // Pin the section until animation completes
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        '--hole-size': '150vmax', // Expand to cover entire screen
        ease: 'power2.inOut',
      }
    );

    // Create a master timeline for all text animations
    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: '+=100%',
        scrub: 1,
      }
    });

    // Text 1: 15-25% fade in, visible until 35%, fade out 35-40%
    masterTl.fromTo(text1Ref.current, { opacity: 0 }, { opacity: 1 }, 0.15)
      .to(text1Ref.current, { opacity: 1 }, 0.25)
      .to(text1Ref.current, { opacity: 0 }, 0.35);

    // Text 2: 55-65% fade in, visible until 75%, fade out 75-80%
    masterTl.fromTo(text2Ref.current, { opacity: 0 }, { opacity: 1 }, 0.55)
      .to(text2Ref.current, { opacity: 1 }, 0.65)
      .to(text2Ref.current, { opacity: 0 }, 0.75);

    // Text 3: 85-95% fade in, stays visible until 100%
    masterTl.fromTo(text3Ref.current, { opacity: 0 }, { opacity: 1 }, 0.85)
      .to(text3Ref.current, { opacity: 1 }, 0.95);

    return () => {
      // Proper cleanup
      ScrollTrigger.getAll().forEach((trigger) => {
        trigger.kill(true);
      });
      lenis.destroy();
    };
  }, []);

  return (
    <main>
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="text-xl sm:text-2xl font-bold text-black">
              PeopleUp
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#about" className="text-base font-medium text-gray-700 hover:text-blue-500 transition-colors">
                About
              </a>
              <a href="#services" className="text-base font-medium text-gray-700 hover:text-blue-500 transition-colors">
                Services
              </a>
              <a href="#team" className="text-base font-medium text-gray-700 hover:text-blue-500 transition-colors">
                Team
              </a>
              <a href="#contact" className="text-base font-medium text-gray-700 hover:text-blue-500 transition-colors">
                Contact
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with 3-Layer Background */}
      <section
        ref={heroRef}
        className="relative min-h-screen overflow-hidden"
      >
        {/* Layer 1 - Black Background (Bottom) */}
        <div className="absolute inset-0 bg-black z-[1]">
          {/* Text 1: Fades in at 15-25%, out at 35-40% */}
          <div
            ref={text1Ref}
            className="absolute bottom-8 right-8 sm:bottom-12 sm:right-12 md:bottom-16 md:right-16 text-white opacity-0"
          >
            <p className="text-lg sm:text-xl md:text-2xl font-medium">
              Discover
            </p>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2">
              Your Potential
            </p>
          </div>

          {/* Text 2: Fades in at 55-65%, out at 75-80% */}
          <div
            ref={text2Ref}
            className="absolute bottom-8 right-8 sm:bottom-12 sm:right-12 md:bottom-16 md:right-16 text-white opacity-0"
          >
            <p className="text-lg sm:text-xl md:text-2xl font-medium">
              Elevate
            </p>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2">
              Your Career
            </p>
          </div>

          {/* Text 3: Fades in at 85-95%, stays visible */}
          <div
            ref={text3Ref}
            className="absolute bottom-8 right-8 sm:bottom-12 sm:right-12 md:bottom-16 md:right-16 text-white opacity-0"
          >
            <p className="text-lg sm:text-xl md:text-2xl font-medium">
              Welcome to
            </p>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2">
              PeopleUp
            </p>
          </div>
        </div>

        {/* Layer 2 - White Background with Expanding Hole (Middle) */}
        <div className="absolute inset-0 z-[2]">
          <div
            ref={circleRef}
            className="absolute inset-0 bg-white"
            style={{
              maskImage: 'radial-gradient(circle at center, transparent var(--hole-size, 100px), black calc(var(--hole-size, 100px) + 1px))',
              WebkitMaskImage: 'radial-gradient(circle at center, transparent var(--hole-size, 100px), black calc(var(--hole-size, 100px) + 1px))',
              '--hole-size': '100px',
            } as React.CSSProperties}
          />
        </div>

        {/* Layer 3 - Transparent with Blue Text (Top) */}
        <div className="absolute inset-0 z-[3] flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-blue-500 mb-4 sm:mb-6">
              PeopleUp
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-400 max-w-md sm:max-w-xl mx-auto">
              Empowering people, elevating careers
            </p>
          </div>
        </div>
      </section>

      {/* New Section Below Hero */}
      <section className="relative min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black mb-6">
              Nova Sekcija
            </h2>
            <p className="text-lg sm:text-xl text-gray-700">
              Sadržaj nove sekcije ide ovde...
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
