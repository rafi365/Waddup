import { IonAvatar, IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonMenuButton, IonModal, IonPage, IonRow, IonText, IonThumbnail, IonTitle, IonToast, IonToolbar, useIonViewWillEnter, useIonViewWillLeave } from '@ionic/react';
import './Home.css';
import { chatboxEllipsesOutline, searchOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { auth, chattoWchat_lite, db, getusers, Wchat, Wchat_lite, Wuserdata } from '../firebaseConfig';
import { onSnapshot, doc, collection, query, where } from 'firebase/firestore';
import NewUserConfig from '../components/NewUserConfig';

const Home: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isNewUser, setNewUser] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [chats, setChats] = useState<Wchat_lite[]>();
  const [userList, setUserList] = useState<Wuserdata[] | null>();

  const startCreatingHandler = () => {
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
    return () => { unsub; unsubscribe }; // unsubscribe on unmount
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
            <IonTitle>Create Chat Room</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonItem color='secondary' lines="full" button onClick={createChatRoom}>
            <IonThumbnail slot="start" className='ion-margin'>
              <IonAvatar>
                <img src='https://media.discordapp.net/attachments/841587576464736266/946390659852546069/tasm3_confirmed_20220224_155923_0.jpg?width=338&height=338' />
              </IonAvatar>
            </IonThumbnail>
            <IonLabel color='light' className='ion-margin'>
              <IonText><strong>Nama Placeholder</strong></IonText><br />
              <p>lorem ipsum dolor bae</p>

            </IonLabel>
          </IonItem>

          <IonRow className='ion-text-center'>
            <IonCol>
              <IonButton color='secondary' onClick={() => setIsCreating(false)}>Cancel</IonButton>
            </IonCol>
          </IonRow>

        </IonContent>
      </IonModal>
      <IonHeader>
        <IonToolbar color='primary'>
          <IonButtons slot='start'>
            <IonMenuButton />
          </IonButtons>
          <IonTitle className='cus_font'>Waddup</IonTitle>
          <IonButtons slot='end' className='ion-margin'>
            <IonButton slot='icon-only'>
              <IonIcon icon={searchOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {chats?.map((e) => {
          let chatname: string | null | undefined = "";
          if (e.isgroup) {
            chatname = e.chatname
          } else {
            const t = e.users?.find(e => e !== auth.currentUser?.uid)
            chatname = userList?.find(e => e.uid === t)?.name
          }
          return (
            <IonItem key={e.chatuid} color='secondary' lines="full" button routerLink={`/chat/${e.chatuid}`}>
              <IonThumbnail slot="start" className='ion-margin'>
                <IonAvatar>
                  <img src='https://media.discordapp.net/attachments/841587576464736266/946390659852546069/tasm3_confirmed_20220224_155923_0.jpg?width=338&height=338' />
                </IonAvatar>
              </IonThumbnail>
              <IonLabel color='light' className='ion-margin'>
                <IonText><strong>{chatname}</strong></IonText><br />
                <p>lorem ipsum dolor bae</p>
                <p>12.00</p>
              </IonLabel>
            </IonItem>
          )
        })}
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
