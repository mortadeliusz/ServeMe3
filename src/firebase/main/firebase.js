import { initializeApp } from "firebase/app";
import firebaseConfig from "./config.json";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  query,
  getDocs,
  getDoc,
  where,
  onSnapshot,
  collectionGroup
} from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { useState, useEffect } from "react";

console.log("initializing firebase...");
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default {
  getRestaurantWithItems: getRestaurantWithItems,
  getAllRestaurants: getAllRestaurants,
  addMenuItem: addMenuItem,
  createOrder: createOrder
};

export async function getRestaurantWithItems(restaurantID) {
  var output;

  const docRef = doc(db, "restaurants", restaurantID);
  const restaurantDocSnap = await getDoc(docRef);
  if (!restaurantDocSnap.exists()) return null;

  output = {
    id: restaurantDocSnap.id,
    ...restaurantDocSnap.data(),
    menuItems: []
  };

  const itemsQuery = query(
    collection(db, `restaurants/${restaurantDocSnap.id}/menuItems`)
  );

  const querySnapshot = await getDocs(itemsQuery);

  querySnapshot.forEach((doc) =>
    output.menuItems.push({ ...doc.data(), id: doc.id })
  );
  return output;
}

export async function getAllRestaurants() {
  const output = [];

  const restaurantsSnapshot = await getDocs(
    query(collection(db, "restaurants"))
  );

  restaurantsSnapshot.forEach((doc) =>
    output.push({ ...doc.data(), id: doc.id })
  );
  return output;
}

export async function addMenuItem(restaurantID, item) {
  const restaurantMenuItemsRef = collection(
    db,
    `restaurants/${restaurantID}/menuItems`
  );
  await setDoc(doc(restaurantMenuItemsRef), { ...item, created: new Date() });
}

export async function createOrder(order, rid) {
  const ordersRef = collection(db, `restaurants/${rid}/orders`);
  const docRef = await addDoc(ordersRef, {
    ...order,
    created: new Date()
  });
  return docRef.id;
}

export async function getUserOrders(uid) {
  const output = [];

  // const ordersSnapshot = await getDocs(
  //   query(collectionGroup(db, "orders"), where("uid", "==", uid))
  // );
  const ordersSnapshot = await getDocs(
    query(collectionGroup(db, "orders"), where("uid", "==", uid))
  );

  ordersSnapshot.forEach((doc) => output.push({ ...doc.data(), id: doc.id }));
  return output;
}
export function OrdersObserver() {
  const ordersQuery = query(collectionGroup(db, `orders`));
  const [snapshot, loading, error] = useCollection(ordersQuery);
  const orders = [];
  snapshot?.forEach((doc) => orders.push({ ...doc.data(), id: doc.id }));
  return (
    <div>
      {loading && <span>Collection: Loading...</span>}
      {snapshot &&
        orders.map((el) => (
          <p key={el.id}>
            {el.id} - {el.uid}
          </p>
        ))}
    </div>
  );
}
export function monitorUserOrders(userUID) {
  const q = query(collection(db, "orders"), where("uid", "==", userUID));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      console.log(change.type, change.doc.id, change.doc.data().status);
    });
  });
  return unsubscribe;
}

export async function googleAuth() {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const authData = signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken;

      // The signed-in user info.

      const { uid, displayName, photoURL } = result.user;
      const user = {
        uid: result.user.uid,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL
      };
      // const user = { uid: uid, displayName: displayName, photoURL: photoURL };
      // ...
      return user;
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
      console.log(errorCode, errorMessage);
    });

  return authData;
}
