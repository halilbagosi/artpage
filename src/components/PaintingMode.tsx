'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import client from '@/lib/tina-client';
import { useLightboxStore } from '@/store/useLightboxStore';

type Painting = {
  id: string;
  title: string;
  image: string;
  month?: string;
  year: string;
  medium: string;
  category: string;
  palette: string;
  style: string;
};

export default function PaintingMode() {
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPalette, setFilterPalette] = useState<string>('all');
  const [filterStyle, setFilterStyle] = useState<string>('all');
  const [aspectRatios, setAspectRatios] = useState<Record<string, number>>({});
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const openLightbox = useLightboxStore((s) => s.open);

  useEffect(() => {
    async function loadPaintings() {
      try {
        const res = await client.queries.paintingConnection();
        const edges = res.data.paintingConnection.edges || [];
        const loadedPaintings = edges.map((edge) => {
          const node = edge?.node;
          return {
            id: node?.id || Math.random().toString(),
            title: node?.title || 'Untitled',
            image: node?.image || '',
            month: node?.month || '',
            year: node?.year || '',
            medium: node?.medium || '',
            category: node?.category || 'all',
            palette: node?.palette || 'all',
            style: node?.style || 'all',
          };
        });
        setPaintings(loadedPaintings);
      } catch (err) {
        console.error("Failed to load paintings from TinaCMS:", err);
      }
    }
    loadPaintings();
  }, []);

  const mockPaintings = [
    { id: '1', title: 'Ethereal Dawn', year: '2024', medium: 'Oil on Canvas', image: '', category: 'landscapes', palette: 'warm', style: 'realism' },
    { id: '2', title: 'Silent Whisper', year: '2023', medium: 'Acrylic & Sand', image: '', category: 'abstract', palette: 'neutral', style: '2d' },
    { id: '3', title: 'Midnight Ochre', month: 'January', year: '2025', medium: 'Oil on Linen', image: '', category: 'portraits', palette: 'cool', style: 'realism' },
    { id: '4', title: 'Crimson Tide', year: '2024', medium: 'Oil on Canvas', image: '', category: 'abstract', palette: 'warm', style: '2d' },
    { id: '5', title: 'Winter Veil', month: 'December', year: '2025', medium: 'Charcoal & Acrylic', image: '', category: 'landscapes', palette: 'cool', style: 'realism' },
  ];

  const displayPaintings = paintings.length > 0 ? paintings : mockPaintings;

  // Load natural aspect ratios for all paintings with images
  useEffect(() => {
    displayPaintings.forEach((painting) => {
      if (painting.image && !aspectRatios[painting.id]) {
        const img = new Image();
        img.onload = () => {
          setAspectRatios((prev) => ({
            ...prev,
            [painting.id]: img.naturalWidth / img.naturalHeight,
          }));
        };
        img.src = painting.image;
      }
    });
  }, [displayPaintings, aspectRatios]);

  const filteredPaintings = displayPaintings
    .filter(p => {
      if (filterCategory !== 'all' && p.category !== filterCategory) return false;
      if (filterPalette !== 'all' && p.palette !== filterPalette) return false;
      if (filterStyle !== 'all' && p.style !== filterStyle) return false;
      return true;
    })
    .sort((a, b) => {
      const getSortValue = (monthStr?: string, yearStr?: string) => {
        const monthMap: Record<string, number> = {
          "January": 0, "February": 1, "March": 2, "April": 3, "May": 4, "June": 5,
          "July": 6, "August": 7, "September": 8, "October": 9, "November": 10, "December": 11
        };
        const yearMatch = yearStr?.match(/\d{4}/);
        const yearNum = yearMatch ? parseInt(yearMatch[0], 10) : 0;
        const monthNum = (monthStr && monthMap[monthStr] !== undefined) ? monthMap[monthStr] : 0;
        return yearNum * 100 + monthNum;
      };

      const valA = getSortValue(a.month, a.year);
      const valB = getSortValue(b.month, b.year);
      
      // If same score, sort by title alphabetically to ensure stable sort
      if (valA === valB) {
        return a.title.localeCompare(b.title);
      }
      return valB - valA;
    });

  const categories = ['all', 'portraits', 'landscapes', 'abstract'];
  const palettes = ['all', 'cool', 'warm', 'neutral'];
  const styles = ['all', 'realism', '2d'];

  return (
    <div className="w-full max-w-7xl mx-auto min-h-full flex flex-col font-serif relative">
      <div className="absolute inset-0 grain opacity-[0.07] mix-blend-multiply pointer-events-none z-0" />
      
      <div className="relative flex flex-col md:flex-row gap-12 mt-12">
        {/* Left Sidebar: Titles and Filters — z-0 so the liquid glass orb floats OVER this */}
        <div className="md:w-1/3 flex flex-col px-4 shrink-0 relative z-0">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl font-light tracking-tighter text-text-primary"
          >
            The <br/> Textured <br/> Gallery.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 mb-12 font-sans text-text-secondary max-w-sm leading-relaxed"
          >
            A tactile exploration of earth, memory, and form. 
            Select pieces from the 2024-2026 archive.
          </motion.p>

          {/* Filters Toggle Button */}
          <button 
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="flex items-center justify-between w-full py-4 border-b border-text-primary/10 md:border-none md:py-0 md:pb-4 text-sm uppercase tracking-widest font-bold text-text-primary"
          >
            <span>Filter Archive</span>
            <motion.div
              animate={{ rotate: isFiltersOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </motion.div>
          </button>

          {/* Filters Content */}
          <div 
            className={`overflow-hidden md:!max-h-none md:!opacity-100 transition-all duration-500 ease-in-out ${
              isFiltersOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="flex flex-col gap-8 pt-6 md:pt-0 font-sans text-sm uppercase tracking-widest text-text-secondary">
              {/* Category Filter */}
                  <div className="flex flex-col gap-3">
                    <span className="font-bold text-text-primary text-xs">Subject</span>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(c => (
                        <button 
                          key={c}
                          onClick={() => setFilterCategory(c)}
                          className={`px-3 py-1 rounded-full border transition-colors ${filterCategory === c ? 'border-text-primary bg-text-primary text-bg-primary' : 'border-text-secondary/30 hover:border-text-primary'}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Palette Filter */}
                  <div className="flex flex-col gap-3">
                    <span className="font-bold text-text-primary text-xs">Palette</span>
                    <div className="flex flex-wrap gap-2">
                      {palettes.map(c => (
                        <button 
                          key={c}
                          onClick={() => setFilterPalette(c)}
                          className={`px-3 py-1 rounded-full border transition-colors ${filterPalette === c ? 'border-text-primary bg-text-primary text-bg-primary' : 'border-text-secondary/30 hover:border-text-primary'}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Style Filter */}
                  <div className="flex flex-col gap-3">
                    <span className="font-bold text-text-primary text-xs">Style</span>
                    <div className="flex flex-wrap gap-2">
                      {styles.map(c => (
                        <button 
                          key={c}
                          onClick={() => setFilterStyle(c)}
                          className={`px-3 py-1 rounded-full border transition-colors ${filterStyle === c ? 'border-text-primary bg-text-primary text-bg-primary' : 'border-text-secondary/30 hover:border-text-primary'}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

        {/* Right Area: Asymmetrical Vertical Grid */}
        <div className="md:w-2/3 flex-1 relative min-h-[60vh] pb-32 z-[2] px-4 md:px-12 flex flex-col gap-24">
          {filteredPaintings.length === 0 && (
            <div className="w-full h-full flex items-center justify-center text-text-secondary font-sans italic">
              No pieces match your selected archive filters.
            </div>
          )}
          
          <AnimatePresence>
            {filteredPaintings.map((painting, i) => {
              // Asymmetrical width + alignment. These MUST be complete literal
              // class strings so Tailwind's JIT actually generates them —
              // runtime-concatenated classes (md:${x}) are never emitted.
              const layouts = [
                'md:w-[90%] md:self-start',
                'md:w-[75%] md:self-end',
                'md:w-full md:self-center',
                'md:w-[85%] md:self-end',
              ];
              const layout = layouts[i % layouts.length];

              // Use the loaded aspect ratio, or fall back to 4/5
              const ratio = aspectRatios[painting.id];
              const meta = `${painting.month ? `${painting.month} ${painting.year}` : painting.year} · ${painting.medium}`;

              return (
                <motion.div
                  layout
                  key={painting.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className={`group flex flex-col gap-4 md:gap-6 w-full ${layout}`}
                >
                  {/* Image Container with elegant museum framing — aspect ratio matches
                      the artwork. Kept as a <div>: Safari/WebKit ignores `aspect-ratio`
                      on <button>, which collapsed the frame and hid the image. The
                      click target is an absolutely-positioned overlay button instead. */}
                  <div
                    className="bg-bg-secondary w-full shadow-[0_10px_20px_-10px_rgba(0,0,0,0.05)] md:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden relative border-[8px] md:border-[12px] border-[#fffefc] ring-1 ring-black/5 transition-[aspect-ratio] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      aspectRatio: ratio ? `${ratio}` : '4 / 5',
                    }}
                  >
                    {painting.image ? (
                      <img
                        src={painting.image}
                        alt={painting.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[#e8e4db] transition-transform duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]" />
                    )}
                    {painting.image && (
                      <button
                        type="button"
                        onClick={() => openLightbox({ image: painting.image, title: painting.title, meta })}
                        aria-label={`View ${painting.title} full screen`}
                        className="absolute inset-0 z-10 cursor-pointer"
                      />
                    )}
                  </div>
                  
                  {/* Museum Placard Style Caption */}
                  <div className="flex flex-col md:flex-row md:items-baseline justify-between border-t border-text-primary/10 pt-4 gap-2">
                    <h3 className="text-2xl md:text-3xl font-serif text-text-primary">{painting.title}</h3>
                    <p className="font-sans text-xs text-text-secondary tracking-widest uppercase">
                      {painting.month ? `${painting.month} ${painting.year}` : painting.year} <span className="mx-2 opacity-50">|</span> {painting.medium} <br className="hidden md:block"/>
                      <span className="md:hidden opacity-50 mx-2">|</span> {painting.category}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

