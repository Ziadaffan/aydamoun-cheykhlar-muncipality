'use client';

import { TFunction } from 'i18next';
import { CldImage } from 'next-cloudinary';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HOME_SLIDES } from '../slides';

type HomeHeaderSectionProps = {
  t: TFunction<'translation', undefined>;
};

const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD_PX = 40;

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reduced;
}

/** A chevron pointing toward the inline end ("next"); `back` points it toward the start. */
function Chevron({ back = false }: { back?: boolean }) {
  return (
    <svg className={`h-6 w-6 ${back ? 'ltr:-scale-x-100' : 'rtl:-scale-x-100'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

/**
 * The home header: a slideshow of village pictures with a caption each, like the app's HeroSlider.
 * Autoplays every 5s and pauses on hover, on keyboard focus, while the tab is hidden, with
 * reduced motion, or from the pause button. Arrows, swipes and arrow keys follow the reading direction.
 */
export default function HomeHeaderSection({ t }: HomeHeaderSectionProps) {
  const { i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';
  const total = HOME_SLIDES.length;

  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const touchStartX = useRef<number | null>(null);

  const goNext = useCallback(() => setIndex(i => (i + 1) % total), [total]);
  const goPrev = useCallback(() => setIndex(i => (i - 1 + total) % total), [total]);

  useEffect(() => {
    const update = () => setTabHidden(document.visibilityState === 'hidden');
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  const autoplay = !userPaused && !reducedMotion;
  const running = autoplay && !hovered && !focused && !tabHidden;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(goNext, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [running, index, goNext]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    // In RTL the next slide lies to the left.
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const forward = (e.key === 'ArrowRight') !== isRtl;
      if (forward) goNext();
      else goPrev();
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    const end = e.changedTouches[0]?.clientX;
    if (start === null || end === undefined) return;
    const dx = end - start;
    if (Math.abs(dx) < SWIPE_THRESHOLD_PX) return;
    // Swiping against the reading direction brings in the next slide.
    const forward = isRtl ? dx > 0 : dx < 0;
    if (forward) goNext();
    else goPrev();
  };

  const onBlur = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
  };

  const controlClass =
    'flex cursor-pointer items-center justify-center rounded-full bg-black/35 text-on-image transition hover:bg-black/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-white';
  const arrowClass = `${controlClass} absolute top-1/2 z-20 h-11 w-11 -translate-y-1/2`;

  return (
    <section
      className="relative h-[500px] w-full overflow-hidden bg-gray-800"
      aria-roledescription="carousel"
      aria-label={t('home.hero.carouselLabel')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div aria-live={running ? 'off' : 'polite'} className="h-full w-full">
        {HOME_SLIDES.map((slide, i) => {
          const active = i === index;
          const Heading = i === 0 ? 'h1' : 'h2';
          return (
            <div
              key={slide.key}
              role="group"
              aria-roledescription="slide"
              aria-label={t('home.hero.slideLabel', { current: i + 1, total })}
              aria-hidden={!active}
              inert={!active}
              className={`absolute inset-0 ${reducedMotion ? '' : 'transition-opacity duration-700 ease-in-out'} ${
                active ? 'z-10 opacity-100' : 'z-0 opacity-0'
              }`}
            >
              <CldImage src={slide.image} alt="" fill sizes="100vw" priority={i === 0} className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />
              <div className="text-on-image relative z-10 flex h-full items-center justify-center px-16 text-center md:px-24">
                <div className="max-w-4xl">
                  <Heading className="mb-5 text-3xl leading-tight font-bold drop-shadow md:text-5xl">
                    {t(`home.hero.slides.${slide.key}.title`)}
                  </Heading>
                  <p className="text-lg opacity-95 drop-shadow md:text-2xl">{t(`home.hero.slides.${slide.key}.subtitle`)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* "Previous" sits at the inline start and points toward it: left in LTR, right in RTL. */}
      <button type="button" onClick={goPrev} className={`${arrowClass} start-3 md:start-6`} aria-label={t('home.hero.previous')}>
        <Chevron back />
      </button>
      <button type="button" onClick={goNext} className={`${arrowClass} end-3 md:end-6`} aria-label={t('home.hero.next')}>
        <Chevron />
      </button>

      <div className="absolute inset-x-0 bottom-5 z-20 flex items-center justify-center gap-3">
        {!reducedMotion && (
          <button
            type="button"
            onClick={() => setUserPaused(p => !p)}
            className={`${controlClass} h-8 w-8`}
            aria-label={userPaused ? t('home.hero.play') : t('home.hero.pause')}
          >
            {userPaused ? (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M7 5h3v14H7zM14 5h3v14h-3z" />
              </svg>
            )}
          </button>
        )}
        <div className="flex items-center gap-1">
          {HOME_SLIDES.map((slide, i) => (
            <button
              key={slide.key}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={t('home.hero.goTo', { index: i + 1 })}
              aria-current={i === index ? 'true' : undefined}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span className={`block h-2.5 rounded-full shadow transition-all ${i === index ? 'w-6 bg-on-image' : 'w-2.5 bg-on-image/60'}`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
