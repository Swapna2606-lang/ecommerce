import { Product, ProductCategory, UserPersona, RatingMatrix } from '../types/recsys';

export const ALL_TAGS = [
  'audiophile',
  'noise_cancelling',
  'wireless',
  'mechanical',
  'aluminum',
  'ergonomic',
  'lumbar_support',
  'mesh',
  'specialty_coffee',
  'ceramic',
  'pour_over',
  'smart_home',
  'lighting',
  'minimalist',
  'desk_setup',
  'sustainable',
  'leather',
  'usb_c',
  'bluetooth',
  'hifi'
] as const;

export const CATEGORIES: ProductCategory[] = [
  'Audio',
  'Workspace',
  'Coffee & Kitchen',
  'Ergonomics',
  'Smart Living',
  'Accessories'
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    name: 'AURA Planar Studio Headphones',
    category: 'Audio',
    price: 389,
    rating: 4.8,
    reviewsCount: 142,
    shortDesc: 'Open-back planar magnetic headphones for critical acoustic monitoring.',
    description: 'Precision-machined open-back planar magnetic headphones featuring 90mm ultra-thin diaphragms, genuine sheepskin earcups, and pure copper balanced cable. Designed for master sound engineering and uncompromising audiophiles.',
    tags: ['audiophile', 'hifi', 'aluminum', 'minimalist'],
    brand: 'AURA Acoustic',
    specs: {
      'Transducer': '90mm Planar Magnetic',
      'Frequency': '10Hz – 48kHz',
      'Impedance': '32 Ohms',
      'Weight': '395g'
    },
    accentColor: '#6366F1', // indigo
    bgGradient: 'from-slate-900 to-indigo-950',
    iconName: 'Headphones',
    features: {
      categoryWeight: { 'Audio': 1.0, 'Workspace': 0.3, 'Coffee & Kitchen': 0.0, 'Ergonomics': 0.1, 'Smart Living': 0.0, 'Accessories': 0.2 },
      priceNormalized: 0.78,
      tagsVector: { 'audiophile': 1.0, 'hifi': 1.0, 'aluminum': 0.8, 'minimalist': 0.7, 'wireless': 0.0 },
      styleVector: { minimalist: 0.9, technical: 0.95, artisanal: 0.7, luxury: 0.85, ergonomic: 0.6 }
    }
  },
  {
    id: 'prod-02',
    name: 'Sonosfera ANC Wireless Earbuds',
    category: 'Audio',
    price: 199,
    rating: 4.6,
    reviewsCount: 310,
    shortDesc: 'Hybrid active noise cancelling wireless earbuds with spatial audio.',
    description: 'Ultra-compact earbuds with 4-microphone hybrid active noise cancellation, transparency mode, Qi wireless charging, and 32 hours total playback with charging case.',
    tags: ['audiophile', 'noise_cancelling', 'wireless', 'bluetooth', 'usb_c'],
    brand: 'AURA Acoustic',
    specs: {
      'Battery Life': '8h + 24h case',
      'Drivers': '11mm Beryllium',
      'Waterproof': 'IPX5',
      'Charging': 'Qi Wireless + USB-C'
    },
    accentColor: '#3B82F6', // blue
    bgGradient: 'from-slate-900 to-blue-950',
    iconName: 'Radio',
    features: {
      categoryWeight: { 'Audio': 1.0, 'Workspace': 0.4, 'Coffee & Kitchen': 0.0, 'Ergonomics': 0.2, 'Smart Living': 0.3, 'Accessories': 0.3 },
      priceNormalized: 0.40,
      tagsVector: { 'noise_cancelling': 1.0, 'wireless': 1.0, 'bluetooth': 1.0, 'usb_c': 0.9, 'audiophile': 0.6 },
      styleVector: { minimalist: 0.85, technical: 0.8, artisanal: 0.2, luxury: 0.6, ergonomic: 0.75 }
    }
  },
  {
    id: 'prod-03',
    name: 'K65 CNC Low-Profile Mechanical Keyboard',
    category: 'Workspace',
    price: 219,
    rating: 4.9,
    reviewsCount: 228,
    shortDesc: '65% layout CNC anodized aluminum frame with hot-swappable switches.',
    description: 'Machined from solid 6063 aerospace aluminum with gasket mount suspension, sound-dampening poron foam, hot-swappable tactile switches, and dye-sub PBT keycaps.',
    tags: ['mechanical', 'aluminum', 'desk_setup', 'minimalist', 'wireless'],
    brand: 'Keycraft Lab',
    specs: {
      'Layout': '65% Compact (68 keys)',
      'Connectivity': 'Tri-mode (2.4G / BT 5.2 / USB-C)',
      'Mount': 'Gasket Dampened',
      'Chassis': 'CNC Anodized 6063 Aluminum'
    },
    accentColor: '#10B981', // emerald
    bgGradient: 'from-slate-900 to-emerald-950',
    iconName: 'Keyboard',
    features: {
      categoryWeight: { 'Audio': 0.0, 'Workspace': 1.0, 'Coffee & Kitchen': 0.0, 'Ergonomics': 0.4, 'Smart Living': 0.1, 'Accessories': 0.4 },
      priceNormalized: 0.44,
      tagsVector: { 'mechanical': 1.0, 'aluminum': 0.9, 'desk_setup': 1.0, 'minimalist': 0.9, 'wireless': 0.8 },
      styleVector: { minimalist: 0.95, technical: 0.9, artisanal: 0.6, luxury: 0.7, ergonomic: 0.6 }
    }
  },
  {
    id: 'prod-04',
    name: 'Apex Pro Ergonomic Mesh Task Chair',
    category: 'Ergonomics',
    price: 680,
    rating: 4.7,
    reviewsCount: 189,
    shortDesc: 'Adaptive self-calibrating lumbar support with breathable elastomeric mesh.',
    description: 'Medical-grade ergonomic task chair featuring 4D multi-directional armrests, dynamic sync-tilt mechanism, forward posture tilt, and pressure-distributing German woven mesh.',
    tags: ['ergonomic', 'lumbar_support', 'mesh', 'desk_setup'],
    brand: 'ErgoForm Design',
    specs: {
      'Weight Capacity': '160 kg (350 lbs)',
      'Adjustability': '4D Armrests, Lumbar, Seat Depth',
      'Material': 'Elastomeric Monofilament Mesh',
      'Warranty': '12 Years Commercial'
    },
    accentColor: '#F59E0B', // amber
    bgGradient: 'from-slate-900 to-amber-950',
    iconName: 'Armchair',
    features: {
      categoryWeight: { 'Audio': 0.0, 'Workspace': 0.7, 'Coffee & Kitchen': 0.0, 'Ergonomics': 1.0, 'Smart Living': 0.0, 'Accessories': 0.1 },
      priceNormalized: 1.0,
      tagsVector: { 'ergonomic': 1.0, 'lumbar_support': 1.0, 'mesh': 1.0, 'desk_setup': 0.9 },
      styleVector: { minimalist: 0.7, technical: 0.9, artisanal: 0.1, luxury: 0.9, ergonomic: 1.0 }
    }
  },
  {
    id: 'prod-05',
    name: 'Kuro Artisan Ceramic Pour-Over Dripper',
    category: 'Coffee & Kitchen',
    price: 64,
    rating: 4.9,
    reviewsCount: 412,
    shortDesc: 'Handcrafted stoneware ceramic dripper with spiral extraction ribs.',
    description: 'Slip-cast by master artisans in Hasami, Japan. Features internal spiral ridges calibrated to balance brew contact time with clean sweetness extraction.',
    tags: ['specialty_coffee', 'ceramic', 'pour_over', 'artisanal', 'minimalist'],
    brand: 'Kuro Kilns',
    specs: {
      'Material': 'Hasami Stoneware Ceramic',
      'Capacity': '1-4 Cups (02 size)',
      'Thermal Mass': 'High Retention Clay',
      'Origin': 'Nagasaki, Japan'
    },
    accentColor: '#D97706', // warm amber/brown
    bgGradient: 'from-stone-900 to-amber-950',
    iconName: 'Coffee',
    features: {
      categoryWeight: { 'Audio': 0.0, 'Workspace': 0.2, 'Coffee & Kitchen': 1.0, 'Ergonomics': 0.0, 'Smart Living': 0.0, 'Accessories': 0.2 },
      priceNormalized: 0.13,
      tagsVector: { 'specialty_coffee': 1.0, 'ceramic': 1.0, 'pour_over': 1.0, 'minimalist': 0.8 },
      styleVector: { minimalist: 0.9, technical: 0.3, artisanal: 1.0, luxury: 0.6, ergonomic: 0.2 }
    }
  },
  {
    id: 'prod-06',
    name: 'Strix Precision Variable Temp Gooseneck Kettle',
    category: 'Coffee & Kitchen',
    price: 159,
    rating: 4.8,
    reviewsCount: 275,
    shortDesc: 'Digital PID temperature control with counterbalanced ergonomic handle.',
    description: 'Professional 0.9L electric pouring kettle with 1-degree temperature regulation, LCD display, built-in brew stopwatch, and an ultra-precise slow-pour spout.',
    tags: ['specialty_coffee', 'pour_over', 'minimalist', 'ergonomic'],
    brand: 'Strix Brew Lab',
    specs: {
      'Capacity': '0.9 Liters',
      'Power': '1200W Rapid Heating',
      'Accuracy': '±0.5°C PID Microcontroller',
      'Hold Time': '60 Minutes Auto-Maintain'
    },
    accentColor: '#EA580C', // orange
    bgGradient: 'from-slate-900 to-orange-950',
    iconName: 'Flame',
    features: {
      categoryWeight: { 'Audio': 0.0, 'Workspace': 0.1, 'Coffee & Kitchen': 1.0, 'Ergonomics': 0.3, 'Smart Living': 0.4, 'Accessories': 0.2 },
      priceNormalized: 0.32,
      tagsVector: { 'specialty_coffee': 1.0, 'pour_over': 0.9, 'minimalist': 0.8, 'ergonomic': 0.5 },
      styleVector: { minimalist: 0.85, technical: 0.85, artisanal: 0.8, luxury: 0.7, ergonomic: 0.65 }
    }
  },
  {
    id: 'prod-07',
    name: 'Linear Monolith Desk Shelf & Riser',
    category: 'Workspace',
    price: 145,
    rating: 4.7,
    reviewsCount: 164,
    shortDesc: 'Solid American walnut dual-monitor shelf with aluminum storage tray.',
    description: 'Elevates your displays to ergonomic eye level while expanding desk storage. Hand-finished walnut hardwood with bead-blasted aluminum shelf dividers and cork feet.',
    tags: ['desk_setup', 'minimalist', 'aluminum', 'ergonomic', 'sustainable'],
    brand: 'Grove & Form',
    specs: {
      'Dimensions': '115cm x 23cm x 11cm',
      'Capacity': 'Supports up to 45 kg',
      'Materials': 'American Walnut + 5052 Aluminum',
      'Finish': 'Natural Matte Hardwax Oil'
    },
    accentColor: '#854D0E', // walnut amber
    bgGradient: 'from-stone-900 to-stone-950',
    iconName: 'LayoutGrid',
    features: {
      categoryWeight: { 'Audio': 0.1, 'Workspace': 1.0, 'Coffee & Kitchen': 0.0, 'Ergonomics': 0.7, 'Smart Living': 0.0, 'Accessories': 0.5 },
      priceNormalized: 0.29,
      tagsVector: { 'desk_setup': 1.0, 'minimalist': 1.0, 'aluminum': 0.7, 'ergonomic': 0.8, 'sustainable': 0.8 },
      styleVector: { minimalist: 0.95, technical: 0.4, artisanal: 0.9, luxury: 0.8, ergonomic: 0.8 }
    }
  },
  {
    id: 'prod-08',
    name: 'Lumen Architectural Task Bar & Dial',
    category: 'Smart Living',
    price: 175,
    rating: 4.9,
    reviewsCount: 340,
    shortDesc: 'Screen glare-free monitor lightbar with wireless rotary controller.',
    description: 'Asymmetric optical lightbar that illuminates your desk workspace without bouncing light or glare off glass monitors. Features wireless magnetic rotary dial for stepless dimming and warm-to-cool Kelvin transitions.',
    tags: ['lighting', 'smart_home', 'desk_setup', 'minimalist', 'aluminum'],
    brand: 'Lumen Studio',
    specs: {
      'CRI Rating': 'Ra ≥ 97 High Color Accuracy',
      'Color Temp': '2700K – 6500K Stepless',
      'Controls': '2.4G Wireless Weighted Rotary Dial',
      'Mount': 'Universal Weighted Counter-Clamp'
    },
    accentColor: '#FBBF24', // golden yellow
    bgGradient: 'from-slate-900 to-yellow-950',
    iconName: 'Sun',
    features: {
      categoryWeight: { 'Audio': 0.1, 'Workspace': 0.9, 'Coffee & Kitchen': 0.0, 'Ergonomics': 0.6, 'Smart Living': 1.0, 'Accessories': 0.4 },
      priceNormalized: 0.35,
      tagsVector: { 'lighting': 1.0, 'smart_home': 0.9, 'desk_setup': 0.95, 'minimalist': 0.9, 'aluminum': 0.8 },
      styleVector: { minimalist: 0.95, technical: 0.9, artisanal: 0.3, luxury: 0.75, ergonomic: 0.7 }
    }
  },
  {
    id: 'prod-09',
    name: 'Acoustic Wool Modular Felt Wall Tiles (Pack of 8)',
    category: 'Audio',
    price: 120,
    rating: 4.5,
    reviewsCount: 96,
    shortDesc: 'High-density compressed recycled PET acoustic treatment panels.',
    description: 'Reduces room flutter echo, vocal reverberation, and high-frequency reflections. Geometric beveled edge panels with magnetic wall mount template.',
    tags: ['audiophile', 'desk_setup', 'sustainable', 'minimalist'],
    brand: 'AURA Acoustic',
    specs: {
      'NRC Rating': '0.85 (Noise Reduction Coeff)',
      'Thickness': '12mm High Density Felt',
      'Mounting': 'Non-damaging Magnetic Strips',
      'Safety': 'Class A Fire Rated'
    },
    accentColor: '#64748B', // slate
    bgGradient: 'from-slate-900 to-slate-950',
    iconName: 'Layers',
    features: {
      categoryWeight: { 'Audio': 0.9, 'Workspace': 0.8, 'Coffee & Kitchen': 0.0, 'Ergonomics': 0.2, 'Smart Living': 0.4, 'Accessories': 0.4 },
      priceNormalized: 0.24,
      tagsVector: { 'audiophile': 0.9, 'desk_setup': 0.8, 'sustainable': 0.9, 'minimalist': 0.85 },
      styleVector: { minimalist: 0.9, technical: 0.85, artisanal: 0.5, luxury: 0.5, ergonomic: 0.4 }
    }
  },
  {
    id: 'prod-10',
    name: 'Atlas Dual-Pneumatic Standing Desk (Solid Oak)',
    category: 'Ergonomics',
    price: 890,
    rating: 4.9,
    reviewsCount: 156,
    shortDesc: 'Zero-wobble dual-motor sit-stand desk with anti-collision gyro sensor.',
    description: 'Commercial 3-stage telescoping steel frame lifting a 32mm solid white oak butcher block desktop. Digital touch keypad with 4 memory presets and under-desk cable management raceway.',
    tags: ['ergonomic', 'desk_setup', 'sustainable', 'minimalist'],
    brand: 'ErgoForm Design',
    specs: {
      'Height Range': '62cm – 128cm',
      'Dual Motors': '38mm/s speed, <45dB',
      'Load Rating': '140 kg (308 lbs)',
      'Desktop': '160cm x 80cm Solid White Oak'
    },
    accentColor: '#14B8A6', // teal
    bgGradient: 'from-slate-900 to-teal-950',
    iconName: 'Maximize2',
    features: {
      categoryWeight: { 'Audio': 0.0, 'Workspace': 0.9, 'Coffee & Kitchen': 0.0, 'Ergonomics': 1.0, 'Smart Living': 0.3, 'Accessories': 0.1 },
      priceNormalized: 1.0,
      tagsVector: { 'ergonomic': 1.0, 'desk_setup': 1.0, 'sustainable': 0.8, 'minimalist': 0.9 },
      styleVector: { minimalist: 0.85, technical: 0.9, artisanal: 0.7, luxury: 0.95, ergonomic: 1.0 }
    }
  },
  {
    id: 'prod-11',
    name: 'AURA SoundStage Balanced DAC & Amp',
    category: 'Audio',
    price: 340,
    rating: 4.8,
    reviewsCount: 112,
    shortDesc: 'Dual ESS Sabre ES9038Q2M digital-to-analog converter with 4.4mm balanced out.',
    description: 'Audiophile desktop DAC delivering pristine transparency, ultra-low THD+N distortion (<0.0001%), and ample power to effortlessly drive demanding planar headphones.',
    tags: ['audiophile', 'hifi', 'aluminum', 'desk_setup', 'usb_c'],
    brand: 'AURA Acoustic',
    specs: {
      'DAC Chip': 'Dual ESS Sabre ES9038Q2M',
      'Decoding': 'PCM 32-bit/768kHz, Native DSD512',
      'Output': '4.4mm Balanced + 6.35mm SE',
      'Power': '3200mW @ 32 Ohms'
    },
    accentColor: '#8B5CF6', // purple
    bgGradient: 'from-slate-900 to-purple-950',
    iconName: 'Sliders',
    features: {
      categoryWeight: { 'Audio': 1.0, 'Workspace': 0.6, 'Coffee & Kitchen': 0.0, 'Ergonomics': 0.1, 'Smart Living': 0.2, 'Accessories': 0.3 },
      priceNormalized: 0.68,
      tagsVector: { 'audiophile': 1.0, 'hifi': 1.0, 'aluminum': 0.8, 'desk_setup': 0.85, 'usb_c': 0.9 },
      styleVector: { minimalist: 0.9, technical: 1.0, artisanal: 0.4, luxury: 0.85, ergonomic: 0.4 }
    }
  },
  {
    id: 'prod-12',
    name: 'Precision Scale 0.1g Timer for Espresso & Drip',
    category: 'Coffee & Kitchen',
    price: 78,
    rating: 4.7,
    reviewsCount: 204,
    shortDesc: 'Ultra-fast 20ms response coffee scale with flow-rate indicator.',
    description: 'Designed for barista-level brew consistency. Features auto-tare on cup placement, auto-timer on first liquid drop, real-time gram-per-second flow meter, and water-resistant silicon mat.',
    tags: ['specialty_coffee', 'pour_over', 'minimalist', 'usb_c'],
    brand: 'Strix Brew Lab',
    specs: {
      'Precision': '0.1g increments (0.5g – 2000g)',
      'Response Time': '20 milliseconds',
      'Battery': 'Li-ion Rechargeable USB-C (30h)',
      'Features': 'Auto-Timer, Flow-Rate Graph'
    },
    accentColor: '#F97316', // bright orange
    bgGradient: 'from-stone-900 to-orange-950',
    iconName: 'Activity',
    features: {
      categoryWeight: { 'Audio': 0.0, 'Workspace': 0.0, 'Coffee & Kitchen': 1.0, 'Ergonomics': 0.2, 'Smart Living': 0.3, 'Accessories': 0.2 },
      priceNormalized: 0.16,
      tagsVector: { 'specialty_coffee': 1.0, 'pour_over': 0.9, 'minimalist': 0.85, 'usb_c': 0.8 },
      styleVector: { minimalist: 0.95, technical: 0.9, artisanal: 0.7, luxury: 0.5, ergonomic: 0.5 }
    }
  },
  {
    id: 'prod-13',
    name: 'Saddle Horween Leather Desk Pad',
    category: 'Accessories',
    price: 88,
    rating: 4.8,
    reviewsCount: 318,
    shortDesc: 'Full-grain vegetable-tanned leather desk mat that patinas beautifully.',
    description: 'Cut from legendary Horween Chromexcel leather with hand-burnished edges and natural suede backing. Protects desk surfaces while providing a luxurious glide for mouse and keyboard.',
    tags: ['leather', 'desk_setup', 'minimalist', 'sustainable'],
    brand: 'Grove & Form',
    specs: {
      'Dimensions': '90cm x 40cm x 3.5mm',
      'Tannage': 'Vegetable Wax Infused',
      'Leather Grade': 'Top Grain Horween USA',
      'Backing': 'Non-slip Raw Suede'
    },
    accentColor: '#B45309', // saddle leather
    bgGradient: 'from-amber-950 to-stone-950',
    iconName: 'Square',
    features: {
      categoryWeight: { 'Audio': 0.1, 'Workspace': 0.8, 'Coffee & Kitchen': 0.0, 'Ergonomics': 0.3, 'Smart Living': 0.0, 'Accessories': 1.0 },
      priceNormalized: 0.18,
      tagsVector: { 'leather': 1.0, 'desk_setup': 0.9, 'minimalist': 0.9, 'sustainable': 0.7 },
      styleVector: { minimalist: 0.9, technical: 0.2, artisanal: 1.0, luxury: 0.85, ergonomic: 0.4 }
    }
  },
  {
    id: 'prod-14',
    name: 'Silicone Vertical Laptop & Tablet Stand',
    category: 'Accessories',
    price: 49,
    rating: 4.6,
    reviewsCount: 177,
    shortDesc: 'Weighted gravity-clamp vertical dock for clamshell workstation setups.',
    description: 'Clears up to 80% desk surface area when connecting laptops to external monitors. Weighted zinc alloy base with scratch-proof silicone interior padding.',
    tags: ['desk_setup', 'aluminum', 'minimalist'],
    brand: 'Keycraft Lab',
    specs: {
      'Weight': '620g anti-tip base',
      'Compatibility': 'Laptops from 13mm to 35mm',
      'Finish': 'Sandblasted Space Gray',
      'Protection': '360° Non-abrasive Silicone'
    },
    accentColor: '#6B7280', // cool gray
    bgGradient: 'from-slate-900 to-slate-950',
    iconName: 'Laptop',
    features: {
      categoryWeight: { 'Audio': 0.0, 'Workspace': 0.8, 'Coffee & Kitchen': 0.0, 'Ergonomics': 0.4, 'Smart Living': 0.0, 'Accessories': 1.0 },
      priceNormalized: 0.10,
      tagsVector: { 'desk_setup': 0.9, 'aluminum': 0.8, 'minimalist': 0.9 },
      styleVector: { minimalist: 0.95, technical: 0.7, artisanal: 0.3, luxury: 0.5, ergonomic: 0.5 }
    }
  },
  {
    id: 'prod-15',
    name: 'ErgoWave Contour Memory Foam Wrist Rest',
    category: 'Ergonomics',
    price: 36,
    rating: 4.7,
    reviewsCount: 285,
    shortDesc: 'Cooling-gel infused high-resilience ergonomic wrist rest for mechanical keyboards.',
    description: 'Engineered to keep carpal tunnels in neutral alignment during extended typing sessions. Breathable lycra fabric cover over anti-fatigue slow-rebound foam.',
    tags: ['ergonomic', 'desk_setup', 'mechanical'],
    brand: 'ErgoForm Design',
    specs: {
      'Incline': '8° optimal ergonomic pitch',
      'Length': '36cm (tenkeyless/65% match)',
      'Core': 'Cooling-gel slow recovery memory foam',
      'Base': 'Textured non-skid rubber'
    },
    accentColor: '#06B6D4', // cyan
    bgGradient: 'from-slate-900 to-cyan-950',
    iconName: 'Shield',
    features: {
      categoryWeight: { 'Audio': 0.0, 'Workspace': 0.7, 'Coffee & Kitchen': 0.0, 'Ergonomics': 1.0, 'Smart Living': 0.0, 'Accessories': 0.7 },
      priceNormalized: 0.07,
      tagsVector: { 'ergonomic': 1.0, 'desk_setup': 0.8, 'mechanical': 0.7 },
      styleVector: { minimalist: 0.8, technical: 0.75, artisanal: 0.2, luxury: 0.4, ergonomic: 1.0 }
    }
  },
  {
    id: 'prod-16',
    name: 'AURA Sphere Ambient Smart Lamp',
    category: 'Smart Living',
    price: 130,
    rating: 4.8,
    reviewsCount: 153,
    shortDesc: 'Mouth-blown frosted glass orb with circadian biorhythm circadian transitions.',
    description: 'Synchronizes with local daylight cycles to promote natural melatonin production in evening hours. Supports Apple HomeKit, Matter, and local Matter-over-Thread mesh networking.',
    tags: ['lighting', 'smart_home', 'minimalist'],
    brand: 'Lumen Studio',
    specs: {
      'Globe Material': 'Opaline Matte Blown Glass',
      'Connectivity': 'Matter over Thread / Wi-Fi',
      'Luminance': '800 Lumens (CRI 95+)',
      'Presets': 'Sunrise, Focus, Golden Hour, Moonlight'
    },
    accentColor: '#EC4899', // rose pink
    bgGradient: 'from-slate-900 to-rose-950',
    iconName: 'Moon',
    features: {
      categoryWeight: { 'Audio': 0.0, 'Workspace': 0.4, 'Coffee & Kitchen': 0.0, 'Ergonomics': 0.4, 'Smart Living': 1.0, 'Accessories': 0.2 },
      priceNormalized: 0.26,
      tagsVector: { 'lighting': 1.0, 'smart_home': 1.0, 'minimalist': 0.9 },
      styleVector: { minimalist: 0.95, technical: 0.7, artisanal: 0.7, luxury: 0.7, ergonomic: 0.5 }
    }
  }
];

export const INITIAL_USERS: UserPersona[] = [
  {
    id: 'user-01',
    name: 'Alex Rivers',
    title: 'Acoustic Sound Designer & Audiophile',
    avatarSeed: 'alex',
    bio: 'Critical sound mixer and vintage vinyl collector obsessed with acoustic resolution, planar diaphragms, and DAC low-distortion playback.',
    preferredCategories: ['Audio', 'Workspace'],
    priceSensitivity: 'premium'
  },
  {
    id: 'user-02',
    name: 'Dr. Sarah Chen',
    title: 'Senior Researcher & Ergonomics Advocate',
    avatarSeed: 'sarah',
    bio: 'Spends 10+ hours daily analyzing clinical trial datasets. Committed to spinal health, active posture adjustments, and premium mechanical keyboards.',
    preferredCategories: ['Ergonomics', 'Workspace'],
    priceSensitivity: 'premium'
  },
  {
    id: 'user-03',
    name: 'Marcus Vance',
    title: 'Specialty Coffee Roaster & Barista',
    avatarSeed: 'marcus',
    bio: 'Runs a micro-batch specialty roastery. Focuses on extraction yield, water mineral composition, and tactile morning kitchen rituals.',
    preferredCategories: ['Coffee & Kitchen', 'Accessories'],
    priceSensitivity: 'balanced'
  },
  {
    id: 'user-04',
    name: 'Elena Rostova',
    title: 'Architect & Minimalist Curator',
    avatarSeed: 'elena',
    bio: 'Passionate about Scandinavian interior principles, uncluttered workspace organization, warm architectural illumination, and fine natural leather.',
    preferredCategories: ['Workspace', 'Smart Living', 'Accessories'],
    priceSensitivity: 'balanced'
  },
  {
    id: 'user-05',
    name: 'David Kim',
    title: 'Software Architect & Custom Keyboardist',
    avatarSeed: 'david',
    bio: 'Mechanical keyboard enthusiast, dark mode devotee, and smart home automation tinkerer looking for high-productivity desk gear.',
    preferredCategories: ['Workspace', 'Audio', 'Smart Living'],
    priceSensitivity: 'balanced'
  },
  {
    id: 'user-06',
    name: 'Guest / New Visitor',
    title: 'Cold-Start Anonymous Persona',
    avatarSeed: 'guest',
    bio: 'Brand new visitor with zero prior purchase or rating history. Serves as the real-time testbed for Cold-Start fallback strategies.',
    preferredCategories: [],
    priceSensitivity: 'balanced',
    isColdStart: true
  }
];

// Pre-seeded explicit rating matrix (1-5 stars) reflecting authentic behavioral clusters:
// User 1 loves Audio (5 stars on prod-01, prod-11, prod-09)
// User 2 loves Ergonomics & Workspace (5 stars on prod-04, prod-10, prod-03, prod-15)
// User 3 loves Coffee (5 stars on prod-05, prod-06, prod-12)
// User 4 loves Workspace & Smart Living (5 stars on prod-07, prod-08, prod-13, prod-16)
// User 5 bridges Workspace & Audio (5 stars on prod-03, prod-08, prod-02, prod-14)
// User 6 is empty (Cold Start)
export const INITIAL_RATINGS_MATRIX: RatingMatrix = {
  'user-01': {
    'prod-01': 5, // Planar Headphones
    'prod-11': 5, // DAC Amp
    'prod-09': 4, // Acoustic Tiles
    'prod-02': 4, // Earbuds
    'prod-03': 3, // Mechanical keyboard
    'prod-08': 2  // Light bar (less interested in lighting)
  },
  'user-02': {
    'prod-04': 5, // Mesh Chair
    'prod-10': 5, // Standing Desk
    'prod-15': 5, // Wrist Rest
    'prod-03': 4, // Keyboard
    'prod-07': 4, // Monitor Riser
    'prod-01': 2  // Headphone (too heavy for clinical work)
  },
  'user-03': {
    'prod-05': 5, // Ceramic Dripper
    'prod-06': 5, // Gooseneck Kettle
    'prod-12': 5, // Coffee Scale
    'prod-13': 4, // Leather Desk Pad (likes artisanal)
    'prod-08': 3  // Light bar
  },
  'user-04': {
    'prod-07': 5, // Desk Shelf Riser
    'prod-08': 5, // Architectural Task Bar
    'prod-13': 5, // Leather Desk Pad
    'prod-16': 5, // Ambient Sphere Lamp
    'prod-05': 4, // Ceramic Dripper (appreciates craft)
    'prod-14': 4  // Laptop Stand
  },
  'user-05': {
    'prod-03': 5, // Mechanical keyboard
    'prod-08': 4, // Light bar
    'prod-02': 4, // Wireless earbuds
    'prod-14': 5, // Laptop Stand
    'prod-11': 4, // DAC Amp
    'prod-15': 4  // Wrist Rest
  },
  'user-06': {
    // Blank for cold start testing!
  }
};
