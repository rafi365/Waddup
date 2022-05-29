import { initializeApp } from "firebase/app";
import { arrayRemove, arrayUnion, collection, doc, documentId, getDoc, getDocs, getFirestore, query, QueryDocumentSnapshot, serverTimestamp, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
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
export const storagedb = getStorage(app);

export const checkFriendIDdupe = async (textid: string) => {
  const querysearch = query(collection(db, "users"), where("friendID", "==", textid));

  const querySnapshot = await getDocs(querysearch);
  let islooping = false;
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
    islooping = true;
  });
  return (islooping);
}


export async function addUser(name: string, friendID: string, avatarURL: string | null) {
  try {
    const docRef = await setDoc(doc(db, "users", auth.currentUser!.uid), {
      timestamp: serverTimestamp(),
      name: name,
      friendID: friendID,
      avatarurl: avatarURL,
      status: "I'm new to Waddup!"
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
      // console.log(doc.id, " => ", doc.data());
      islooping = doc.id;
    });
    if (!!islooping) {
      if (islooping === auth.currentUser!.uid) return "Cannot add yourself as contact!";
      await updateDoc(doc(db, "users", auth.currentUser!.uid), {
        contacts: arrayUnion(islooping)
      });
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

    await updateDoc(doc(db, "users", auth.currentUser!.uid), {
      contacts: arrayRemove(friendID)
    });
    return "Contacts Successfully deleted!"
  } catch (e) {
    return `An Error Occoured! ${e}`;
  }
}

export const getSingleUser = async (userid: string | undefined) => {
  if (!userid) {
    return null;
  }
  const docSnap = await getDoc(doc(db, "users", userid));
  if (docSnap.exists()) {
    return usertoWuser(docSnap)
  } else {
    return null;
  }
}

export const getContactIDs = async () => {
  const docSnap = await getDoc(doc(db, "users", auth.currentUser!.uid));
  if (docSnap.exists()) {
    // console.log("Document data:", docSnap.data().name);
    const out: string[] = docSnap.data().contacts;

    return out;
  } else {
    // console.log("No such document!");
    return null;
  }
}
export const getusers = async (users: string[] | null | undefined) => {
  // const userarr:string[]|null = !!users? await users.map((e)=>e) : null; //for some reason length var is 0(even tho it has elements in it), so this workaround copies the array to a new one first before using it somewhere else
  const userarr = users;
  // console.log('nani?! ',userarr?.length)

  if (!!userarr?.length) {//checks if string array is empty
    // console.log('IN!', userarr)
    let temp: Wuserdata[] = [];
    while (userarr.length) {
      // console.log(e.splice(0,10));
      const query_batch = userarr.splice(0, 10);// splits contacts list to get under the 10 per query limit
      // console.log('while ', query_batch)
      const querysearch = query(collection(db, "users"), where(documentId(), "in", query_batch));//WARNING ONLY 10 MAX QUERRIES(according to docs)
      // console.log('fired!')
      const querySnapshot = await getDocs(querysearch)

      // console.log(querySnapshot)
      querySnapshot.forEach((doc) => {
        const a: Wuserdata = usertoWuser(doc);
        // console.log(a)
        temp.push(a);
      });
      // console.log('we got em! ',temp)


    }
    return temp;
  } else {
    // console.log('IT WAS NULL!!')
    return null;
  }
}

export type Wuserdata = {
  uid: string,
  avatarurl: string | null,
  contacts: string[] | null,
  friendID: string | null,
  name: string | null,
  timestamp: number | null,
  status: string | null
}

export type Wchat = {
  chatuid: string,
  chatname: string | null,
  users: Wuserdata[] | null,
  img: string | null,
  isgroup: string | null
}
export type Wchat_lite = {
  chatuid: string,
  chatname: string | null,
  users: string[] | null,
  img: string | null,
  isgroup: string | null
}

export type Wchatmessage = {
  uid: string | null,
  img: string | null,
  text: string | null,
  location: { lat: number, long: number } | null,
  userUID: string | null,
  timestamp: Timestamp
}

export const chatmessagetoWchatmessage = (chatmessage: QueryDocumentSnapshot) => {
  const a: Wchatmessage = {
    uid: chatmessage.id,
    img: chatmessage.data()['img'],
    text: chatmessage.data()['text'],
    location: chatmessage.data()['location'],
    userUID: chatmessage.data()['userUID'],
    timestamp: chatmessage.data()['timestamp']
  }
  return a;
}


export const usertoWuser = (userdata: QueryDocumentSnapshot) => {
  const a: Wuserdata = {
    uid: userdata.id,
    avatarurl: userdata.data()['avatarurl'],
    contacts: userdata.data()['contacts'],
    friendID: userdata.data()['friendID'],
    name: userdata.data()['name'],
    timestamp: userdata.data()['timestamp'],
    status: userdata.data()['status']
  }
  return a;
}

export const chattoWchat = async (chatinfo: QueryDocumentSnapshot) => {
  const asd: string[] = chatinfo.data()['users'];
  // console.log('chattowhat')
  let result = null;
  const e = await getusers(asd)
  // console.log('got users = ', e);
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

export const chattoWchat_lite = (chatinfo: QueryDocumentSnapshot) => {
  const a: Wchat_lite = {
    chatuid: chatinfo.id,
    chatname: chatinfo.data()['chatname'],
    img: chatinfo.data()['img'],
    isgroup: chatinfo.data()['isgroup'],
    users: chatinfo.data()['users']
  }
  return a;
}


export const getchatdata = async (chatid: string) => {
  const docRef = doc(db, "chats", chatid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    // console.log("Document data:", docSnap.data());
    return await chattoWchat(docSnap)
  } return null;
}

export const editProfile = async (name: string, status: string) => {
  let avatarurl = null;
  try {
    avatarurl = await getDownloadURL(ref(storagedb, "users/" + auth.currentUser!.uid))
  } catch (error) {
    console.log("data not found ", avatarurl);
  }
  await updateDoc(doc(db, "users", auth.currentUser!.uid), {
    name: name,
    avatarurl: avatarurl,
    status: status
  });
}

export const dataUrlToFile = async (dataUrl: string, fileName: string): Promise<File> => {
  const res: Response = await fetch(dataUrl);
  const blob: Blob = await res.blob();
  return new File([blob], fileName, { type: 'image/png' });
}

export const uploadPhotoHandler = async (dbpath: string, filename: string, base64imagedata: string) => {
  const selectedFile = await dataUrlToFile(base64imagedata, filename);
  const filefullpath = dbpath + filename;
  const storageRef = ref(storagedb, filefullpath);
  await uploadBytes(storageRef, selectedFile as Blob)
  const downloadurl = await getDownloadURL(ref(storagedb, filefullpath))
  return downloadurl;
}
