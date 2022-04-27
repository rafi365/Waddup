import { initializeApp } from "firebase/app";
import { collection, doc, getDoc, getDocs, getFirestore, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCh0OtU9PeSgz1mdW6SyZ7HbWo0VbX7z2E",
    authDomain: "waddup-b49eb.firebaseapp.com",
    projectId: "waddup-b49eb",
    storageBucket: "waddup-b49eb.appspot.com",
    messagingSenderId: "697022643939",
    appId: "1:697022643939:web:9fd05ce1f5d0629dbdcfd6",
    measurementId: "G-0BSB5XPS79"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export const checkFriendIDdupe = async (textid:string)=> {
    const querysearch = query(collection(db, "users"), where("friendID", "==", textid));
    
    const querySnapshot = await getDocs(querysearch);
    let islooping = false;
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      islooping =true;
    });
    return(islooping);
}


export async function addUser(name:string,friendID:string,){
	try {
		const docRef = await setDoc(doc(db, "users", auth.currentUser!.uid), {
			timestamp: serverTimestamp(),
			  name:name,
              friendID:friendID,
              avatarurl:null
			});
	  
		console.log("Document written with ID: ", docRef);
	  } catch (e) {
		console.error("Error adding document: ", e);
	  }
}

export const getusername = async () => {
	const docSnap = await getDoc(doc(db, "users", auth.currentUser!.uid));
	if (docSnap.exists()) {
		console.log("Document data:", docSnap.data().name);
		return `${docSnap.data().name}`.toString();
	  } else {
		// doc.data() will be undefined in this case
		console.log("No such document!");
		return "Unknown";
	  }
}
