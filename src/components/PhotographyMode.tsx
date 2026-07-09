'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import client from '@/lib/tina-client';
import { useLightboxStore } from '@/store/useLightboxStore';

type Photo = {
  id: string;
  title: string;
  client: string;
  category: string;
  image: string;
};

type Campaign = {
  name: string;
  photoCount: number;
  categories: { name: string; photos: Photo[] }[];
};

export default function PhotographyMode() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [expandedCampaign, setExpandedCampaign] = useState<string | null>(null);
  const openLightbox = useLightboxStore((s) => s.open);

  useEffect(() => {
    async function loadPhotos() {
      try {
        const res = await client.queries.photographyConnection();
        const edges = res.data.photographyConnection.edges || [];
        const loadedPhotos = edges.map((edge) => {
          const node = edge?.node;
          return {
            id: node?.id || Math.random().toString(),
            title: node?.title || 'Untitled',
            client: node?.client || '',
            category: node?.category || 'General',
            image: node?.image || '',
          };
        });
        setPhotos(loadedPhotos);
      } catch (err) {
        console.error("Failed to load photography from TinaCMS:", err);
      }
    }
    loadPhotos();
  }, []);

  const displayPhotos: Photo[] = photos.length > 0 ? photos : [
    { id: '1', title: 'Living Room', client: 'Lumturi Residence', category: 'Room 1', image: '' },
    { id: '2', title: 'Master Suite', client: 'Lumturi Residence', category: 'Room 1', image: '' },
    { id: '3', title: 'Kitchen Island', client: 'Lumturi Residence', category: 'Room 2', image: '' },
    { id: '4', title: 'Infinity Pool', client: 'Lumturi Residence', category: 'Exterior', image: '' },
    { id: '5', title: 'Garden Path', client: 'Lumturi Residence', category: 'Exterior', image: '' },
    { id: '6', title: 'Terrace View', client: 'Penthouse View', category: 'Balcony', image: '' },
    { id: '7', title: 'Open Plan', client: 'Penthouse View', category: 'Interior', image: '' },
    { id: '8', title: 'City Skyline', client: 'Penthouse View', category: 'Balcony', image: '' },
    { id: '9', title: 'Neon Alley', client: 'Nike', category: 'Urban Sprint', image: '' },
    { id: '10', title: 'Runner\'s High', client: 'Nike', category: 'Urban Sprint', image: '' },
  ];

  // Build structured campaign data
  const campaigns: Campaign[] = Object.entries(
    displayPhotos.reduce((acc, photo) => {
      const name = photo.client || 'Personal Work';
      if (!acc[name]) acc[name] = [];
      acc[name].push(photo);
      return acc;
    }, {} as Record<string, Photo[]>)
  ).map(([name, allPhotos]) => {
    const catMap = allPhotos.reduce((acc, p) => {
      const cat = p.category || 'General';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(p);
      return acc;
    }, {} as Record<string, Photo[]>);

    return {
      name,
      photoCount: allPhotos.length,
      categories: Object.entries(catMap).map(([catName, catPhotos]) => ({
        name: catName,
        photos: catPhotos,
      })),
    };
  });

  // Auto-expand first campaign
  useEffect(() => {
    if (campaigns.length > 0 && expandedCampaign === null) {
      setExpandedCampaign(campaigns[0].name);
    }
  }, [campaigns, expandedCampaign]);

  return (
    <div className="w-full flex flex-col font-sans">
      {/* Minimal Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="pt-16 pb-20 px-6 md:px-16"
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-text-secondary text-sm uppercase tracking-[0.3em] mb-6"
        >
          Photography
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9]"
        >
          Selected<br />Campaigns
        </motion.h1>
      </motion.div>

      {/* Campaign List */}
      <div className="flex flex-col">
        {campaigns.map((campaign, campaignIndex) => {
          const isExpanded = expandedCampaign === campaign.name;

          return (
            <div key={campaign.name} className="border-t hairline">
              {/* Campaign Header Row — clickable accordion */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 * campaignIndex }}
                onClick={() => setExpandedCampaign(isExpanded ? null : campaign.name)}
                className="w-full px-6 md:px-16 py-8 md:py-12 flex items-center justify-between group transition-colors hover:bg-white/[0.02]"
              >
                <div className="flex items-baseline gap-6">
                  <span className="text-text-secondary text-sm font-mono tabular-nums">
                    {String(campaignIndex + 1).padStart(2, '0')}
                  </span>
                  <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-left">
                    {campaign.name}
                  </h2>
                </div>
                <div className="flex items-center gap-8">
                  <span className="text-text-secondary text-sm tracking-widest uppercase hidden md:block">
                    {campaign.photoCount} shots · {campaign.categories.length} {campaign.categories.length === 1 ? 'set' : 'sets'}
                  </span>
                  <motion.div
                    animate={{ rotate: isExpanded ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/40 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </motion.div>
                </div>
              </motion.button>

              {/* Expanded Campaign Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 md:px-16 pb-16 md:pb-24">
                      {/* Categories within the campaign */}
                      {campaign.categories.map((category, catIndex) => (
                        <div key={category.name} className="mb-16 last:mb-0">
                          {/* Category Label */}
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + catIndex * 0.05 }}
                            className="flex items-center gap-4 mb-6"
                          >
                            <div className="w-8 h-px bg-accent-primary" />
                            <span className="text-sm uppercase tracking-[0.2em] text-text-secondary font-medium">
                              {category.name}
                            </span>
                            <span className="text-xs text-text-secondary/50">
                              {category.photos.length}
                            </span>
                          </motion.div>

                          {/* Photo Grid for this category */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-4">
                            {category.photos.map((photo) => (
                              <motion.div
                                key={photo.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{
                                  delay: 0.1, // Fixed delay for scroll reveal
                                  duration: 0.6,
                                  ease: [0.16, 1, 0.3, 1],
                                }}
                                className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-bg-secondary group"
                              >
                                {photo.image ? (
                                  <img
                                    src={photo.image}
                                    alt={photo.title}
                                    className="w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-bg-secondary via-accent-secondary/10 to-bg-secondary transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
                                )}

                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Photo title on hover */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 text-left">
                                  <p className="text-white text-sm font-medium">{photo.title}</p>
                                </div>
                                {photo.image && (
                                  <button
                                    type="button"
                                    onClick={() => openLightbox({ image: photo.image, title: photo.title, meta: `${photo.client}${photo.client && photo.category ? ' · ' : ''}${photo.category}` })}
                                    aria-label={`View ${photo.title} full screen`}
                                    className="absolute inset-0 z-20 cursor-pointer"
                                  />
                                )}
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {/* Bottom border */}
        <div className="border-t hairline" />
      </div>
    </div>
  );
}
