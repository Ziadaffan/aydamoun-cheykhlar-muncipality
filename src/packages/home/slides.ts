export interface HeroSlide {
  /** Stable id; also names the slide's caption in the locale files (home.hero.slides.<key>.title / .subtitle). */
  key: string;
  /** Cloudinary public id (folder home-slides; landscape works best, portraits are cropped around their subject). */
  image: string;
}

/**
 * The home header's slides, in order — the same pictures and captions as the app's
 * HeroSlider (features/home/slides.ts). Add or remove entries freely; each needs its
 * captions in public/language/ar.json and en.json under home.hero.slides.
 */
export const HOME_SLIDES: readonly HeroSlide[] = [
  { key: 'village', image: 'home-slides/slide-1' },
  { key: 'sunset', image: 'home-slides/slide-2' },
  { key: 'morning', image: 'home-slides/slide-3' },
];
