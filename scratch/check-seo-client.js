
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkSeo() {
    console.log('--- Checking SEO Config (Client SDK) ---');

    const seoPagesRef = doc(db, 'site_config', 'seo_pages');
    const seoPagesSnap = await getDoc(seoPagesRef);

    if (seoPagesSnap.exists()) {
        console.log('seo_pages data:', JSON.stringify(seoPagesSnap.data(), null, 2));
    } else {
        console.log('seo_pages document does NOT exist');
    }

    const globalRef = doc(db, 'site_config', 'global');
    const globalSnap = await getDoc(globalRef);

    if (globalSnap.exists()) {
        console.log('global data (seo part):', JSON.stringify(globalSnap.data().seo, null, 2));
    } else {
        console.log('global document does NOT exist');
    }
}

checkSeo().catch(console.error);
