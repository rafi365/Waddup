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
import { ban, personAddOutline, searchOutline, trashBin } from "ionicons/icons";
import { useRef, useState } from "react";
import "./Home.css";

const Contact: React.FC = () => {
  const slidingContactRef = useRef<HTMLIonItemSlidingElement>(null);

  const [ isAdding, setIsAdding ] = useState(false);
  const [ startDeleting, setStartDeleting] = useState(false);
  const [ toastMessage, setToastMessage ] = useState('');

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
    setToastMessage('Contact has been added!');
    setIsAdding(false);
  }

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
                            <IonTitle>Add Friend</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <IonGrid>
                            <IonRow className='ion-padding'>
                                <IonCol>
                                    <IonItem>
                                        <IonLabel position='floating'>Contact Name</IonLabel>
                                        <IonInput type='text'/>
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
          <IonItemSliding ref={slidingContactRef}>
            <IonItem color="secondary" lines="full" button>
              <IonThumbnail slot="start" className="ion-margin">
                <IonAvatar>
                  <img src="https://media.discordapp.net/attachments/765461987718332416/962249598267687012/unknown.png" />
                </IonAvatar>
              </IonThumbnail>
              <IonLabel color="light" className="ion-margin">
                <IonText>
                  <strong>Nama Placeholder</strong>
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
