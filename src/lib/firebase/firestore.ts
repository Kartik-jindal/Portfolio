import { getFirestore } from 'firebase/firestore';
import { app } from '@/lib/firebase/app';

export const db = getFirestore(app);
