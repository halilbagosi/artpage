'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import client from '@/lib/tina-client';

type Video = {
  id: string;
  title: string;
  client: string;
  category: string;
  ratio: string;
  videoUrl: string;
  thumbnail: string;
};

type Category = 'all' | 'weddings' | 'dentistry';

const FALLBACK_VIDEOS: Video[] = [
  { id: '1', title: 'The Vow', client: 'Sarah & John', category: 'weddings', thumbnail: '', videoUrl: '', ratio: 'aspect-[21/9]' },
  { id: '2', title: 'Forever Forward', client: 'Emma & Chris', category: 'weddings', thumbnail: '', videoUrl: '', ratio: 'aspect-[21/9]' },
  { id: '3', title: 'Precision & Grace', client: 'Smile Clinic', category: 'dentistry', thumbnail: '', videoUrl: '', ratio: 'aspect-[21/9]' },
  { id: '4', title: 'The Art of Implants', client: 'Dr. Harrison', category: 'dentistry', thumbnail: '', videoUrl: '', ratio: 'aspect-[21/9]' },
];

/**
 * A single cinematic tile. If the piece has a real `videoUrl` it plays the
 * muted loop on hover (desktop) and reveals a play control on touch; without
 * a video it falls back to the stylized "on-set" poster.
 */
function VideoCard({ video, index }: { video: Video; index: number }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const hasVideo = Boolean(video.videoUrl);

  const play = () => {
    const v = ref.current;
    if (!v) return;
    v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };
  const stop = () => {
    const v = ref.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    setPlaying(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full aspect-video md:aspect-[21/9] bg-bg-secondary overflow-hidden group rounded-xl"
      onMouseEnter={hasVideo ? play : undefined}
      onMouseLeave={hasVideo ? stop : undefined}
      onClick={hasVideo ? (playing ? stop : play) : undefined}
    >
      {/* Media layer */}
      {hasVideo ? (
        <video
          ref={ref}
          src={video.videoUrl}
          poster={video.thumbnail || undefined}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : video.thumbnail ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={video.thumbnail}
          alt={video.title}
          className="absolute inset-0 w-full h-full object-cover opacity-70 transition-transform duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 grain opacity-20 mix-blend-overlay bg-gradient-to-t from-black via-neutral-900 to-neutral-800 transition-transform duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
      )}

      {/* Cinematic scrim (fades out while a real video plays) */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent transition-opacity duration-700 pointer-events-none"
        style={{ opacity: playing ? 0.15 : 1 }}
      />

      {/* Top meta (revealed on hover) */}
      <div className="absolute top-5 left-6 right-6 md:top-6 md:left-8 md:right-8 z-20 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-mono text-[10px] md:text-xs text-white/50 uppercase tracking-widest">
        <span>00:{String(index * 12).padStart(2, '0')}:45</span>
        <span>F/2.8 • 24FPS</span>
      </div>

      {/* Play affordance for pieces that have a real video */}
      {hasVideo && !playing && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center opacity-90 group-hover:opacity-0 transition-opacity duration-500">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white" className="translate-x-[2px]">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Title overlay (hides while playing) */}
      <div
        className="absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end p-6 md:p-12 transition-opacity duration-700 pointer-events-none"
        style={{ opacity: playing ? 0 : 1 }}
      >
        <h3 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] break-words max-w-full mb-2">
          {video.title}
        </h3>
        <p className="text-accent-primary font-bold tracking-[0.2em] uppercase text-[10px] md:text-sm">
          {video.client ? `${video.client} · ` : ''}{video.category}
        </p>
      </div>
    </motion.div>
  );
}

export default function VideographyMode() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await client.queries.videographyConnection();
        const edges = res.data.videographyConnection.edges || [];
        const ratios = ['aspect-[21/9]', 'aspect-video', 'aspect-[16/9]', 'aspect-[4/3]'];

        const loadedVideos = edges.map((edge, index) => {
          const node = edge?.node;
          return {
            id: node?.id || Math.random().toString(),
            title: node?.title || 'Untitled',
            client: '', // No client field in the schema — omit rather than fake it
            category: node?.category || 'weddings',
            videoUrl: node?.videoUrl || '',
            thumbnail: node?.thumbnail || '',
            ratio: ratios[index % ratios.length],
          };
        });
        setVideos(loadedVideos);
      } catch (err) {
        console.error('Failed to load videography from TinaCMS:', err);
      }
    }
    loadVideos();
  }, []);

  const source = videos.length > 0 ? videos : FALLBACK_VIDEOS;
  const filteredVideos = activeCategory === 'all'
    ? source
    : source.filter((v) => v.category === activeCategory);

  return (
    <div className="w-full h-full flex flex-col font-sans max-w-screen-2xl mx-auto">

      {/* High-Impact Commercial Header */}
      <div className="mt-8 mb-12 md:mb-16 flex flex-col items-start gap-6 border-b hairline pb-10 md:pb-12 relative z-0">
        <motion.h1
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] font-black uppercase tracking-tighter leading-[0.85]"
        >
          FILM <br /> DIRECTION
        </motion.h1>

        <div className="flex flex-col md:flex-row md:flex-wrap md:items-center md:justify-between w-full gap-6 mt-2 md:mt-4">
          <p className="text-lg md:text-2xl text-text-secondary max-w-lg font-light">
            Cinematic storytelling. High-end production for personal legacies and commercial brands.
          </p>

          <div className="flex flex-wrap gap-3 md:gap-4 w-full md:w-auto">
            {(['all', 'weddings', 'dentistry'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="relative px-5 md:px-6 py-2 rounded-full text-xs md:text-sm font-bold uppercase tracking-widest z-10 transition-colors duration-300"
                style={{ color: activeCategory === cat ? '#000' : '#fff' }}
              >
                {activeCategory === cat && (
                  <motion.div
                    layoutId="video-category-pill"
                    className="absolute inset-0 bg-white rounded-full z-[-1]"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Asymmetrical Cinematic Grid */}
      <motion.div layout className="flex flex-col gap-10 md:gap-16 relative z-[2]">
        <AnimatePresence mode="popLayout">
          {filteredVideos.map((video, i) => (
            <VideoCard key={video.id} video={video} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
