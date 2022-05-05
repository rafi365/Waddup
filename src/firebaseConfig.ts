import { initializeApp } from "firebase/app";
import { addDoc, arrayRemove, arrayUnion, collection, doc, documentId, getDoc, getDocs, getFirestore, query, QueryDocumentSnapshot, serverTimestamp, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useHistory } from "react-router";
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

export const checkFriendIDdupe = async (textid: string) => {
  const querysearch = query(collection(db, "users"), where("friendID", "==", textid));

  const querySnapshot = await getDocs(querysearch);
  let islooping = false;
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    islooping = true;
  });
  return (islooping);
}


export async function addUser(name: string, friendID: string,) {
  try {
    const docRef = await setDoc(doc(db, "users", auth.currentUser!.uid), {
      timestamp: serverTimestamp(),
      name: name,
      friendID: friendID,
      avatarurl: null
    });

    console.log("Document written with ID: ", docRef);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
export async function addContact(friendID: string) {
  try {
    const querysearch = query(collection(db, "users"), where("friendID", "==", friendID));

    const querySnapshot = await getDocs(querysearch);
    let islooping = null;
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      islooping = doc.id;
    });
    if (!!islooping) {
      if (islooping === auth.currentUser!.uid) return "Cannot add yourself as contact!";
      const docRef = await updateDoc(doc(db, "users", auth.currentUser!.uid), {
        contacts: arrayUnion(islooping)
      });
      docRef;
      return "Contacts Successfully added!";
    }
    return "FriendID Not Found!";

    // console.log("Document written with ID: ", docRef);
  } catch (e) {
    // console.error("Error adding document: ", e);
    return `An Error Occoured! ${e}`;
  }
}
export async function deleteContact(friendID: string) {
  try {

    const docRef = await updateDoc(doc(db, "users", auth.currentUser!.uid), {
      contacts: arrayRemove(friendID)
    });
    docRef;
    return "Contacts Successfully deleted!"

    // console.log("Document written with ID: ", docRef);
  } catch (e) {
    // console.error("Error adding document: ", e);
    return `An Error Occoured! ${e}`;
  }
}

export const getusername = async (userid: string) => {
  const docSnap = await getDoc(doc(db, "users", userid));
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data().name);
    return `${docSnap.data().name}`.toString();
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
    return "Unknown";
  }
}

export const getContactIDs = async () => {
  const docSnap = await getDoc(doc(db, "users", auth.currentUser!.uid));
  if (docSnap.exists()) {
    // console.log("Document data:", docSnap.data().name);
    const out: string[] = docSnap.data().contacts;

    return out;
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
    return null;
  }
}
export const getusers = async (users: string[] | null | undefined) => {
  // const userarr:string[]|null = !!users? await users.map((e)=>e) : null; //for some reason length var is 0(even tho it has elements in it), so this workaround copies the array to a new one first before using it somewhere else
  const userarr = users;
  // console.log('nani?! ',userarr?.length)

  if (!!userarr?.length) {//checks if string array is empty
    console.log('IN!', userarr)
    let temp: Wuserdata[] = [];
    while (userarr.length) {
      // console.log(e.splice(0,10));
      const query_batch = userarr.splice(0, 10);// splits contacts list to get under the 10 per query limit
      console.log('while ', query_batch)
      const querysearch = query(collection(db, "users"), where(documentId(), "in", query_batch));//WARNING ONLY 10 MAX QUERRIES(according to docs)
      // console.log('fired!')
      const querySnapshot = await getDocs(querysearch)

      console.log(querySnapshot)
      querySnapshot.forEach((doc) => {
        const a: Wuserdata = usertoWuser(doc);
        console.log(a)
        temp.push(a);
      });
      // console.log('we got em! ',temp)


    }
    return temp;
  } else {
    console.log('IT WAS NULL!!')
    return null;
  }
}

export type Wuserdata = {
  uid: string,
  avatarurl: string | null,
  contacts: string[] | null,
  friendID: string | null,
  name: string | null,
  timestamp: number
}

export type Wchat = {
  chatuid: string,
  chatname: string | null,
  users: Wuserdata[] | null,
  img: string | null,
  isgroup: string | null
}

export type Wchatmessage = {
  uid: string | null,
  img: string | null,
  text: string | null,
  userUID: string | null,
  timestamp: Timestamp
}

export const chatmessagetoWchatmessage = (chatmessage: QueryDocumentSnapshot) => {
  const a: Wchatmessage = {
    uid: chatmessage.id,
    img: chatmessage.data()['img'],
    text: chatmessage.data()['text'],
    userUID: chatmessage.data()['userUID'],
    timestamp: chatmessage.data()['timestamp']
  }
  return a;
}


export const usertoWuser = (userdata: any) => {
  const a: Wuserdata = {
    uid: userdata.id,
    avatarurl: userdata.data()['avatarurl'],
    contacts: userdata.data()['contacts'],
    friendID: userdata.data()['friendID'],
    name: userdata.data()['name'],
    timestamp: userdata.data()['timestamp']
  }
  return a;
}

export const chattoWchat = async (chatinfo: QueryDocumentSnapshot) => {
  const asd: string[] = chatinfo.data()['users'];
  console.log('chattowhat')
  let result = null;
  const e = await getusers(asd)
  console.log('got users = ', e);
  const a: Wchat = {
    chatuid: chatinfo.id,
    chatname: chatinfo.data()['chatname'],
    img: chatinfo.data()['img'],
    isgroup: chatinfo.data()['isgroup'],
    users: !!e ? e : null
  }
  result = a;
  return result;
}

export const getchatdata = async (chatid: string) => {
  const docRef = doc(db, "chats", chatid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return await chattoWchat(docSnap)
  } return null;
}