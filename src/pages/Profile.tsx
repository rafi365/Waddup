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
  IonLabel,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import { signOut } from "firebase/auth";
import { logOutOutline } from "ionicons/icons";
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
          <img
            src="https://media.discordapp.net/attachments/926433926027808770/965095961418428476/IMG_20220410_233007.jpg?width=476&height=480"
            alt="#"
          />
          {/* <h1 className="ion-margin-top">Om Burhan</h1> */}
          <IonRow className="ion-align-items-center">
            <IonCol>
              <h1 className="ion-margin-top">Name: {name}</h1>
              <h3>UserId: <i>{userId}</i></h3>
            </IonCol>
          </IonRow>
          <h3><i>The "om jangan om" guy</i></h3>
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
