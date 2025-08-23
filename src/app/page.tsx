"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";

export default function Home() {
  // Intro overlay control
  const [curtainStarted, setCurtainStarted] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const phrase = useMemo(() => "Hey, there 👋!", []);

  // Animation timing
  const letterDuration = 0.7; // seconds for each letter to travel up
  const stagger = 0.06; // seconds between letters
  const segmentCount = 8; // number of vertical rectangles (wider)
  const segDuration = 0.9; // seconds each rectangle shrinks (smooth)
  const segDelay = 0.08; // seconds between rectangles starting (left->right)

  // Refs for scroll-driven interactions
  const heroRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tiltDeg, setTiltDeg] = useState(-6); // initial tilt matches hero design
  const [cardPinned, setCardPinned] = useState(false);
  const STICKY_TOP = 112; // same as top-28 used by sticky elements

  useEffect(() => {
    const totalLetters = letterDuration + stagger * (phrase.length - 1);

    const startCurtainT = setTimeout(() => setCurtainStarted(true), (totalLetters + 0.25) * 1000);

    // total time: last rectangle finishes
    const curtainDurationMs = (segDuration + segDelay * (segmentCount - 1)) * 1000;
    const hideIntroT = setTimeout(
      () => setShowIntro(false),
      (totalLetters + 0.25) * 1000 + curtainDurationMs + 100
    );

    return () => {
      clearTimeout(startCurtainT);
      clearTimeout(hideIntroT);
    };
  }, [phrase, segDuration, segDelay, segmentCount]);

  // Handle scroll: smoothly remove the card rotation and detect when the card is pinned at the sticky top
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const heroEl = heroRef.current;
        const cardEl = cardRef.current;
        if (heroEl) {
          const rect = heroEl.getBoundingClientRect();
          // When top goes negative (hero moving up), interpolate -6deg -> 0deg over ~280px
          const raw = Math.min(Math.max(-rect.top / 280, 0), 1);
          const next = -6 + 6 * raw;
          setTiltDeg(next);
        }
        if (cardEl) {
          const cTop = cardEl.getBoundingClientRect().top;
          setCardPinned(cTop <= STICKY_TOP + 0.5);
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#08233B] text-white">
      {/* Top navigation (placeholder content) */}
      <header className="relative">
        <div className="mx-auto max-w-5xl px-6 pt-6">
          <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3 backdrop-blur-md ring-1 ring-white/10">
            {/* Left: Placeholder brand mark */}
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white/10 font-kumbh text-lg">A</div>

            {/* Center: nav links */}
            <nav className="hidden gap-6 text-sm text-neutral-200 md:flex">
              <a className="transition-colors hover:text-white" href="#">Home</a>
              <a className="transition-colors hover:text-white" href="#">Work</a>
              <a className="transition-colors hover:text-white" href="#">About</a>
              <a className="transition-colors hover:text-white" href="#">Contact</a>
            </nav>

            {/* Right: placeholder social icons */}
            <div className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-md bg-white/10" aria-hidden />
              <span className="h-8 w-8 rounded-md bg-white/10" aria-hidden />
              <span className="h-8 w-8 rounded-md bg-white/10" aria-hidden />
            </div>
          </div>
        </div>
      </header>

      {/* Two-column layout wrapper to keep the photo sticky while content scrolls */}
      <div className="relative mx-auto max-w-5xl px-6 py-16 md:py-24">
        <div className="grid items-start gap-12 md:grid-cols-2">
          {/* Left column: hero copy + experience timeline */}
          <div>
            {/* Hero copy (unchanged) */}
            <div ref={heroRef}>
              <p className="mb-3 font-kumbh text-lg text-neutral-300">
                Hey, there <span className="inline-block origin-bottom-right">👋</span>
              </p>

              <h1 className="font-kumbh text-5xl leading-tight sm:text-6xl md:text-7xl">
                I&apos;m <span className="bg-gradient-to-r from-sky-300 to-blue-400 bg-clip-text text-transparent">Bruno Champion</span>
              </h1>
              <h2 className="font-kumbh mt-2 text-4xl leading-tight text-white/95 sm:text-5xl md:text-6xl">
                a Full‑Stack Developer
              </h2>

              <p className="mt-6 max-w-xl text-base/7 text-neutral-300">
                I partner with founders and teams to design, build, and ship reliable web products — with clean code, strong security, and an eye for performance. You can expect thoughtful communication, predictable delivery, and results you can trust.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-xl bg-white text-[#08233B] px-5 py-3 font-medium shadow-sm ring-1 ring-white/20 transition hover:translate-y-[-1px] hover:shadow-md"
                >
                  <span>✨</span>
                  <span>Hire Me</span>
                </a>
                <a
                  href="#work"
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-neutral-200 ring-1 ring-white/20 transition hover:bg-white/5"
                >
                  View Work
                </a>
              </div>
            </div>

            {/* Experience Timeline (pinned) */}
            <ExperienceTimeline cardPinned={cardPinned} />
          </div>

          {/* Right column: sticky photo placeholder that tilts back to 0deg */}
          <div className="sticky top-28 self-start">
            <div
              ref={cardRef}
              className="relative rounded-3xl bg-[#F3EBDD] p-4 shadow-xl ring-1 ring-black/10 transition-transform duration-200 will-change-transform"
              style={{ transform: `rotate(${tiltDeg}deg)` }}
            >
              <div className="h-[380px] w-[300px] rounded-2xl bg-[#F3EBDD] shadow-inner md:h-[420px] md:w-[340px]" aria-hidden />
            </div>
          </div>
        </div>
      </div>

      {/* Intro overlay */}
      {showIntro && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ clipPath: "inset(0 0 0 0)" }}
        >
          {/* Phrase (top-most) */}
          <div className={`relative z-10 px-6 transition-opacity duration-500 ${curtainStarted ? "opacity-0" : "opacity-100"}`}>
            <AnimatedPhrase phrase={phrase} letterDuration={letterDuration} stagger={stagger} />
          </div>

          {/* Mid-layer: vertical rectangles that look like a background and shrink down left->right */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 curtain-container"
            style={{
              ["--cols" as any]: segmentCount as any,
              ["--rect-bg" as any]: "#22394E",
              ["--seg-dur" as any]: `${segDuration}s`,
            }}
          >
            {Array.from({ length: segmentCount }).map((_, i) => (
              <span
                key={i}
                className={`curtain-seg ${curtainStarted ? "curtain-shrink" : ""}`}
                style={{ animationDelay: `${i * segDelay}s` }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AnimatedPhrase({
  phrase,
  letterDuration,
  stagger,
}: {
  phrase: string;
  letterDuration: number;
  stagger: number;
}) {
  return (
    <h2 className="font-kumbh text-white text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-normal tracking-tight leading-none select-none">
      {Array.from(phrase).map((ch, idx) => {
        const delay = idx * stagger;
        const isWave = ch === "👋";
        return (
          <span key={idx} className="inline-block align-baseline">
            {isWave ? (
              <span
                className="inline-block intro-slide-up"
                style={{ animationDelay: `${delay}s`, animationDuration: `${letterDuration}s` }}
              >
                <span
                  className="inline-block hand-wave origin-bottom-right"
                  style={{ animationDelay: `${delay}s` }}
                >
                  {ch}
                </span>
              </span>
            ) : (
              <span
                className="inline-block intro-slide-up"
                style={{ animationDelay: `${delay}s`, animationDuration: `${letterDuration}s` }}
              >
                {ch === " " ? "\u00A0" : ch}
              </span>
            )}
          </span>
        );
      })}
    </h2>
  );
}

function ExperienceTimeline({ cardPinned }: { cardPinned: boolean }) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState(0);
  const startedRef = useRef(false);

  const items = useMemo(
    () => [
      { company: "PDFizz AI", role: "AI Full Stack Developer", time: "June 2025 - Ongoing" },
      { company: "LecSum AI", role: "AI Full Stack Developer", time: "June 2025 - August 2025" },
      { company: "CoDev", role: "Backend Developer", time: "April 2025 - July 2025" },
      { company: "Nomina360", role: "Full Stack Developer", time: "October 2024 - April 2025" },
    ],
    []
  );

  // Simplified constants - ensure all items fit and are visible
  const containerH = 420;
  const topStickyOffset = 112;
  const itemSpacing = 200; // spacing between items
  const topPadding = 60;
  const bottomPadding = 60;
  const cardHeight = 120; // estimated card height
  
  // Calculate scroll length to stop when last item is fully visible at bottom
  // Last item should stop at bottom of viewport minus some padding
  const totalItemsHeight = (items.length - 1) * itemSpacing;
  const scrollLength = totalItemsHeight + topPadding; // stop when last item reaches bottom

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const rect = el.getBoundingClientRect();
        const isTimelinePinned = rect.top <= topStickyOffset;

        if (!isTimelinePinned) {
          startedRef.current = false;
          setOffset(0);
          return;
        }

        // Simple progress calculation
        const scrollProgress = Math.max(0, topStickyOffset - rect.top);
        let progress = scrollProgress / (scrollLength || 1);
        progress = Math.min(Math.max(progress, 0), 1);

        // Gate the start with cardPinned
        if (!startedRef.current) {
          if (cardPinned) {
            startedRef.current = true;
          } else {
            progress = 0;
          }
        }

        setOffset(progress * scrollLength);
      });
    };
    
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [scrollLength, cardPinned, topStickyOffset]);

  return (
    <section id="experience" className="mt-24">
      <h2 className="mb-6 font-kumbh text-2xl font-semibold tracking-tight text-white/90">
        My Experience
      </h2>
      {/* Tall section to allow the sticky timeline to play through all entries */}
      <div
        ref={sectionRef}
        style={{ height: containerH + scrollLength }}
      >
        {/* Sticky viewport that stays fixed until we've scrolled through the whole list */}
        <div className="sticky" style={{ top: topStickyOffset, height: containerH }}>
          <div className="relative h-full">
            {/* Fixed vertical line */}
            <div className="absolute left-3 top-0 bottom-0 w-px bg-white/20" />

            {/* Moving items along the fixed line */}
             {items.map((it, idx) => {
               const y = topPadding + idx * itemSpacing - offset;

               // Smooth fade at edges with proper visibility range
                const topFadeZone = 40; // smaller fade zone at top
                const bottomFadeZone = 60; // larger fade zone at bottom
                let opacity = 1;
                
                // Fade in from top (reduced zone)
                if (y < topFadeZone) {
                  opacity = Math.max(0, y / topFadeZone);
                }
                
                // Fade out at bottom (starts earlier)
                const bottomFadeStart = containerH - bottomFadeZone - cardHeight;
                if (y > bottomFadeStart) {
                  opacity = Math.max(0, (containerH - cardHeight - y) / bottomFadeZone);
                }
                
                // Hide items that are completely outside the viewport
                if (y < -cardHeight || y > containerH + cardHeight) {
                  opacity = 0;
                }

               return (
                 <div
                   key={idx}
                   className="absolute inset-x-0 will-change-transform"
                   style={{ transform: `translateY(${y}px)`, opacity }}
                 >
                   <div className="relative pl-12">
                     {/* Circle that rides the line */}
                     <span className="absolute left-[6px] top-4 h-3 w-3 rounded-full bg-white ring-2 ring-[#08233B]" />

                     {/* Card with experience info */}
                     <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur-sm">
                       <p className="text-xs uppercase tracking-wide text-neutral-300">{it.company}</p>
                       <h3 className="mt-1 font-kumbh text-2xl text-white">{it.role}</h3>
                       <p className="mt-1 text-sm text-neutral-300">{it.time}</p>
                     </div>
                   </div>
                 </div>
               );
             })}
          </div>
        </div>
      </div>
    </section>
  );
}
