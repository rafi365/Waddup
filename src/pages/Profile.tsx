import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import { signOut } from "firebase/auth";
import { logOutOutline, personSharp } from "ionicons/icons";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { auth, getusername, getuserid } from "../firebaseConfig";
import "./Home.css";

const Profile: React.FC = () => {
  const history = useHistory();
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const signout = () => signOut(auth).then(() => {
    // Sign-out successful.
    history.replace('/login');
  }).catch((error) => {
    // An error happened.
    console.log(error)
  });
  useIonViewWillEnter(() => {
    getusername(auth.currentUser!.uid).then((a) => setName(a));
    getuserid(auth.currentUser!.uid).then((a) => setUserId(a));
  });
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/home" />
          </IonButtons>
          <IonTitle className="cus_font">Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen color="medium">
        <div className="container">
          <IonCard className="ion-padding" style={{borderRadius:"10px"}}>
          <img
            src="https://media.discordapp.net/attachments/926433926027808770/965095961418428476/IMG_20220410_233007.jpg?width=476&height=480"
            alt="#"
          />
          {/* <h1 className="ion-margin-top">Om Burhan</h1> */}
        
          <IonGrid className="center-info">
            <IonRow>
              <IonCol className="ion-align-items-center">
              <IonList className="ion-text-center">
                <IonItem>
                  <IonTitle>Name: {name}</IonTitle>
                </IonItem>
                <IonItem> 
                  <IonTitle>
                    UserID:
                    <IonText style={{fontStyle:"italic"}}> {userId}</IonText>
                  </IonTitle>
                </IonItem>
              </IonList>
              </IonCol>
            </IonRow>
          </IonGrid>
          <IonTitle style={{fontStyle:"italic"}}>The "om jangan om" guy</IonTitle>
          </IonCard>
        </div>

        <IonButton
          expand="block"
          className="ion-margin profile-button"
          color="danger"
          onClick={signout}
        >
          <IonLabel className="ion-padding ion-margin">Logout</IonLabel>
          <IonIcon icon={logOutOutline} />
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
