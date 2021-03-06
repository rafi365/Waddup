import { App } from "@capacitor/app";
import {
  IonAlert,
  IonAvatar,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonMenuButton,
  IonModal,
  IonPage,
  IonRow,
  IonSearchbar,
  IonText,
  IonThumbnail,
  IonTitle,
  IonToast,
  IonToolbar,
  useIonViewDidEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import { query, collection, where, getDocs, documentId, addDoc } from "firebase/firestore";
import { chevronBackOutline, personAddOutline, searchOutline, trashBin } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { addContact, auth, db, deleteContact, getContactIDs, usertoWuser, Wuserdata } from "../firebaseConfig";
import "./Home.css";

const Contact: React.FC = () => {
  const slidingContactRef = useRef<HTMLIonItemSlidingElement>(null);
  const history = useHistory()
  const [isAdding, setIsAdding] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [startDeleting, setStartDeleting] = useState<string | boolean>(false);
  const [toastMessage, setToastMessage] = useState('');
  const [contactList, setContactList] = useState<Wuserdata[]>();
  const contactref = useRef<HTMLIonInputElement>(null);
  
  const startAddContactHandler = () => {
    setIsAdding(true);
  }

  const startDeleteContactHandler = (e: string) => {
    setStartDeleting(e);
    slidingContactRef.current?.closeOpened();
  };

  const deleteContactHandler = () => {
    deleteContact(startDeleting.toString()).then((e) => {
      setToastMessage(e);
      refreshcontact();
    })
    setStartDeleting(false);
  };

  const saveContactHandler = () => {
    const enteredcontact = contactref.current?.value?.toString();
    if (!!enteredcontact) {
      addContact(enteredcontact).then((e) => {
        setToastMessage(e);
        refreshcontact();
      })
    } else {
      setToastMessage('Input is Blank!');
    }
    setIsAdding(false);
  }
  const refreshcontact = () => {
    getContactIDs().then((e) => {
      // console.log(e);
      if (!!e?.length) {//checks if string array is empty
        // console.log('IN!')
        let temp: Wuserdata[] = [];
        while (e.length) {
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
  useEffect(() => {
    refreshcontact();
  }, []);

  const createDM = async (targetUserUID: string) => {
    const querysearch = query(collection(db, "chats"), where("isgroup", "==", false), where('users', '==', [auth.currentUser!.uid, targetUserUID]));
    const querysearch_reversed = query(collection(db, "chats"), where("isgroup", "==", false), where('users', '==', [targetUserUID, auth.currentUser!.uid]));
    const querySnapshot = await getDocs(querysearch);
    const querySnapshot_reversed = await getDocs(querysearch_reversed);
    //queries the database both ways as a workaround to firebase not supporting AND operation in array type field
    let resultids: string[] = []; //concat both results then picks the first one if array not empty
    querySnapshot.forEach((doc) => {
      resultids.push(doc.id);
    });
    querySnapshot_reversed.forEach((doc) => {
      resultids.push(doc.id);
    });
    // console.log("created DM", resultids);
    if (!!resultids.length) {
      history.replace('/chat/' + resultids[0]);
    } else {
      const docRef = await addDoc(collection(db, "chats"), {
        chatname: null,
        users: [auth.currentUser!.uid, targetUserUID],
        img: null,
        isgroup: false
      });
      const docid = docRef.id;
      history.replace('/chat/' + docid);
      // console.log("Document written with ID: ", docRef.id);
    }
  }
  //backbutton management
  useIonViewDidEnter(()=>{
    App.addListener('backButton', data => {
      console.log('Restored state contacts:', data);
      setIsAdding(false);
    });
  })
  useIonViewWillLeave(() => {
    console.log("contacts unmounted!");
    App.removeAllListeners()
  })

  return (
    <>
      <IonAlert isOpen={!!startDeleting}
        header="Are you sure?"
        message="Do you want to delete this contact? This cannot be undone."
        buttons={[
          { text: 'No', role: 'cancel', handler: () => { setStartDeleting(false) } },
          { text: 'Yes', handler: deleteContactHandler }
        ]} />
      <IonPage>

        <IonModal isOpen={isAdding}>
          <IonHeader>
            <IonToolbar color="primary">
              <IonTitle>Add Contact</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonGrid>
              <IonRow className='ion-padding'>
                <IonCol>
                  <IonItem>
                    <IonLabel position='floating'>FriendID</IonLabel>
                    <IonInput ref={contactref} type='text' />
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow className='ion-text-center'>
                <IonCol>
                  <IonButton color='secondary' expand='block' onClick={saveContactHandler}>Save</IonButton>
                </IonCol>
                <IonCol>
                  <IonButton fill='clear' color='dark' onClick={() => setIsAdding(false)}>Cancel</IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonContent>
        </IonModal>

        <IonHeader>
          {isSearch ?
            <IonToolbar>
              <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)} inputmode="search" showCancelButton='always' onIonCancel={() => setIsSearch(false)}></IonSearchbar>
            </IonToolbar>

            :
            <IonToolbar color="primary">
              <IonButtons slot="start">
                <IonMenuButton />
              </IonButtons>
              <IonTitle className="cus_font">Waddup</IonTitle>
              <IonButtons slot="end" className="ion-margin">
                <IonButton slot='icon-only' onClick={() => setIsSearch(true)}>
                  <IonIcon icon={searchOutline} />
                </IonButton>
              </IonButtons>
            </IonToolbar>}
        </IonHeader>
        <IonContent fullscreen >
          {!!contactList ? contactList?.map((e) => {
            if (e.name?.toLowerCase().includes(searchText.toLowerCase())) {
              return (
                <IonItemSliding ref={slidingContactRef} key={e.uid}>
                  <IonItem color="secondary" lines="full" onClick={() => createDM(e.uid)}>
                    <IonThumbnail slot="start" className="ion-margin">
                      <IonAvatar>
                        <img src={!!e.avatarurl ? e.avatarurl : "https://media.discordapp.net/attachments/765461987718332416/962249598267687012/unknown.png"} />
                      </IonAvatar>
                    </IonThumbnail>
                    <IonLabel className="label-chat">
                      <IonText>
                        <strong>{e.name}</strong>
                      </IonText>
                      <br />
                      <p>{e.status}</p>
                    </IonLabel>
                    <IonIcon slot="end" icon={chevronBackOutline} />
                  </IonItem>
                  <IonItemOptions side="end">
                    <IonItemOption color="danger" onClick={() => { startDeleteContactHandler(e.uid) }}>
                      <IonIcon slot="icon-only" icon={trashBin} />
                    </IonItemOption>
                  </IonItemOptions>
                </IonItemSliding>
              )
            }
            else {
              return (null);
            }
          }) : <h1 className="ion-padding">No Contacts yet</h1>}
          <IonFab horizontal="end" vertical="bottom" slot="fixed">
            <IonFabButton color="primary" onClick={startAddContactHandler}>
              <IonIcon icon={personAddOutline} />
            </IonFabButton>
          </IonFab>
        </IonContent>
        <IonToast isOpen={!!toastMessage}
          message={toastMessage}
          duration={2000}
          onDidDismiss={() => { setToastMessage('') }} />
      </IonPage>
    </>
  );
};

export default Contact;
