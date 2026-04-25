
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Elena Rossi",
    position: "Founder at Aura",
    text: "Kartik doesn't just write code; he crafts experiences. His eye for detail and technical depth transformed our brand completely.",
    avatar: "ER"
  },
  {
    name: "James Chen",
    position: "CTO at Lumina",
    text: "A rare talent who understands both the 'how' and the 'why'. His contributions to our core architecture were invaluable.",
    avatar: "JC"
  },
  {
    name: "Sarah Miller",
    position: "Design Director",
    text: "Working with Kartik was a breeze. He brought our wildest design ideas to life with flawless execution and insane performance.",
    avatar: "SM"
  }
];

export const Testimonials = () => {
  return (
    <section className="py-24 px-6 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-primary uppercase tracking-widest text-xs font-bold block mb-4">Social Proof</span>
          <h2 className="text-4xl md:text-5xl font-headline font-bold">Trusted by Industry Leaders</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="bg-card p-10 rounded-3xl border border-white/5 flex flex-col justify-between hover:border-accent/30 transition-colors group"
            >
              <div>
                <Quote className="w-10 h-10 text-accent mb-8 opacity-20 group-hover:opacity-100 transition-opacity" />
                <p className="text-lg italic leading-relaxed text-muted-foreground mb-8 font-headline">
                  "{t.text}"
                </p>
              </div>
              <div className="flex items-center gap-4 border-t border-white/5 pt-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-black text-xs text-background">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-bold text-white">{t.name}</div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">{t.position}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
