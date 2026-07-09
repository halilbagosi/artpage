'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TinaMarkdown, TinaMarkdownContent } from 'tinacms/dist/rich-text';
import client from '@/lib/tina-client';

export default function AboutPage() {
  const [profileImage, setProfileImage] = useState<string>('');
  const [body, setBody] = useState<TinaMarkdownContent | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await client.queries.aboutConnection();
        const node = res.data.aboutConnection.edges?.[0]?.node;
        if (node?.profileImage) setProfileImage(node.profileImage);
        if (node?.body) setBody(node.body as TinaMarkdownContent);
      } catch (err) {
        console.error('Failed to load About content from TinaCMS:', err);
      }
    }
    load();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto min-h-full flex flex-col justify-center font-sans pt-32 px-6 pb-16 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-bg-primary/80 backdrop-blur-md p-6 sm:p-10 md:p-12 rounded-3xl shadow-xl border hairline"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-8 md:mb-10 text-text-primary">About Me</h1>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <div className="aspect-[3/4] bg-bg-secondary rounded-2xl overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-700">
            {profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profileImage}
                alt="Halil Bagosi"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-accent-primary/20 mix-blend-overlay" />
            )}
          </div>

          <div className="flex flex-col justify-center space-y-5 md:space-y-6 text-base md:text-lg text-text-secondary leading-relaxed">
            {body ? (
              <div className="prose-headings:text-text-primary space-y-5">
                <TinaMarkdown content={body} />
              </div>
            ) : (
              <>
                <p>
                  I am a multidisciplinary artist and creative director based in New York.
                  My work spans tactile fine art, high-energy commercial photography,
                  and cinematic videography.
                </p>
                <p>
                  Through &ldquo;The Textured Gallery&rdquo; I explore memory and form. In
                  commercial photography I help brands tell bold stories. And in film
                  direction I capture the most critical moments of life and profession.
                </p>
                <p>Welcome to my digital mind.</p>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
