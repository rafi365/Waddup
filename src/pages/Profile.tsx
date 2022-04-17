import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { logOutOutline } from "ionicons/icons";
import "./Home.css";

const Profile: React.FC = () => {
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
        <h1 className="ion-margin-top">Om Burhan</h1>
        <h3><i>The "om jangan om" guy</i></h3>
        </div>
        <IonButton
          expand="block"
          className="ion-margin profile-button"
          color="danger"
        >
          <IonLabel className="ion-padding ion-margin">Logout</IonLabel>
          <IonIcon icon={logOutOutline} />
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
