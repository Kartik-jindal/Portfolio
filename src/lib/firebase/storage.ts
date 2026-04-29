import { getStorage } from 'firebase/storage';
import { app } from '@/lib/firebase/app';

export const storage = getStorage(app);
