'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import Image from 'next/image';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Custom hook for lazy loading background images
function useLazyBackground(imageUrl: string) {
  const [loaded, setLoaded] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current || !imageUrl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loaded) {
            setCurrentUrl(imageUrl);
            setLoaded(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '50px' } // Start loading 50px before element is visible
    );

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [imageUrl, loaded]);

  return { elementRef, currentUrl, loaded };
}

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const circle2Ref = useRef<HTMLDivElement>(null); // Layer 2 - white circle
  const circle3Ref = useRef<HTMLDivElement>(null); // Layer 3 - red circle (bigger)
  const text1Ref = useRef<HTMLDivElement>(null); // Left bottom
  const text2Ref = useRef<HTMLDivElement>(null); // Right bottom
  const videoRef = useRef<HTMLVideoElement>(null); // Background video

  // Section refs for parallax
  const sectionARef = useRef<HTMLDivElement>(null);
  const sectionBRef = useRef<HTMLDivElement>(null);
  const sectionCRef = useRef<HTMLDivElement>(null);
  const sectionDRef = useRef<HTMLDivElement>(null);

  // Layer section refs
  const layerSectionRef = useRef<HTMLElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);

  // Carousel ref
  const carouselRef = useRef<HTMLDivElement>(null);

  // Hero text refs
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null);

  // Section 2 - Latest News refs
  const newsSectionRef = useRef<HTMLElement>(null);
  const newsArticle1Ref = useRef<HTMLDivElement>(null);
  const newsArticle2Ref = useRef<HTMLDivElement>(null);
  const newsArticle3Ref = useRef<HTMLDivElement>(null);
  const newsArticle4Ref = useRef<HTMLDivElement>(null);

  // Video play state
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Active case index for carousel
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);

  // Navbar hide/show on scroll
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavbarScrolled, setIsNavbarScrolled] = useState(false);

  // Newsletter form state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  // Lazy loading for background images
  const heroLayer2 = useLazyBackground('/images/pexels-olly-845451.jpg');
  const heroLayer3 = useLazyBackground('/images/pexels-fauxels-3184465.jpg');

  const newsImg1 = useLazyBackground('https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=80');
  const newsImg2 = useLazyBackground('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80');
  const newsImg3 = useLazyBackground('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80');
  const newsImg4 = useLazyBackground('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&q=80');

  const panelImgA = useLazyBackground('/images/pexels-olly-3760069.jpg');
  const panelImgB = useLazyBackground('/images/pexels-olly-3760072.jpg');
  const panelImgC = useLazyBackground('/images/pexels-olly-3760514.jpg');
  const panelImgD = useLazyBackground('/images/pexels-fauxels-3183197.jpg');

  const ctaBgImg = useLazyBackground('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80');

  // Play button click handler
  const handlePlayButtonClick = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      } else {
        videoRef.current.play()
          .then(() => setIsVideoPlaying(true))
          .catch(err => console.log('Video play error:', err));
      }
    }
  };

  // Newsletter form handler
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      setNewsletterStatus('error');
      setTimeout(() => setNewsletterStatus('idle'), 3000);
      return;
    }

    // Simulate API call
    console.log('Newsletter subscription:', newsletterEmail);
    setNewsletterStatus('success');
    setNewsletterEmail('');

    // Reset success message after 3 seconds
    setTimeout(() => setNewsletterStatus('idle'), 3000);
  };

  // Carousel scroll handlers
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 400;
      const newScrollLeft = direction === 'left'
        ? carouselRef.current.scrollLeft - scrollAmount
        : carouselRef.current.scrollLeft + scrollAmount;

      carouselRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Loading effect - simulates resource loading
  useEffect(() => {
    const loadingInterval = setInterval(() => {
      setLoadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(loadingInterval);
          setTimeout(() => setIsLoading(false), 500); // Fade out after reaching 100%
          return 100;
        }
        return prev + 10;
      });
    }, 150); // Simulate progress every 150ms

    return () => clearInterval(loadingInterval);
  }, []);

  useEffect(() => {
    // Wait for loading to finish before initializing animations
    if (isLoading) return;
    if (!heroRef.current || !circle2Ref.current || !circle3Ref.current || !text1Ref.current || !text2Ref.current) return;

    // Small delay to ensure smooth transition after loading screen
    const initDelay = setTimeout(() => {
      // Check if mobile device
      const isMobile = window.innerWidth < 768;

      // Check if user prefers reduced motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // If user prefers reduced motion, skip complex animations
      if (prefersReducedMotion) {
        // Show content immediately without animations
        gsap.set([circle2Ref.current, circle3Ref.current], { opacity: 1 });
        gsap.set([text1Ref.current, text2Ref.current], { opacity: 1 });
        return;
      }

      // Initialize Lenis smooth scrolling with optimized settings
      const lenis = new Lenis({
        duration: isMobile ? 0.6 : 0.8,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

      // Connect Lenis with GSAP ScrollTrigger
      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);

    // Create master timeline for sequenced layer animations
    const layerTl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: '+=200%', // Pin for DOUBLE viewport height for sequence
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      }
    });

    // PHASE 1 (0-50%): Layer 3 (red) expands, Layer 2 stays frozen
    layerTl.fromTo(
      circle3Ref.current,
      { '--hole-size-red': '150px' },
      { '--hole-size-red': '200vmax', ease: 'power2.inOut', duration: 0.5, force3D: true },
      0
    );

    // PHASE 2 (50-100%): Layer 2 (white) expands, Layer 3 is now static
    layerTl.fromTo(
      circle2Ref.current,
      { '--hole-size': '100px' },
      { '--hole-size': '150vmax', ease: 'power2.inOut', duration: 0.5, force3D: true },
      0.5
    );

    // Set texts to visible from start - they'll be revealed by expanding holes
    gsap.set([text1Ref.current, text2Ref.current], { opacity: 1 });

    // Video control - play when Layer 2 animation completes
    if (videoRef.current) {
      const video = videoRef.current;
      let hasPlayed = false;

      // Ensure video is loaded
      video.load();

      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: '+=200%',
        onUpdate: (self) => {
          // Play video when scroll reaches 90%
          if (self.progress >= 0.9 && !hasPlayed && video) {
            hasPlayed = true;

            video.play()
              .then(() => {
                setIsVideoPlaying(true);
              })
              .catch(err => {
                if (process.env.NODE_ENV === 'development') {
                  console.log('Video play error:', err);
                }
              });
          }

          // Pause if scrolled back
          if (self.progress < 0.85 && hasPlayed && video) {
            hasPlayed = false;
            video.pause();
            video.currentTime = 0;
            setIsVideoPlaying(false);
          }
        }
      });
    }

    // Parallax scroll animations for sections A, B, C, D
    if (sectionARef.current && sectionBRef.current && sectionCRef.current && sectionDRef.current) {
      // Set initial states
      gsap.set([sectionARef.current, sectionCRef.current], { x: '-100%', willChange: 'transform' });
      gsap.set([sectionBRef.current, sectionDRef.current], { x: '100%', willChange: 'transform' });

      // A and C slide rightward (from left side)
      gsap.to(sectionARef.current, {
        x: '0%',
        force3D: true,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionARef.current,
          start: 'top bottom',
          end: 'top 60%',
          scrub: 0.1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        }
      });

      gsap.to(sectionCRef.current, {
        x: '0%',
        force3D: true,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionCRef.current,
          start: 'top bottom',
          end: 'top 60%',
          scrub: 0.1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        }
      });

      // B and D slide leftward (from right side)
      gsap.to(sectionBRef.current, {
        x: '0%',
        force3D: true,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionBRef.current,
          start: 'top bottom',
          end: 'top 60%',
          scrub: 0.1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        }
      });

      gsap.to(sectionDRef.current, {
        x: '0%',
        force3D: true,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionDRef.current,
          start: 'top bottom',
          end: 'top 60%',
          scrub: 0.1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        }
      });
    }

    // Layer section slide-in animations
    if (layer2Ref.current && layer3Ref.current && layerSectionRef.current) {
      // Layer 2 slides in from LEFT
      gsap.fromTo(
        layer2Ref.current,
        { x: '-100%', willChange: 'transform' },
        {
          x: '0%',
          force3D: true,
          ease: 'none',
          scrollTrigger: {
            trigger: layerSectionRef.current,
            start: 'top bottom',
            end: 'top center',
            scrub: 0.1,
            fastScrollEnd: true,
            invalidateOnRefresh: true,
          }
        }
      );

      // Layer 3 slides in from RIGHT
      gsap.fromTo(
        layer3Ref.current,
        { x: '100%', willChange: 'transform' },
        {
          x: '0%',
          force3D: true,
          ease: 'none',
          scrollTrigger: {
            trigger: layerSectionRef.current,
            start: 'top bottom',
            end: 'top center',
            scrub: 0.1,
            fastScrollEnd: true,
            invalidateOnRefresh: true,
          }
        }
      );
    }

    // Hero text animations - Title from top, Subtitle from bottom
    if (heroTitleRef.current && heroSubtitleRef.current) {
      // Hero title - fade in from top
      gsap.fromTo(
        heroTitleRef.current,
        {
          opacity: 0,
          y: -80,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          delay: 0.5,
        }
      );

      // Hero subtitle - fade in from bottom
      gsap.fromTo(
        heroSubtitleRef.current,
        {
          opacity: 0,
          y: 60,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          delay: 0.8,
        }
      );
    }

    // Section 2 - Latest News stagger fade-in animations
    if (newsArticle1Ref.current && newsArticle2Ref.current && newsArticle3Ref.current && newsArticle4Ref.current && newsSectionRef.current) {
      const newsArticles = [
        newsArticle1Ref.current,
        newsArticle2Ref.current,
        newsArticle3Ref.current,
        newsArticle4Ref.current
      ];

      // Stagger fade-in animation
      gsap.fromTo(
        newsArticles,
        {
          opacity: 0,
          y: 60,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.15, // Each article comes in 0.15s after the previous one
          scrollTrigger: {
            trigger: newsSectionRef.current,
            start: 'top 80%',
            end: 'top 20%',
            toggleActions: 'play none none reverse',
            fastScrollEnd: true,
          }
        }
      );
    }

      // WARMUP: Pre-calculate all ScrollTrigger positions and "wake up" animations
      // This eliminates the lag on first scroll
      setTimeout(() => {
        ScrollTrigger.refresh();

        // Simulate tiny scroll to initialize smooth scrolling engine
        window.scrollTo({ top: 1, behavior: 'instant' });
        requestAnimationFrame(() => {
          window.scrollTo({ top: 0, behavior: 'instant' });
        });
      }, 100);

      return () => {
        // Proper cleanup
        ScrollTrigger.getAll().forEach((trigger) => {
          trigger.kill(true);
        });
        lenis.destroy();
      };
    }, 200); // Delay initialization slightly after loading screen

    return () => {
      clearTimeout(initDelay);
    };
  }, [isLoading]);

  // Touch swipe gestures for mobile menu
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    };

    const handleSwipe = () => {
      const swipeDistanceX = touchEndX - touchStartX;
      const swipeDistanceY = Math.abs(touchEndY - touchStartY);
      const minSwipeDistance = 50;

      // Ignore if vertical swipe is dominant (scrolling)
      if (swipeDistanceY > 30) return;

      // Swipe from right edge to open menu (only on mobile)
      if (window.innerWidth < 768 && touchStartX > window.innerWidth - 30 && swipeDistanceX < -minSwipeDistance) {
        setIsMobileMenuOpen(true);
      }

      // Swipe right to close menu when open
      if (isMobileMenuOpen && swipeDistanceX > minSwipeDistance) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobileMenuOpen]);

  // Carousel drag-to-scroll functionality with infinite loop
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      carousel.classList.add('active');
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      carousel.classList.remove('active');
    };

    const handleMouseUp = () => {
      isDown = false;
      carousel.classList.remove('active');
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 2;
      carousel.scrollLeft = scrollLeft - walk;
    };

    // Detect which card is on the left (first visible) and set as active
    // Optimized with requestAnimationFrame for 60fps
    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId) return; // Skip if animation frame already queued

      rafId = requestAnimationFrame(() => {
        const cards = carousel.children;
        const scrollPosition = carousel.scrollLeft;
        const leftEdge = scrollPosition + 100; // Small offset from left edge

        // Total number of original cards (not including clones)
        const originalCardsCount = 6;
        const cardWidth = 600 + 24; // width + gap
        const totalOriginalWidth = originalCardsCount * cardWidth;

        let activeIndex = 0;
        let minDistance = Infinity;

        for (let i = 0; i < cards.length; i++) {
          const card = cards[i] as HTMLElement;
          const cardLeft = card.offsetLeft;
          const distance = Math.abs(leftEdge - cardLeft);

          if (distance < minDistance) {
            minDistance = distance;
            activeIndex = i;
          }
        }

        // Infinite loop logic: jump to the real cards when reaching clones
        if (scrollPosition <= cardWidth) {
          // Scrolled to the beginning (approaching Set 1), jump back to Set 2
          carousel.scrollLeft = totalOriginalWidth + cardWidth;
        } else if (scrollPosition >= totalOriginalWidth * 2 - cardWidth) {
          // Scrolled to the end (approaching Set 3), jump back to Set 2
          carousel.scrollLeft = totalOriginalWidth - cardWidth;
        }

        // Adjust active index to account for clones (first 6 are clones of last 6 cards)
        const adjustedIndex = activeIndex % originalCardsCount;
        setActiveCaseIndex(adjustedIndex);

        rafId = null; // Reset for next frame
      });
    };

    carousel.addEventListener('mousedown', handleMouseDown);
    carousel.addEventListener('mouseleave', handleMouseLeave);
    carousel.addEventListener('mouseup', handleMouseUp);
    carousel.addEventListener('mousemove', handleMouseMove);
    carousel.addEventListener('scroll', handleScroll);

    // Set initial position to the middle (real cards)
    setTimeout(() => {
      const originalCardsCount = 6;
      const cardWidth = 600 + 24;
      carousel.scrollLeft = originalCardsCount * cardWidth;
    }, 100);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      carousel.removeEventListener('mousedown', handleMouseDown);
      carousel.removeEventListener('mouseleave', handleMouseLeave);
      carousel.removeEventListener('mouseup', handleMouseUp);
      carousel.removeEventListener('mousemove', handleMouseMove);
      carousel.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Navbar hide/show on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Change navbar background when scrolled past 50px
      if (currentScrollY > 50) {
        setIsNavbarScrolled(true);
      } else {
        setIsNavbarScrolled(false);
      }

      // Only hide/show navbar if scrolled more than 100px
      if (currentScrollY < 100) {
        setIsNavbarVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      // Scrolling down - hide navbar
      if (currentScrollY > lastScrollY) {
        setIsNavbarVisible(false);
      }
      // Scrolling up - show navbar
      else if (currentScrollY < lastScrollY) {
        setIsNavbarVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <>
      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center transition-opacity duration-500"
          style={{ opacity: loadProgress >= 100 ? 0 : 1 }}>
          <div className="relative flex items-center justify-center">
            {/* Expanding Circles Animation */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Outer Circle - Largest */}
              <div
                className="absolute w-64 h-64 border-4 border-blue-200 rounded-full animate-ping"
                style={{ animationDuration: '2s' }}
              ></div>

              {/* Middle Circle */}
              <div
                className="absolute w-48 h-48 border-4 border-blue-400 rounded-full animate-ping"
                style={{ animationDuration: '1.5s', animationDelay: '0.2s' }}
              ></div>

              {/* Inner Circle */}
              <div
                className="absolute w-32 h-32 border-4 border-blue-600 rounded-full animate-ping"
                style={{ animationDuration: '1s', animationDelay: '0.4s' }}
              ></div>

              {/* Progress Circle */}
              <svg className="absolute w-40 h-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#E5E7EB"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#3B82F6"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - loadProgress / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>
            </div>

            {/* Center Content */}
            <div className="relative z-10 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                PeopleUp
              </h1>
              <p className="text-2xl font-semibold text-slate-600">
                {loadProgress}%
              </p>
            </div>
          </div>
        </div>
      )}

      <main>
      {/* Navigation Bar */}
      <nav
        aria-label="Main navigation"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isNavbarVisible ? 'translate-y-0' : '-translate-y-full'} ${isNavbarScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="text-xl sm:text-2xl font-bold text-black">
              PeopleUp
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#about" className="relative text-base font-medium text-gray-700 hover:text-blue-500 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full">
                About
              </a>
              <a href="#services" className="relative text-base font-medium text-gray-700 hover:text-blue-500 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full">
                Services
              </a>
              <a href="#team" className="relative text-base font-medium text-gray-700 hover:text-blue-500 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full">
                Team
              </a>
              <a href="#contact" className="relative text-base font-medium text-gray-700 hover:text-blue-500 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full">
                Contact
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-700 relative p-2 hover:bg-slate-100 rounded-md transition-colors"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
                <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`md:hidden fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden={!isMobileMenuOpen}
        >
          <div
            className={`absolute top-0 right-0 h-full w-full bg-white shadow-2xl transition-transform duration-300 ${
              isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Mobile Menu Content */}
            <div className="flex flex-col h-full pt-16 px-6">
              <nav className="flex flex-col gap-6" aria-label="Mobile navigation">
                <a
                  href="#about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-gray-700 hover:text-blue-500 transition-colors border-b border-gray-200 pb-3"
                >
                  About
                </a>
                <a
                  href="#services"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-gray-700 hover:text-blue-500 transition-colors border-b border-gray-200 pb-3"
                >
                  Services
                </a>
                <a
                  href="#team"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-gray-700 hover:text-blue-500 transition-colors border-b border-gray-200 pb-3"
                >
                  Team
                </a>
                <a
                  href="#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-gray-700 hover:text-blue-500 transition-colors border-b border-gray-200 pb-3"
                >
                  Contact
                </a>
              </nav>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with 3-Layer Background */}
      <section
        ref={heroRef}
        className="relative min-h-screen overflow-hidden"
        style={{ isolation: 'isolate' }}
      >
        {/* Layer 1 - Video Background (Bottom) */}
        <div className="absolute inset-0 bg-black z-[1] overflow-hidden">
          {/* Background Video */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            loop
            muted
            playsInline
            preload="metadata"
            style={{ willChange: 'auto' }}
          >
            <source src="/videos/3252123-compressed.mp4" type="video/mp4" />
            <source src="/videos/3252123-uhd_3840_2160_25fps.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Play Button - Inside Layer 1 */}
          <button
            onClick={handlePlayButtonClick}
            className={`absolute bottom-12 left-1/2 -translate-x-1/2 z-10
              bg-white/20 backdrop-blur-sm hover:bg-white/30
              border-2 border-white/40 hover:border-white/60
              rounded-full p-6 transition-all duration-300
              hover:scale-110 active:scale-95
              ${isVideoPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'}
            `}
            aria-label={isVideoPlaying ? 'Pause video' : 'Play video'}
          >
            {isVideoPlaying ? (
              // Pause Icon
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              // Play Icon
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Text 1 (LEFT BOTTOM): Revealed by expanding holes */}
          <div
            ref={text1Ref}
            className="absolute left-8 bottom-8 sm:left-12 sm:bottom-12 md:left-16 md:bottom-16 text-white z-10"
          >
            <p className="text-lg sm:text-xl md:text-2xl font-medium">
              Discover
            </p>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2">
              Your Potential
            </p>
          </div>
        </div>

        {/* Layer 2 - Image Background with Expanding Hole */}
        <div className="absolute inset-0 z-[2] pointer-events-none">
          <div
            ref={(el) => {
              if (el) {
                (circle2Ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
                (heroLayer2.elementRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
              }
            }}
            className="absolute inset-0"
            style={{
              backgroundImage: heroLayer2.currentUrl ? `url(${heroLayer2.currentUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              maskImage: 'radial-gradient(circle at center, transparent var(--hole-size, 100px), black calc(var(--hole-size, 100px) + 1px))',
              WebkitMaskImage: 'radial-gradient(circle at center, transparent var(--hole-size, 100px), black calc(var(--hole-size, 100px) + 1px))',
              '--hole-size': '100px',
            } as React.CSSProperties}
          />

          {/* Text 2 (RIGHT BOTTOM): Revealed by expanding holes */}
          <div
            ref={text2Ref}
            className="absolute right-8 bottom-8 sm:right-12 sm:bottom-12 md:right-16 md:bottom-16 text-blue-500 text-right"
          >
            <p className="text-lg sm:text-xl md:text-2xl font-medium">
              Elevate
            </p>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2">
              Your Career
            </p>
          </div>
        </div>

        {/* Layer 3 - Image Background with BIGGER Expanding Hole */}
        <div className="absolute inset-0 z-[3] pointer-events-none">
          <div
            ref={(el) => {
              if (el) {
                (circle3Ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
                (heroLayer3.elementRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
              }
            }}
            className="absolute inset-0"
            style={{
              backgroundImage: heroLayer3.currentUrl ? `url(${heroLayer3.currentUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              maskImage: 'radial-gradient(circle at center, transparent var(--hole-size-red, 150px), black calc(var(--hole-size-red, 150px) + 1px))',
              WebkitMaskImage: 'radial-gradient(circle at center, transparent var(--hole-size-red, 150px), black calc(var(--hole-size-red, 150px) + 1px))',
              '--hole-size-red': '150px',
            } as React.CSSProperties}
          />
        </div>

        {/* Layer 4 - Transparent with Blue Text (Top) */}
        <div className="absolute inset-0 z-[4] flex items-center justify-center pointer-events-none">
          <div className="text-center px-4 sm:px-6">
            <h1 ref={heroTitleRef} className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-blue-500 mb-3 sm:mb-4 md:mb-6 opacity-0">
              PeopleUp
            </h1>
            <p ref={heroSubtitleRef} className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-400 max-w-xs sm:max-w-md md:max-w-xl mx-auto opacity-0">
              We hunt the perfect fit
            </p>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section ref={newsSectionRef} className="relative min-h-screen bg-white px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          {/* Header with News Tab and See All Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 md:mb-16 gap-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900">
              Our Latest News
            </h2>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-8">
              <button className="relative overflow-hidden px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 bg-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-xs sm:text-sm before:absolute before:inset-0 before:bg-slate-300 before:w-0 before:transition-all before:duration-300 hover:before:w-full">
                <span className="relative z-10">NEWS</span>
              </button>
              <button className="relative overflow-hidden px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 bg-slate-900 text-white font-semibold uppercase tracking-wider text-xs sm:text-sm transition-colors flex items-center gap-2 before:absolute before:inset-0 before:bg-blue-600 before:w-0 before:transition-all before:duration-300 hover:before:w-full">
                <span className="relative z-10">SEE ALL</span>
                <svg className="w-3 h-3 sm:w-4 sm:h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            {/* Large Featured Article - Left */}
            <div
              ref={(el) => {
                if (el) {
                  (newsArticle1Ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
                  (newsImg1.elementRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
                }
              }}
              className="lg:row-span-2 relative group cursor-pointer overflow-hidden opacity-0">
              <div className="relative h-full min-h-[600px]">
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{
                    backgroundImage: newsImg1.currentUrl ? `url('${newsImg1.currentUrl}')` : 'none',
                  }}
                >
                  {/* Placeholder for image - Business meeting/CTO */}
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-wider">
                      NEWS
                    </span>
                    <span className="text-white text-sm font-medium">
                      10.07.2025
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-5 md:mb-6 leading-tight">
                      PeopleUp Places CTO for Leading Swiss Fintech in Record 14 Days
                    </h3>
                    <p className="text-white/90 text-lg mb-6 leading-relaxed">
                      Major executive search success: Our team delivered a seasoned Chief Technology Officer for a rapidly scaling Zürich-based fintech, showcasing our expertise in C-suite recruitment and tech sector knowledge.
                    </p>
                    <button className="relative overflow-hidden flex items-center gap-2 text-white font-semibold uppercase text-sm hover:gap-4 transition-all px-6 py-2 before:absolute before:inset-0 before:bg-white/20 before:w-0 before:transition-all before:duration-300 hover:before:w-full">
                      <span className="relative z-10">SEE MORE</span>
                      <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Small Article 1 - Top Right */}
            <div ref={newsArticle2Ref} className="relative group cursor-pointer overflow-hidden opacity-0">
              <div className="relative h-full min-h-[290px]">
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{
                    backgroundImage: newsImg2.currentUrl ? `url('${newsImg2.currentUrl}')` : 'none',
                  }}
                  ref={newsImg2.elementRef}
                >
                  {/* Placeholder for image - Fast hiring/recruitment */}
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-wider">
                      NEWS
                    </span>
                    <span className="text-white text-sm font-medium">
                      01.14.2025
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-3 leading-tight">
                      Introducing Our 3-Week Placement Program: 7 Days to Candidates, 21 Days to Hire
                    </h3>
                    <button className="relative overflow-hidden flex items-center gap-2 text-white font-semibold text-xs hover:gap-3 transition-all px-4 py-2 before:absolute before:inset-0 before:bg-white/20 before:w-0 before:transition-all before:duration-300 hover:before:w-full">
                      <span className="relative z-10">READ MORE</span>
                      <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Small Article 2 - Middle Right */}
            <div ref={newsArticle3Ref} className="relative group cursor-pointer overflow-hidden opacity-0">
              <div className="relative h-full min-h-[290px]">
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{
                    backgroundImage: newsImg3.currentUrl ? `url('${newsImg3.currentUrl}')` : 'none',
                  }}
                  ref={newsImg3.elementRef}
                >
                  {/* Placeholder for image - Happy team/success */}
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-wider">
                      NEWS
                    </span>
                    <span className="text-white text-sm font-medium">
                      12.16.2024
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-3 leading-tight">
                      PeopleUp Achieves 95% Retention Rate: Setting New Industry Standards
                    </h3>
                    <button className="relative overflow-hidden flex items-center gap-2 text-white font-semibold text-xs hover:gap-3 transition-all px-4 py-2 before:absolute before:inset-0 before:bg-white/20 before:w-0 before:transition-all before:duration-300 hover:before:w-full">
                      <span className="relative z-10">READ MORE</span>
                      <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Wide Article - Bottom */}
            <div ref={newsArticle4Ref} className="lg:col-span-2 relative group cursor-pointer overflow-hidden opacity-0">
              <div className="relative h-full min-h-[400px]">
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{
                    backgroundImage: newsImg4.currentUrl ? `url('${newsImg4.currentUrl}')` : 'none',
                  }}
                  ref={newsImg4.elementRef}
                >
                  {/* Placeholder for image - Swiss offices/cityscape */}
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-wider">
                      NEWS
                    </span>
                    <span className="text-white text-sm font-medium">
                      06.06.2025
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-5 md:mb-6 leading-tight">
                      Expanding Across Switzerland: PeopleUp Opens New Offices in Geneva and Basel
                    </h3>
                    <p className="text-white/90 text-lg mb-6 leading-relaxed">
                      Strategic expansion brings our Swiss-standard recruitment excellence to French and German-speaking regions, strengthening our position as Switzerland's premier tech and finance recruitment partner.
                    </p>
                    <button className="relative overflow-hidden flex items-center gap-2 text-white font-semibold uppercase text-sm hover:gap-4 transition-all px-6 py-2 before:absolute before:inset-0 before:bg-white/20 before:w-0 before:transition-all before:duration-300 hover:before:w-full">
                      <span className="relative z-10">SEE MORE</span>
                      <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Four Equal Sections with Parallax Scroll */}
      <section className="relative flex flex-col bg-white">
        {/* Section A - Our Services */}
        <div
          ref={sectionARef}
          className="w-full h-[40vh] flex items-center justify-center px-4 sm:px-6 md:px-8 relative overflow-hidden group"
          style={{ willChange: 'transform' }}
        >
          {/* Background Image with Hover Zoom */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            ref={panelImgA.elementRef}
            style={{
              backgroundImage: panelImgA.currentUrl ? `url(${panelImgA.currentUrl})` : 'none',
              willChange: 'transform'
            }}
          ></div>

          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/60"></div>

          <div className="text-white text-center max-w-4xl relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">Executive Search</h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90">We identify and recruit top-tier talent for C-suite and senior leadership positions</p>
          </div>
        </div>

        {/* Section B - Our Process */}
        <div
          ref={sectionBRef}
          className="w-full h-[40vh] flex items-center justify-center px-4 sm:px-6 md:px-8 relative overflow-hidden group"
          style={{ willChange: 'transform' }}
        >
          {/* Background Image with Hover Zoom */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            ref={panelImgB.elementRef}
            style={{
              backgroundImage: panelImgB.currentUrl ? `url(${panelImgB.currentUrl})` : 'none',
              willChange: 'transform'
            }}
          ></div>

          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-blue-900/70"></div>

          <div className="text-white text-center max-w-4xl relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">3-Week Placement</h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90">Our proven process delivers qualified candidates in 7 days, complete placements in 21 days</p>
          </div>
        </div>

        {/* Section C - Industries We Serve */}
        <div
          ref={sectionCRef}
          className="w-full h-[40vh] flex items-center justify-center px-4 sm:px-6 md:px-8 relative overflow-hidden group"
          style={{ willChange: 'transform' }}
        >
          {/* Background Image with Hover Zoom */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            ref={panelImgC.elementRef}
            style={{
              backgroundImage: panelImgC.currentUrl ? `url(${panelImgC.currentUrl})` : 'none',
              willChange: 'transform'
            }}
          ></div>

          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/60"></div>

          <div className="text-white text-center max-w-4xl relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">Tech & Finance Focus</h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90">Specialized expertise in technology startups, fintech, and financial services sectors</p>
          </div>
        </div>

        {/* Section D - Success Metrics */}
        <div
          ref={sectionDRef}
          className="w-full h-[40vh] flex items-center justify-center px-4 sm:px-6 md:px-8 relative overflow-hidden group"
          style={{ willChange: 'transform' }}
        >
          {/* Background Image with Hover Zoom */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            ref={panelImgD.elementRef}
            style={{
              backgroundImage: panelImgD.currentUrl ? `url(${panelImgD.currentUrl})` : 'none',
              willChange: 'transform'
            }}
          ></div>

          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-blue-900/70"></div>

          <div className="text-white text-center max-w-4xl relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">95% Retention Rate</h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90">Our placements stay and thrive - industry-leading 12-month retention success</p>
          </div>
        </div>
      </section>

      {/* Cases & Success Stories Carousel Section */}
      <section className="relative bg-slate-50 px-8 py-24">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-6">
              SUCCESS STORIES
            </p>
            <div className="flex flex-col md:flex-row items-start md:justify-between gap-4 md:gap-8">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-slate-900 leading-tight max-w-3xl">
                PeopleUp delivers Swiss-standard recruitment excellence: from C-suite executives to specialized tech teams, our placements drive business success across Switzerland.
              </h2>
              <div className="flex items-center gap-3 md:gap-4 md:shrink-0">
                {/* Navigation Arrows */}
                <div className="flex gap-2">
                  <button
                    onClick={() => scrollCarousel('left')}
                    className="w-8 h-8 sm:w-10 sm:h-10 border border-slate-300 hover:border-slate-400 hover:bg-slate-100 flex items-center justify-center transition-colors"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => scrollCarousel('right')}
                    className="w-8 h-8 sm:w-10 sm:h-10 border border-slate-300 hover:border-slate-400 hover:bg-slate-100 flex items-center justify-center transition-colors"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                {/* See All Button */}
                <button className="relative overflow-hidden px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 bg-slate-900 text-white font-semibold uppercase tracking-wider text-xs sm:text-sm transition-colors flex items-center gap-2 before:absolute before:inset-0 before:bg-blue-600 before:w-0 before:transition-all before:duration-300 hover:before:w-full">
                  <span className="relative z-10">SEE ALL</span>
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Carousel Container */}
          <div className="relative overflow-hidden -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8">
            <div
              ref={carouselRef}
              className="flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto pb-6 sm:pb-8 hide-scrollbar cursor-grab active:cursor-grabbing select-none"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                scrollSnapType: 'none', // Disable snap for infinite loop
              }}
            >
              {/* Case Cards with Clones for Infinite Loop */}
              {(() => {
                const cases = [
                  {
                    tags: ['Executive Search', 'C-Suite'],
                    status: 'SUCCESSFUL PLACEMENT',
                    statusColor: 'bg-green-400',
                    title: 'CTO Placement for Swiss Fintech - Completed in 14 Days',
                    gradient: 'from-blue-200 to-blue-300',
                    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80',
                  },
                  {
                    tags: ['Tech Talent', 'Full-Stack'],
                    status: 'COMPLETED',
                    statusColor: 'bg-emerald-400',
                    title: 'Development Team of 8 Engineers - Zürich-Based Startup',
                    gradient: 'from-slate-300 to-slate-400',
                    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
                  },
                  {
                    tags: ['Finance Sector', 'CFO'],
                    status: 'SUCCESSFUL PLACEMENT',
                    statusColor: 'bg-green-400',
                    title: 'Chief Financial Officer for Asset Management Firm',
                    gradient: 'from-amber-200 to-amber-300',
                    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
                  },
                  {
                    tags: ['Engineering', 'Senior Level'],
                    status: 'COMPLETED',
                    statusColor: 'bg-emerald-400',
                    title: '12 Senior Engineers for Manufacturing Leader in Basel',
                    gradient: 'from-gray-200 to-gray-300',
                    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
                  },
                  {
                    tags: ['3-Week Program', 'Rapid Placement'],
                    status: 'COMPLETED IN 21 DAYS',
                    statusColor: 'bg-purple-300',
                    title: 'Product Manager - From Brief to Onboarding in 3 Weeks',
                    gradient: 'from-indigo-200 to-indigo-300',
                    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
                  },
                  {
                    tags: ['High Retention', '95% Success Rate'],
                    status: '12-MONTH MILESTONE',
                    statusColor: 'bg-teal-400',
                    title: 'Risk Management Team - All 6 Members Still Thriving',
                    gradient: 'from-teal-200 to-teal-300',
                    imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
                  },
                ];

                // Create array: [clones of last 6, ...original 6, clones of first 6]
                const allCases = [...cases, ...cases, ...cases];

                return allCases.map((caseItem, index) => {
                  const originalIndex = index % cases.length;
                  const isActive = activeCaseIndex === originalIndex;
                  return (
                    <div
                      key={`case-${index}`}
                      className={`flex-none group transition-[width] duration-500 ease-out ${
                        isActive ? 'w-[600px]' : 'w-[350px]'
                      }`}
                      style={{ willChange: isActive ? 'width' : 'auto' }}
                    >
                      <div className="relative h-[600px] overflow-hidden rounded-sm">
                        {/* Background Image */}
                        <div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{
                            backgroundImage: `url('${caseItem.imageUrl}')`,
                          }}
                        >
                          {/* Real image from Unsplash */}
                        </div>

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/20"></div>

                        {/* Content */}
                        <div className={`absolute inset-0 flex flex-col justify-between transition-[padding] duration-500 ${
                          isActive ? 'p-8' : 'p-6'
                        }`}>
                          {/* Tags */}
                          <div className="flex flex-wrap gap-2">
                            {caseItem.tags.map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className={`bg-white text-slate-900 text-xs font-medium transition-[padding] duration-500 ${
                                  isActive ? 'px-4 py-2' : 'px-3 py-1.5'
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Status & Title */}
                          <div>
                            <span className={`inline-block ${caseItem.statusColor} text-slate-900 text-xs font-semibold uppercase tracking-wider transition-[padding,margin] duration-500 ${
                              isActive ? 'px-4 py-2 mb-4' : 'px-3 py-1.5 mb-3'
                            }`}>
                              {caseItem.status}
                            </span>
                            <h3 className={`font-normal text-slate-900 transition-[font-size] duration-500 ${
                              isActive ? 'text-2xl' : 'text-xl'
                            }`}>
                              {caseItem.title}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* CTA Section - Layer System */}
      <section ref={layerSectionRef} className="relative min-h-screen overflow-hidden" style={{ isolation: 'isolate' }}>
        {/* Layer 1 - Background (Full Section) */}
        <div className="absolute inset-0 z-[1]"
          ref={ctaBgImg.elementRef}
          style={{
            backgroundImage: ctaBgImg.currentUrl ? `linear-gradient(rgba(241, 245, 249, 0.95), rgba(241, 245, 249, 0.95)), url('${ctaBgImg.currentUrl}')` : 'linear-gradient(rgba(241, 245, 249, 0.95), rgba(241, 245, 249, 0.95))',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
        </div>

        {/* Layer 2 - Rectangle (Left to Right) - Slides from LEFT */}
        <div
          ref={layer2Ref}
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-24 sm:h-28 md:h-32 bg-blue-600 z-[2] flex items-center overflow-hidden"
          style={{ willChange: 'transform' }}
        >
          <div className="flex items-center animate-scroll-infinite whitespace-nowrap">
            <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-semibold px-6 sm:px-8 md:px-12">
              250+ Companies • 95% Retention Rate • 7-21 Day Placements
            </p>
            <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-semibold px-6 sm:px-8 md:px-12">
              250+ Companies • 95% Retention Rate • 7-21 Day Placements
            </p>
            <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-semibold px-6 sm:px-8 md:px-12">
              250+ Companies • 95% Retention Rate • 7-21 Day Placements
            </p>
            <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-semibold px-6 sm:px-8 md:px-12">
              250+ Companies • 95% Retention Rate • 7-21 Day Placements
            </p>
            <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-semibold px-6 sm:px-8 md:px-12">
              250+ Companies • 95% Retention Rate • 7-21 Day Placements
            </p>
            <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-semibold px-6 sm:px-8 md:px-12">
              250+ Companies • 95% Retention Rate • 7-21 Day Placements
            </p>
          </div>
        </div>

        {/* Layer 3 - Right Panel (Reduced Height with Diagonal Cut) - Slides from RIGHT */}
        <div
          ref={layer3Ref}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-2/3 h-2/3 bg-slate-900 z-[3] flex items-center justify-center px-8"
          style={{
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 15% 100%)',
            willChange: 'transform'
          }}
        >
          <div className="text-white text-center max-w-xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Find Your Next Hire?</h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">Let's build your dream team with Swiss precision and speed</p>
            <button className="relative overflow-hidden bg-blue-500 text-white font-semibold px-8 py-4 transition-colors text-lg before:absolute before:inset-0 before:bg-blue-700 before:w-0 before:transition-all before:duration-300 hover:before:w-full">
              <span className="relative z-10">Get Started Today</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        {/* Top Bar - Logo & Contact Button */}
        <div className="border-b border-gray-200 py-6 sm:py-8">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 flex flex-col sm:flex-row justify-between items-start gap-6 sm:gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">PeopleUp</h3>
              <p className="text-slate-600 max-w-sm">
                Empowering people, elevating careers.<br />
                Swiss-standard recruitment excellence.
              </p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
              <div className="flex-1">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  aria-label="Email address"
                  className="w-full px-4 py-3 border-2 border-gray-300 focus:border-blue-600 focus:outline-none transition-colors text-slate-900"
                />
              </div>
              <button
                type="submit"
                disabled={newsletterStatus === 'success'}
                className="relative overflow-hidden flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white transition-colors before:absolute before:inset-0 before:bg-blue-700 before:w-0 before:transition-all before:duration-300 hover:before:w-full disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="font-semibold uppercase text-xs sm:text-sm tracking-wider relative z-10">
                  {newsletterStatus === 'success' ? 'Subscribed!' : 'Subscribe'}
                </span>
              </button>
              {newsletterStatus === 'error' && (
                <p className="text-red-600 text-sm mt-1">Please enter a valid email address</p>
              )}
            </form>
          </div>
        </div>

        {/* Main Footer Content - 3 Columns */}
        <div className="py-8 sm:py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 md:gap-16">
              {/* Column 1 - Services */}
              <div className="border-b md:border-b-0 md:border-r border-gray-200 pb-8 md:pb-0 md:pr-8 lg:pr-16">
                <h4 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-4 sm:mb-5 md:mb-6">
                  Our Services
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="relative inline-block text-slate-700 hover:text-blue-600 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full">
                      Executive Search
                    </a>
                  </li>
                  <li>
                    <a href="#" className="relative inline-block text-slate-700 hover:text-blue-600 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full">
                      Permanent Placement
                    </a>
                  </li>
                  <li>
                    <a href="#" className="relative inline-block text-slate-700 hover:text-blue-600 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full">
                      Contract Staffing
                    </a>
                  </li>
                  <li>
                    <a href="#" className="relative inline-block text-slate-700 hover:text-blue-600 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full">
                      Career Consulting
                    </a>
                  </li>
                  <li>
                    <a href="#" className="relative inline-block text-slate-700 hover:text-blue-600 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full">
                      Talent Advisory
                    </a>
                  </li>
                  <li>
                    <a href="#" className="relative inline-block text-slate-700 hover:text-blue-600 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full">
                      3-Week Placement Program
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 2 - Industries & Resources */}
              <div className="border-b md:border-b-0 md:border-r border-gray-200 pb-8 md:pb-0 md:pr-8 lg:pr-16">
                <h4 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-4 sm:mb-5 md:mb-6">
                  Industries We Serve
                </h4>
                <ul className="space-y-3 mb-6 sm:mb-8 md:mb-10">
                  <li>
                    <a href="#" className="relative inline-block text-slate-700 hover:text-blue-600 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full">
                      Technology & Software
                    </a>
                  </li>
                  <li>
                    <a href="#" className="relative inline-block text-slate-700 hover:text-blue-600 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full">
                      Finance & Banking
                    </a>
                  </li>
                  <li>
                    <a href="#" className="relative inline-block text-slate-700 hover:text-blue-600 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full">
                      Engineering
                    </a>
                  </li>
                  <li>
                    <a href="#" className="relative inline-block text-slate-700 hover:text-blue-600 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full">
                      Healthcare & Pharma
                    </a>
                  </li>
                </ul>

                <h4 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-4 sm:mb-5 md:mb-6">
                  Resources
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="relative inline-block text-slate-700 hover:text-blue-600 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full">
                      Success Stories
                    </a>
                  </li>
                  <li>
                    <a href="#" className="relative inline-block text-slate-700 hover:text-blue-600 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full">
                      Career Insights
                    </a>
                  </li>
                  <li>
                    <a href="#" className="relative inline-block text-slate-700 hover:text-blue-600 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full">
                      Salary Guide
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 3 - Company & Follow Us */}
              <div>
                <h4 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-4 sm:mb-5 md:mb-6">
                  PeopleUp
                </h4>
                <ul className="space-y-3 mb-6 sm:mb-8 md:mb-10">
                  <li>
                    <a href="#" className="relative inline-block text-slate-700 hover:text-blue-600 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="relative inline-block text-slate-700 hover:text-blue-600 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="relative inline-block text-slate-700 hover:text-blue-600 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full">
                      Our Team
                    </a>
                  </li>
                  <li>
                    <a href="#" className="relative inline-block text-slate-700 hover:text-blue-600 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full">
                      Contact
                    </a>
                  </li>
                </ul>

                <h4 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-4 sm:mb-5 md:mb-6">
                  Follow Us
                </h4>
                <div className="flex gap-4">
                  <a href="#" className="text-slate-700 hover:text-blue-600 transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Copyright & Legal Links */}
        <div className="border-t border-gray-200 py-4 sm:py-6">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-600 text-xs sm:text-sm mb-4 md:mb-0">
              © 2025 PeopleUp. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6">
              <a href="#" className="relative inline-block text-slate-600 hover:text-blue-600 transition-colors text-xs sm:text-sm after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full">
                Privacy Policy
              </a>
              <a href="#" className="relative inline-block text-slate-600 hover:text-blue-600 transition-colors text-xs sm:text-sm after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full">
                Terms of Service
              </a>
              <a href="#" className="relative inline-block text-slate-600 hover:text-blue-600 transition-colors text-xs sm:text-sm after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full">
                Cookie Policy
              </a>
              <a href="#" className="relative inline-block text-slate-600 hover:text-blue-600 transition-colors text-xs sm:text-sm after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full">
                Legal Notices
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
    </>
  );
}
