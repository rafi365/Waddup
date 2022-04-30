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
  IonList,
  IonMenuButton,
  IonModal,
  IonPage,
  IonRow,
  IonText,
  IonThumbnail,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import { query, collection, where, getDocs, QuerySnapshot, documentId } from "firebase/firestore";
import { ban, personAddOutline, searchOutline, trashBin } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { addContact, db, getContactIDs } from "../firebaseConfig";
import "./Home.css";

const Contact: React.FC = () => {
  const slidingContactRef = useRef<HTMLIonItemSlidingElement>(null);

  const [isAdding, setIsAdding] = useState(false);
  const [startDeleting, setStartDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [contactList, setContactList] = useState<string[]>();
  const contactref = useRef<HTMLIonInputElement>(null);

  const startAddContactHandler = () => {
    console.log('Adding contact...');
    setIsAdding(true);
  }

  const startDeleteContactHandler = () => {
    console.log("starting delete, awaiting confirmation...");
    setStartDeleting(true);
    slidingContactRef.current?.closeOpened();
  };

  const deleteContactHandler = () => {
    setStartDeleting(false);
    setToastMessage('Contact has been deleted!')
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
      console.log(e);
      if (!!e?.length) {
        // console.log('IN!')
        let temp: string[] = [];
        while (e.length) {
          // console.log(e.splice(0,10));
          const query_batch = e.splice(0, 10);// splits contacts list to get under the 10 per query limit
          const querysearch = query(collection(db, "users"), where(documentId(), "in", query_batch));//WARNING ONLY 10 MAX QUERRIES(according to docs)
          // console.log('fired!')
          getDocs(querysearch).then((querySnapshot) => {
            // console.log(q)
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              console.log(doc.id, " => ", doc.data());
              temp.push(doc.data()['name']);
            });
            setContactList(temp);
          }).catch((e) => {
            console.log(e);
          })

        }
      }
    })
  }
  useEffect(() => {
    refreshcontact();
  }, []);

  return (
    <>
      <IonAlert isOpen={startDeleting}
        header="Are you sure?"
        message="Do you want to delete this friend? This cannot be undone."
        buttons={[
          { text: 'No', role: 'cancel', handler: () => { setStartDeleting(false) } },
          { text: 'Yes', handler: deleteContactHandler }
        ]} />
      <IonPage>

        <IonModal isOpen={isAdding}>
          <IonHeader>
            <IonToolbar>
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
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle className="cus_font">Waddup</IonTitle>
            <IonButtons slot="end" className="ion-margin">
              <IonButton slot="icon-only">
                <IonIcon icon={searchOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          {!!contactList ? contactList?.map((e) => {
            return (
              <IonItemSliding ref={slidingContactRef}>
                <IonItem color="secondary" lines="full" button>
                  <IonThumbnail slot="start" className="ion-margin">
                    <IonAvatar>
                      <img src="https://media.discordapp.net/attachments/765461987718332416/962249598267687012/unknown.png" />
                    </IonAvatar>
                  </IonThumbnail>
                  <IonLabel color="light" className="ion-margin">
                    <IonText>
                      <strong>{e}</strong>
                    </IonText>
                    <br />
                    <p>lorem ipsum dolor bae</p>
                  </IonLabel>
                </IonItem>
                <IonItemOptions side="end">
                  <IonItemOption color="danger" onClick={startDeleteContactHandler}>
                    <IonIcon slot="icon-only" icon={trashBin} />
                  </IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            )
          }) : <h1>No Contacts yet</h1>}
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
