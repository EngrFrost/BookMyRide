import { initializeApp, type FirebaseApp } from 'firebase/app'
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type Auth,
  type User as FirebaseUser,
} from 'firebase/auth'

let app: FirebaseApp | null = null
let auth: Auth | null = null

function firebaseConfig() {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
  const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID
  if (!apiKey || !authDomain || !projectId) return null
  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  }
}

export function isFirebaseConfigured(): boolean {
  return firebaseConfig() !== null
}

function getFirebaseAuth(): Auth {
  if (!auth) {
    const config = firebaseConfig()
    if (!config) throw new Error('Firebase is not configured.')
    app = initializeApp(config)
    auth = getAuth(app)
  }
  return auth
}

export async function getIdToken(forceRefresh = false): Promise<string | null> {
  if (!isFirebaseConfigured()) return null
  const user = getFirebaseAuth().currentUser
  if (!user) return null
  return user.getIdToken(forceRefresh)
}

export function subscribeToAuth(
  listener: (user: FirebaseUser | null) => void,
): () => void {
  return onAuthStateChanged(getFirebaseAuth(), listener)
}

export async function signInWithProvider(
  provider: 'google' | 'facebook',
): Promise<FirebaseUser> {
  const authInstance = getFirebaseAuth()
  const result = await signInWithPopup(
    authInstance,
    provider === 'google' ? new GoogleAuthProvider() : new FacebookAuthProvider(),
  )
  return result.user
}

export async function signOutFirebase(): Promise<void> {
  if (!isFirebaseConfigured()) return
  await firebaseSignOut(getFirebaseAuth())
}
