import { IonAvatar, IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonText, IonThumbnail, IonTitle, IonToolbar } from '@ionic/react';
import './Home.css';
import { chatboxEllipsesOutline, searchOutline } from 'ionicons/icons';

const Home: React.FC = () => (
  <IonPage>
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
        <IonItem color='secondary' lines="full" button>
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
        <IonItem color='secondary' lines="full" button>
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
            <IonFabButton color='primary' routerLink='/tabs/new'>
                <IonIcon icon={chatboxEllipsesOutline}/>
            </IonFabButton>
        </IonFab>
    </IonContent>
  </IonPage>
);

export default Home;
