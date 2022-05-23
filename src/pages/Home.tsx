import { IonAvatar, IonBackButton, IonButton, IonButtons, IonCheckbox, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonMenuButton, IonModal, IonPage, IonRow, IonSearchbar, IonText, IonThumbnail, IonTitle, IonToast, IonToolbar, useIonViewWillEnter, useIonViewWillLeave } from '@ionic/react';
import './Home.css';
import { chatboxEllipsesOutline, searchOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { auth, chattoWchat_lite, db, getContactIDs, getusers, usertoWuser, Wchat, Wchat_lite, Wuserdata } from '../firebaseConfig';
import { onSnapshot, doc, collection, query, where, documentId, getDocs, addDoc } from 'firebase/firestore';
import NewUserConfig from '../components/NewUserConfig';
import { useForm } from 'react-hook-form';

const Home: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isNewUser, setNewUser] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [chats, setChats] = useState<Wchat_lite[]>();
  const [userList, setUserList] = useState<Wuserdata[] | null>();
  const [contactList, setContactList] = useState<Wuserdata[]>();

  const refreshcontact = () => {
    getContactIDs().then((e) => {
      // console.log(e);
      if (!!e?.length) {//checks if string array is empty
        // console.log('IN!')
        let temp: Wuserdata[] = [];
        while (e.length) {
          // console.log(e.splice(0,10));
          const query_batch = e.splice(0, 10);// splits contacts list to get under the 10 per query limit
          const querysearch = query(collection(db, "users"), where(documentId(), "in", query_batch));//WARNING ONLY 10 MAX QUERRIES(according to docs)
          // console.log('fired!')
          getDocs(querysearch).then((querySnapshot) => {
            // console.log(q)
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              // console.log(doc.id, " => ", doc.data());
              const a: Wuserdata = usertoWuser(doc);
              temp.push(a);
            });
            setContactList(temp);
          }).catch((e) => {
            console.log(e);
          })

        }
      } else {
        setContactList(undefined);
      }
    })
  }

  const startCreatingHandler = () => {
    refreshcontact();
    setIsCreating(true);
  };

  const createChatRoom = () => {
    setIsCreating(false);
    setToastMessage('Chat room has been created!');
  }

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "users", auth.currentUser!.uid.toString()), (doc) => {//checking if user just signed up(2nd signup stage check)
      console.log("Current data: ", !doc.data());
      setNewUser(!doc.data())//true if not found
    });
    const q = query(collection(db, "chats"), where("users", "array-contains", auth.currentUser?.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const temp: Wchat_lite[] = [];
      querySnapshot.forEach((doc) => {
        temp.push(chattoWchat_lite(doc));
        console.log(temp);
      });
      setChats(temp);

    });
    // return () => { unsub; unsubscribe }; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    let mounted = true;
    let users: string[] = [];
    chats?.forEach((e) => {
      if (!e.isgroup) {//if group false
        const temp = e.users?.find((e) => e !== auth.currentUser?.uid)
        if (temp) {
          users.push(temp)
        }
      }
      // console.log(users)
    })
    getusers(users).then((e) => {
      if (mounted) {
        // only try to update if we are subscribed (or mounted)
        setUserList(e)
      }
    })
    return () => { mounted = false }; // cleanup function
  }, [chats]);

  const { register, handleSubmit } = useForm();
  const history = useHistory()
  const createGroup = async (targetUserUID: string[], chatname: string) => {
      const docRef = await addDoc(collection(db, "chats"), {
        chatname: chatname,
        users: [auth.currentUser!.uid].concat(targetUserUID),
        img: null,
        isgroup: true
      });
      const docid = docRef.id;
      history.replace('/chat/' + docid);
      console.log("Document written with ID: ", docRef.id);
  }
  const makeGroupHandler = (data: any) => {
    setIsCreating(false);
    const result = contactList?.flatMap((e) =>
      (!!data[e.uid]) ? [e.uid] : []
    )
    if (result?.length) {
      createGroup(result, data["gname"]);

    } else {
      setToastMessage('Please add at least 1 contact to the group!');
    }
    console.log("FORM", result);
    // console.log(data);

  }
  return (
    <IonPage>

      <IonModal isOpen={isNewUser} backdropDismiss={false}>
        <IonHeader>
          <IonToolbar color='primary'>
            <IonTitle>Welcome to Waddup!</IonTitle>
          </IonToolbar>
        </IonHeader>
        <NewUserConfig />
      </IonModal>

      <IonModal isOpen={isCreating} backdropDismiss={false}>
        <IonHeader>
          <IonToolbar color='primary'>
            <IonTitle>Create Group Chat</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <form onSubmit={handleSubmit(makeGroupHandler)}>
            <IonLabel className='ion-margin'>Group Name</IonLabel>
            <IonInput required placeholder='Insert Group Name' {...register("gname")} />

            <IonList>
              <IonListHeader>Contact list</IonListHeader>
              <IonContent style={{ height: "500px" }}>
                {!!contactList ? contactList?.map((e) => {
                  return (
                    <div key={e.uid}>
                      <label htmlFor={e.uid!.toString()}>
                        <IonItem color='secondary' lines="full">
                          <input type='checkbox' slot='start' {...register(e.uid!.toString(), {})} id={e.uid!.toString()} />
                          <IonThumbnail slot="start" className='ion-margin' >
                            <IonAvatar>
                              <img src={!!e.avatarurl ? e.avatarurl : 'https://media.discordapp.net/attachments/841587576464736266/946390659852546069/tasm3_confirmed_20220224_155923_0.jpg'} />
                            </IonAvatar>
                          </IonThumbnail>
                          <IonLabel className='label-chat'>
                            <IonText><strong>{e.name}</strong></IonText><br />
                            <p>{e.status}</p>
                          </IonLabel>
                        </IonItem>
                      </label>
                    </div>
                  )
                }) : <h1>No Contacts!</h1>}
              </IonContent>

            </IonList>
            <IonButton
              type='submit'
              color="secondary"
              className='ion-text-center'
              expand='block'
            > Make Group
            </IonButton>
          </form>


          <IonRow className='ion-text-center'>
            <IonCol>
              <IonButton color='secondary' onClick={() => setIsCreating(false)}>Cancel</IonButton>
            </IonCol>
          </IonRow>

        </IonContent>
      </IonModal>
      <IonHeader>
        {isSearch ?
          <IonToolbar>
            <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)} inputmode="search" showCancelButton='always' onIonCancel={() => setIsSearch(false)}></IonSearchbar>
          </IonToolbar>

          :

          <IonToolbar color='primary'>
            <IonButtons slot='start'>
              <IonMenuButton />
            </IonButtons>
            <IonTitle className='cus_font'>Waddup</IonTitle>
            <IonButtons slot='end' className='ion-margin'>
              <IonButton slot='icon-only' onClick={() => setIsSearch(true)}>
                <IonIcon icon={searchOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>}

      </IonHeader>
      <IonContent fullscreen>
        {chats?.length ? chats?.map((e) => {
          let chatname: string | null | undefined = "";
          let userstatus: string | null | undefined = "";
          let chatpic: string | null | undefined = "";
          if (e.isgroup) {
            chatname = e.chatname
            chatpic = e.img
          } else {
            const t = e.users?.find(e => e !== auth.currentUser?.uid)
            chatname = userList?.find(e => e.uid === t)?.name
            userstatus = userList?.find(e => e.uid === t)?.status
            chatpic = userList?.find(e => e.uid === t)?.avatarurl
          }
          if (chatname?.toLowerCase().includes(searchText.toLowerCase())) {
            return (
              <IonItem key={e.chatuid} color='secondary' lines="full" button routerLink={`/chat/${e.chatuid}`}>
                <IonThumbnail slot="start" className='ion-margin'>
                  <IonAvatar>
                    <img src={!!chatpic ? chatpic : 'https://media.discordapp.net/attachments/841587576464736266/946390659852546069/tasm3_confirmed_20220224_155923_0.jpg'} />
                  </IonAvatar>
                </IonThumbnail>
                <IonLabel  className='label-chat'>
                  <IonText><strong>{chatname}</strong></IonText><br />
                  <p>{userstatus}</p>
                  {/* <p>12.00</p> */}
                </IonLabel>
              </IonItem>
            )
          }
          else {
            return (null);
          }
        }) : <h1>You haven't chatted with any one yet</h1>}
        <IonFab horizontal='end' vertical='bottom' slot='fixed'>
          <IonFabButton color='primary' onClick={startCreatingHandler}>
            <IonIcon icon={chatboxEllipsesOutline} />
          </IonFabButton>
        </IonFab>
        <IonToast isOpen={!!toastMessage}
          message={toastMessage}
          duration={3000}
          onDidDismiss={() => { setToastMessage('') }} />
      </IonContent>
    </IonPage>
  );
}

export default Home;
