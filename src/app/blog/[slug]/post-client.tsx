'use client';

import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Navbar } from '@/components/portfolio/navbar';
import { Footer } from '@/components/portfolio/footer';
import { ArrowLeft, Share2, ArrowUpRight, ExternalLink, Tag, Calendar, ChevronRight, Layers } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/portfolio/breadcrumbs';
import { getAssetUrl } from '@/lib/utils';

interface PostClientProps {
  post: any;
  config: any;
  relatedPosts?: any[];
  relatedProjects?: any[];
  sanitizedContent?: string;
}

const AuthorTrustBlock = ({ config }: { config: any }) => {
  const authorName = config?.identity?.authorName || 'Kartik Jindal';
  const jobTitle = config?.identity?.jobTitle || 'Full Stack Architect';
  const bio = config?.identity?.bio || 'Engineering digital landscapes where architectural precision meets artistic motion.';
  const pillars: string[] = config?.identity?.expertise || [];
  const initials = authorName.split(' ').map((n: string) => n[0]).join('.');

  return (
    <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-8">
      <div className="flex items-start gap-5">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/30 to-primary/5 border border-primary/20 flex items-center justify-center text-primary font-black text-sm italic shrink-0">
          {initials}
        </div>
        <div className="space-y-1 flex-1">
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary block">Author</span>
          <h4 className="text-lg font-headline font-bold text-white leading-tight">{authorName}</h4>
          <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{jobTitle}</p>
        </div>
      </div>
      <div className="h-px bg-white/5" />
      <p className="text-sm text-white/50 font-body font-light leading-relaxed">{bio}</p>
      {pillars.length > 0 && (
        <div className="space-y-3">
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Expertise</span>
          <div className="flex flex-wrap gap-2">
            {pillars.slice(0, 5).map((p: string) => (
              <span key={p} className="px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-bold text-primary/70 uppercase tracking-widest">{p}</span>
            ))}
          </div>
        </div>
      )}
      <div className="h-px bg-white/5" />
      <Link href="/work" className="flex items-center justify-between group">
        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-primary transition-colors">View Portfolio</span>
        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-black transition-all duration-300">
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      </Link>
    </div>
  );
};

const SourceReferences = ({ citations }: { citations: string[] }) => {
  if (!citations || citations.length === 0) return null;
  const isUrl = (s: string) => { try { new URL(s); return true; } catch { return false; } };
  const getDomain = (url: string) => { try { return new URL(url).hostname.replace('www.', ''); } catch { return url; } };
  return (
    <div className="mt-16 pt-10 border-t border-white/5 space-y-6">
      <div className="flex items-center gap-3">
        <ExternalLink className="w-4 h-4 text-primary/60" />
        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Sources & References</h4>
      </div>
      <ol className="space-y-3">
        {citations.map((cite: string, i: number) => (
          <li key={i} className="flex items-start gap-4 group">
            <span className="text-[9px] font-black text-primary/40 mt-0.5 shrink-0 w-5">{i + 1}.</span>
            {isUrl(cite) ? (
              <a href={cite} target="_blank" rel="noopener noreferrer" className="text-sm text-white/40 hover:text-primary transition-colors font-mono break-all flex items-center gap-2">
                <span className="text-white/60 font-bold">{getDomain(cite)}</span>
                <ExternalLink className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ) : (
              <span className="text-sm text-white/40 font-body leading-relaxed">{cite}</span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};

const InternalLinks = ({ post }: { post: any }) => {
  const links: Array<{ label: string; href: string; type?: string }> = post.internalLinks || [];
  const standardLinks = [
    { label: 'Back to Journal', href: '/blog', type: 'blog' },
    { label: 'View All Work', href: '/work', type: 'work' },
    { label: 'Start a Project', href: '/#contact', type: 'contact' },
  ];
  const allLinks = [...links, ...standardLinks];
  return (
    <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-6">
      <div className="flex items-center gap-3">
        <Layers className="w-4 h-4 text-primary/60" />
        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Further Reading</h4>
      </div>
      <ul className="space-y-1">
        {allLinks.map((link, i) => (
          <li key={i}>
            <Link href={link.href} className="flex items-center justify-between group py-2.5 border-b border-white/[0.03] last:border-0">
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-primary transition-colors">{link.label}</span>
              <ChevronRight className="w-3.5 h-3.5 text-white/10 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const RelatedPosts = ({ posts }: { posts: any[] }) => {
  if (!posts || posts.length === 0) return null;
  return (
    <section className="space-y-12">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex items-center gap-6">
        <span className="text-white/30 uppercase tracking-[0.5em] text-[10px] font-black">Continue Reading</span>
        <div className="flex-1 h-px bg-white/5" />
      </motion.div>
      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((post, i) => (
          <motion.article key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="group">
            <Link href={`/blog/${post.slug || post.id}`} className="flex flex-col h-full rounded-[2rem] overflow-hidden border border-white/5 hover:border-primary/20 bg-white/[0.02] transition-all duration-500">
              <div className="relative aspect-[16/9] overflow-hidden shrink-0">
                <Image src={getAssetUrl(post.image)} alt={post.title} fill className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" sizes="(min-width: 768px) 33vw, 100vw" data-ai-hint={post.imageHint || "blog post"} />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              </div>
              <div className="p-6 flex flex-col flex-1 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {(post.categories || (post.category ? [post.category] : ['Engineering'])).slice(0, 2).map((cat: string) => (
                    <span key={cat} className="flex items-center gap-1.5 text-primary">
                      <Tag className="w-2.5 h-2.5" />
                      <span className="text-[9px] font-black uppercase tracking-[0.4em]">{cat}</span>
                    </span>
                  ))}
                </div>
                <div className="h-px w-6 bg-white/20 group-hover:w-12 group-hover:bg-primary transition-all duration-500" />
                <h3 className="text-lg font-headline font-bold text-white group-hover:text-primary transition-colors leading-tight tracking-tight break-words line-clamp-2 flex-1">{post.title}</h3>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/30">
                    <Calendar className="w-3 h-3 text-primary/30" />
                    <time dateTime={post.createdAt ? new Date(post.createdAt).toISOString().split('T')[0] : undefined}>
                      {post.date}
                    </time>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-black transition-all duration-300">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

const RelatedProjects = ({ projects }: { projects: any[] }) => {
  if (!projects || projects.length === 0) return null;
  return (
    <section className="space-y-12">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex items-center gap-6">
        <span className="text-primary uppercase tracking-[0.5em] text-[10px] font-black">Proof of Work</span>
        <div className="flex-1 h-px bg-white/5" />
        <Link href="/work" className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-primary transition-colors flex items-center gap-2">
          All Projects <ArrowUpRight className="w-3 h-3" />
        </Link>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-6">
        {projects.map((project, i) => (
          <motion.article key={project.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="group">
            <Link href={`/work/${project.slug || project.id}`} className="flex flex-col h-full rounded-[2rem] overflow-hidden border border-white/5 hover:border-primary/20 bg-white/[0.02] transition-all duration-500">
              <div className="relative aspect-[16/9] overflow-hidden shrink-0">
                <Image src={getAssetUrl(project.image)} alt={project.title} fill className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" sizes="(min-width: 768px) 33vw, 100vw" data-ai-hint={project.imageHint || "project cover"} />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              </div>
              <div className="p-6 flex flex-col flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary">{project.role}</span>
                  {project.date && <span className="text-[9px] font-black uppercase tracking-widest text-white/20">{project.date}</span>}
                </div>
                <div className="h-px w-6 bg-white/20 group-hover:w-12 group-hover:bg-primary transition-all duration-500" />
                <h3 className="text-lg font-headline font-bold text-white group-hover:text-primary transition-colors leading-tight tracking-tight break-words line-clamp-2 flex-1">{project.title}</h3>
                {project.tech && project.tech.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.slice(0, 3).map((t: string) => (
                      <span key={t} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[9px] font-bold text-white/30 uppercase tracking-widest">{t}</span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 group-hover:text-primary transition-colors">Case Study</span>
                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-black transition-all duration-300">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default function PostClient({ post, config, relatedPosts = [], relatedProjects = [], sanitizedContent = '' }: PostClientProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-headline font-bold text-white">Post not found</h1>
          <Link href="/blog" className="text-primary uppercase tracking-widest font-black text-xs inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Journal
          </Link>
        </div>
      </div>
    );
  }

  const postCategories = post.categories || (post.category ? [post.category] : ['Engineering']);
  const authorName = config?.identity?.authorName || 'Kartik Jindal';
  const citations: string[] = post.entity?.citations || [];

  return (
    <main className="bg-transparent min-h-screen">
      <Navbar resumeUrl={config?.resume?.fileUrl} />
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-primary z-[200] origin-left" style={{ scaleX }} />

      <article className="pt-32 pb-24">
        <header className="max-w-4xl mx-auto px-6 mb-16 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-6">
            <div className="flex justify-center">
              <Breadcrumbs items={[{ label: 'Journal', href: '/blog' }, { label: post.title }]} />
            </div>
            <div className="flex flex-wrap justify-center items-center gap-4 text-[10px] uppercase font-black tracking-[0.3em] text-primary">
              <div className="flex flex-wrap gap-2 justify-center">
                {postCategories.map((cat: string) => (
                  <Link key={cat} href={`/blog/category/${encodeURIComponent(cat.toLowerCase())}`} className="bg-primary/5 px-3 py-1 rounded-md border border-primary/10 hover:bg-primary/10 transition-colors">{cat}</Link>
                ))}
              </div>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="text-white/40">{post.readTime}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-headline font-bold text-white tracking-tight leading-[1.1] break-words">{post.title}</h1>
            <div className="text-white/30 text-xs font-bold uppercase tracking-[0.2em] pt-4">
              Published{' '}
              <time dateTime={post.createdAt ? new Date(post.createdAt).toISOString().split('T')[0] : undefined}>
                {post.date}
              </time>
            </div>
          </motion.div>
        </header>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} className="max-w-[1600px] mx-auto px-6 mb-20">
          <div className="relative aspect-video sm:aspect-[21/9] rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
            <Image src={getAssetUrl(post.image)} alt={post.altText || post.title} fill className="object-cover" priority sizes="(min-width: 1600px) 1600px, 100vw" data-ai-hint={post.imageHint || "blog post"} />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          </div>
        </motion.div>

        <div className="max-w-[1600px] mx-auto px-6 grid lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-8 lg:col-start-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="prose prose-invert prose-lg max-w-none font-body text-white/70 leading-relaxed
                prose-headings:font-headline prose-headings:font-bold prose-headings:text-white prose-headings:tracking-tight
                prose-h3:text-2xl md:prose-h3:text-3xl prose-h3:mt-12 prose-h3:mb-6
                prose-p:mb-8
                prose-blockquote:border-l-2 prose-blockquote:border-primary/50 prose-blockquote:bg-white/[0.02] prose-blockquote:py-8 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:text-white prose-blockquote:not-italic prose-blockquote:text-xl prose-blockquote:my-12
                prose-ul:list-none prose-ul:pl-0 prose-ul:space-y-4
                prose-li:relative prose-li:pl-8 prose-li:before:content-[''] prose-li:before:absolute prose-li:before:left-0 prose-li:before:top-[0.6em] prose-li:before:w-1.5 prose-li:before:h-1.5 prose-li:before:bg-primary prose-li:before:rounded-full break-words"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
            <SourceReferences citations={citations} />
            <footer className="mt-20 pt-10 border-t border-white/5 flex items-center justify-between">
              <Link href="/blog" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Journal
              </Link>
              <button onClick={() => { if (navigator.share) { navigator.share({ title: post.title, url: window.location.href }); } else { navigator.clipboard.writeText(window.location.href); } }} className="text-white/40 hover:text-white transition-colors" title="Share">
                <Share2 className="w-4 h-4" />
              </button>
            </footer>
          </div>

          <aside className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-8">
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Abstract</h4>
              <p className="text-sm text-white/50 leading-relaxed break-words">{post.summary}</p>
            </div>
            <AuthorTrustBlock config={config} />
            <InternalLinks post={post} />
          </aside>
        </div>
      </article>

      <div className="max-w-[1600px] mx-auto px-6 pb-32 space-y-32">
        <RelatedProjects projects={relatedProjects} />
        <RelatedPosts posts={relatedPosts} />
      </div>

      <Footer config={config} />

    </main>
  );
}
