import firebase from 'firebase/app'
import "firebase/auth"
import "firebase/storage"
import "firebase/firestore";

firebase.initializeApp(
    {
        apiKey: "AIzaSyAquVFJIVKzO03GcG7wWkdpPZacmxjto50",
        authDomain: "rollingstone-s.firebaseapp.com",
        projectId: "rollingstone-s",
        storageBucket: "rollingstone-s.appspot.com",
        messagingSenderId: "796867556247",
        appId: "1:796867556247:web:4c4ae056bf5804ab038ad2"
    }
)
const firestore = firebase.firestore();

export const database ={
    users:firestore.collection('users'),//creating collections here so that our main app doesn't have access to firestore 
    //for safety reasons
    posts: firestore.collection("posts"),
    comments: firestore.collection("comments"),
    getCurrentTimeStamp : firebase.firestore.FieldValue.serverTimestamp
}
// export default firebase;
//difference between storage and database is that a storage stores a txt file or image 
//whereas a database stores a structured/semi-structured type of data like IDs, records etc
export const storage = firebase.storage();
export const auth = firebase.auth();