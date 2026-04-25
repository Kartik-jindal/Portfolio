
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
    <section className="py-32 px-6 overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-primary uppercase tracking-widest text-xs font-bold block mb-4">Social Proof</span>
          <h2 className="text-5xl md:text-7xl font-headline font-black tracking-tighter">Voices.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="bg-card p-10 rounded-3xl border border-white/5 flex flex-col justify-between hover:border-accent/30 transition-all duration-500 group"
            >
              <div>
                <Quote className="w-10 h-10 text-accent mb-8 opacity-20 group-hover:opacity-100 transition-opacity" />
                <p className="text-lg italic leading-relaxed text-muted-foreground/80 mb-8 font-headline">
                  "{t.text}"
                </p>
              </div>
              <div className="flex items-center gap-4 border-t border-white/5 pt-8">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-black text-[10px] text-background">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{t.name}</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground/60">{t.position}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
