import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const DOC_ID = 'class6A_data';
const COLLECTION = 'appData';

export function useFirebaseSync<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, boolean] {
  const [data, setData] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const docRef = doc(db, COLLECTION, DOC_ID);

    // Initial sync
    const syncInitial = async () => {
      try {
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const firestoreData = snap.data();
          if (firestoreData[key] !== undefined) {
            setData(firestoreData[key]);
          } else {
            // Document exists but key doesn't, push local to firebase
            await setDoc(docRef, { [key]: initialValue }, { merge: true });
          }
        } else {
          // Document doesn't exist, push local to firebase
          await setDoc(docRef, { [key]: initialValue }, { merge: true });
        }
      } catch (err) {
        console.error('Initial sync error:', err);
      }
    };

    syncInitial();

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const firestoreData = docSnap.data();
        if (firestoreData[key] !== undefined) {
          setData(firestoreData[key]);
        }
      }
      setIsLoaded(true);
    }, (error) => {
      console.error('Firebase sync error:', error);
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, [key]);

  const setValue = async (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(data) : value;
      setData(valueToStore);
      const docRef = doc(db, COLLECTION, DOC_ID);
      await setDoc(docRef, { [key]: valueToStore }, { merge: true });
    } catch (error) {
      console.error('Error saving to Firebase:', error);
    }
  };

  return [data, setValue, isLoaded];
}
