'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModeStore } from '@/store/useModeStore';

export default function ContactPage() {
  const mode = useModeStore((state) => state.mode);
  const [sent, setSent] = useState(false);

  const blurb =
    mode === 'painting'
      ? 'gallery exhibitions and commissions'
      : mode === 'photography'
      ? 'commercial campaigns and editorials'
      : 'cinematic wedding and dental videography';

  // Demo build: no live backend. Intercept the submit and show a success
  // state instead of posting to a dead endpoint.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="w-full max-w-2xl mx-auto min-h-full flex flex-col justify-center font-sans pt-32 px-6 pb-16 relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-bg-primary/80 backdrop-blur-md p-6 sm:p-10 md:p-12 rounded-3xl shadow-xl border hairline"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-text-primary">
          Let&rsquo;s Work Together
        </h1>
        <p className="text-text-secondary mb-8">
          Currently accepting inquiries for {blurb}.
        </p>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border hairline bg-bg-secondary/60 p-8 text-center"
            >
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-accent-primary/15 flex items-center justify-center text-accent-primary">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <p className="text-text-primary font-medium text-lg">Message received.</p>
              <p className="text-text-secondary text-sm mt-2">
                Thanks for reaching out — I&rsquo;ll be in touch soon.
                <span className="block mt-2 text-xs opacity-60">(Demo form — no message was actually sent.)</span>
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-6 text-sm uppercase tracking-widest text-accent-primary hover:opacity-80 transition-opacity"
              >
                Send another
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="w-full bg-bg-secondary text-text-primary border-none rounded-xl p-4 focus:ring-2 focus:ring-accent-primary outline-none transition-all"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="w-full bg-bg-secondary text-text-primary border-none rounded-xl p-4 focus:ring-2 focus:ring-accent-primary outline-none transition-all"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-text-secondary mb-2">Message</label>
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  required
                  className="w-full bg-bg-secondary text-text-primary border-none rounded-xl p-4 focus:ring-2 focus:ring-accent-primary outline-none transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-accent-primary text-white font-bold tracking-wider hover:opacity-90 transition-opacity"
              >
                SEND INQUIRY
              </button>
            </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
