
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDpj7w3Ytt95uLIsi4rGUeZOHhoh3SPgrM",
  authDomain: "my-portfolio-website-b7422.firebaseapp.com",
  projectId: "my-portfolio-website-b7422",
  storageBucket: "my-portfolio-website-b7422.firebasestorage.app",
  messagingSenderId: "184181770431",
  appId: "1:184181770431:web:e373a88e06036a87a31e0a"
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
