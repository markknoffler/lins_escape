import type { SceneConfig } from '../types';

export const SCENES: SceneConfig[] = [
  {
    id: 'cafe',
    name: 'Cozy CLOY & Goblin Café',
    subtitle: 'Warm lights, gentle rain, fresh chai & bottomless coffee',
    bgImage: '/assets/cozy_cafe.jpg',
    ambientType: 'cafe',
    themeColor: '#d97706',
    tagline: 'No 8:00 AM hospital postings allowed past this door.',
    details: 'A hidden sanctuary where medical ward duties do not exist and warm coffee is always brewing.'
  },
  {
    id: 'beach',
    name: 'Sunset Ocean Shore',
    subtitle: 'Pastel golden hour, origami boats & gentle tides',
    bgImage: '/assets/sunset_beach.jpg',
    ambientType: 'waves',
    themeColor: '#f97316',
    tagline: 'Watch your worries sail away into the sunset.',
    details: 'Calm ocean breeze, soft sand, and a quiet shoreline with zero clinical rounds for 5,000 miles.'
  },
  {
    id: 'mountains',
    name: 'Umrangso & Karbi Starlit Peak',
    subtitle: 'Turquoise lake breeze, campfire & whispering pines',
    bgImage: '/assets/starry_mountain.jpg',
    ambientType: 'fire',
    themeColor: '#10b981',
    tagline: 'Fresh mountain air, crackling warmth, zero hostel rules.',
    details: 'Under the starlit sky overlooking Umrangso and Karbi Anglong, where the hills roll into crystal waters and festival songs echo.'
  },
  {
    id: 'night_city',
    name: 'Midnight Neon Seoul',
    subtitle: 'Rainy streetlights, late-night momos, ramyeon & soft lo-fi',
    bgImage: '/assets/night_city.jpg',
    ambientType: 'city',
    themeColor: '#ec4899',
    tagline: 'A peaceful night stroll with no alarm clocks waiting.',
    details: 'Puddle reflections, umbrella rain, and a cozy noodle corner playing soft acoustic covers on loop.'
  },
  {
    id: 'blossom_meadow',
    name: 'Blossom & Melody Meadow',
    subtitle: 'Rolling green hills, acoustic guitar & colorful crochet yarn',
    bgImage: '/assets/scenes/scenary_6.png',
    ambientType: 'wind',
    themeColor: '#8b5cf6',
    tagline: 'Where you can sing just for yourself and let art bloom freely.',
    details: 'Sunlit wildflowers, floating petals, a quiet guitar, and soft yarn waiting for creative hands.'
  }
];

