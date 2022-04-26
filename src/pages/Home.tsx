import { IonAvatar, IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonMenuButton, IonModal, IonPage, IonRow, IonText, IonThumbnail, IonTitle, IonToast, IonToolbar, useIonViewWillEnter } from '@ionic/react';
import './Home.css';
import { chatboxEllipsesOutline, searchOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { auth } from '../firebaseConfig';

const Home: React.FC = () => {
  const [ isCreating, setIsCreating ] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const startCreatingHandler = () => {
    setIsCreating(true);
  };

  const createChatRoom = () => {
    setIsCreating(false);
    setToastMessage('Chat room has been created!');
  }
  return(
  <IonPage>
    <IonModal isOpen={isCreating}>
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
                  <IonButton  color='secondary' onClick={() => setIsCreating(false)}>Cancel</IonButton>
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
        <IonItem color='secondary' lines="full" button href='/chat'>
          <IonThumbnail slot="start" className='ion-margin'>
            <IonAvatar>
              <img src='https://media.discordapp.net/attachments/841587576464736266/946390659852546069/tasm3_confirmed_20220224_155923_0.jpg?width=338&height=338' />
            </IonAvatar>
          </IonThumbnail>
          <IonLabel color='light' className='ion-margin'>
            <IonText><strong>Nama Placeholder</strong></IonText><br />
            <p>lorem ipsum dolor bae</p>
            <p>12.00</p>
          </IonLabel>
        </IonItem>
        <IonItem color='secondary' lines="full">
          <IonThumbnail slot="start" className='ion-margin'>
            <IonAvatar>
              <img src='https://media.discordapp.net/attachments/841587576464736266/946390659852546069/tasm3_confirmed_20220224_155923_0.jpg?width=338&height=338' />
            </IonAvatar>
          </IonThumbnail>
          <IonLabel color='light' className='ion-margin'>
            <IonText><strong>Nama Placeholder</strong></IonText><br />
            <p>lorem ipsum dolor bae</p>
            <p>12.00</p>
          </IonLabel>
        </IonItem>
        <IonFab horizontal='end' vertical='bottom' slot='fixed'>
            <IonFabButton color='primary' onClick={startCreatingHandler}>
                <IonIcon icon={chatboxEllipsesOutline}/>
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
