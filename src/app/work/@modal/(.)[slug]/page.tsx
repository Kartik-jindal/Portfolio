import React from 'react';
import { db } from '@/lib/firebase/firestore';
import { collection, query, where, getDocs, doc, getDoc, limit } from 'firebase/firestore';
import { ProjectDetailContent } from '@/components/portfolio/project-detail-content';
import { ModalWrapper } from '@/components/portfolio/modal-wrapper';

function serialize(data: any) {
  if (!data) return data;
  return JSON.parse(JSON.stringify(data, (key, value) => {
    if (value && typeof value === 'object' && value.seconds !== undefined && value.nanoseconds !== undefined) {
      return new Date(value.seconds * 1000).getTime();
    }
    return value;
  }));
}

async function getProject(slug: string) {
  try {
    const q = query(collection(db, 'projects'), where('slug', '==', slug), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) return serialize({ id: snap.docs[0].id, ...snap.docs[0].data() });
    
    // ID Fallback
    const docSnap = await getDoc(doc(db, 'projects', slug));
    if (docSnap.exists()) return serialize({ id: docSnap.id, ...docSnap.data() });
    
    return null;
  } catch (e) { return null; }
}

export default async function ProjectModalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) return null;

  return (
    <ModalWrapper>
      <ProjectDetailContent project={project} isModal />
    </ModalWrapper>
  );
}
