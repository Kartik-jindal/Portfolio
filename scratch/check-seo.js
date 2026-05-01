
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Check if we have the service account path
const serviceAccountPath = process.env.FIREBASE_ADMIN_SDK_SERVICE_ACCOUNT;
if (!serviceAccountPath) {
    console.error('FIREBASE_ADMIN_SDK_SERVICE_ACCOUNT is not set');
    process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function checkSeo() {
    console.log('--- Checking SEO Config ---');
    
    const seoPagesRef = db.collection('site_config').doc('seo_pages');
    const seoPagesSnap = await seoPagesRef.get();
    
    if (seoPagesSnap.exists) {
        console.log('seo_pages data:', JSON.stringify(seoPagesSnap.data(), null, 2));
    } else {
        console.log('seo_pages document does NOT exist');
    }
    
    const globalRef = db.collection('site_config').doc('global');
    const globalSnap = await globalRef.get();
    
    if (globalSnap.exists) {
        console.log('global data (seo part):', JSON.stringify(globalSnap.data().seo, null, 2));
    } else {
        console.log('global document does NOT exist');
    }
}

checkSeo().catch(console.error);
