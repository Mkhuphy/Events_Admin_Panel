
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider, signOut } from "firebase/auth";
import { getFirestore, addDoc, doc, collection, setDoc, query, where , getDoc,getDocs } from "firebase/firestore";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDGp3qtZtaJ1hQWEVW45XJwDxquogCQq3c",
  authDomain: "events22-3e675.firebaseapp.com",
  projectId: "events22-3e675",
  storageBucket: "events22-3e675.appspot.com",
  messagingSenderId: "3588020150",
  appId: "1:3588020150:web:17977d074e65aae58dd317",
  measurementId: "G-4QPLFX0B28"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);
const profileRef = collection(db, "People");



export const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
      .then((result) => {
        return result.user;
      })
      .catch((error) => {
        console.log(error);
      });
  };


  export const signInWithFacebook = () => {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const name = result.user.displayName;
        const email = result.user.email;
        const profilePic = result.user.photoURL;  
      
      })
      .catch((error) => {
        console.log(error);
      });
  };

  onAuthStateChanged(auth, user => {
    if (user) {

    }
    else {

    }
  })

const logout = () => {
  console.log("hello you need to login")
  signOut(auth);
  };

const getProfile = async (id) =>{
  const docRef = doc(db, "Admins", id);
  try {
    const docSnap =  await getDoc(docRef);
    return docSnap;
  } catch(error) {
      console.log(error)
  }
}

 async function setProfile(data, id, RBY) {
    await setDoc(doc(db, "Admins", id), data,{merge: true});

}

const uploadImage = async (image,id) => {
  const data = new FormData()
  data.append("file", image)
  data.append("upload_preset", "geeky_images")
  data.append("cloud_name","udghosh")
  await fetch("https://api.cloudinary.com/v1_1/udghosh/image/upload",{
    method:"post",
    body: data
  })
  .then(resp => resp.json())
  .then(data => {
    setDoc(doc(db, "People", id), {url: data.url},{merge: true});
    console.log("---------"+data.url+"--------");
    return data.url;
  })
  .catch(err => console.log(err))
}

export {
  logout,
  db,
  setProfile,
  uploadImage,
  getProfile
};