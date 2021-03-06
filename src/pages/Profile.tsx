import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { App } from "@capacitor/app";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  useIonViewWillLeave,
} from "@ionic/react";
import { signOut } from "firebase/auth";
import { logOutOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import CameraUploader from "../components/CameraUploader";
import { auth, editProfile, getSingleUser, Wuserdata } from "../firebaseConfig";
import "./Home.css";

const Profile: React.FC = () => {
  const history = useHistory();
  const [name, setName] = useState<string>();
  const [status, setStatus] = useState<string>();
  const [userInfo, setUserInfo] = useState<Wuserdata | null>(null);
  const [modalProfile, setModalProfile] = useState(false);

  const signout = async () => {
    await signOut(auth)
    // Sign-out successful.
    await FirebaseAuthentication.signOut();
    console.log("logged OUT!!!")
    history.replace('/login');

  }

  useEffect(() => {
    getSingleUser(auth.currentUser?.uid).then((e) => { setUserInfo(e) })

  }, []);
  useEffect(() => {
    refreshUser();
  }, [userInfo]);

  const refreshUser = () => {
    setName(userInfo?.name ? userInfo.name : "");
    setStatus(userInfo?.status ? userInfo.status : "");
  }
  const modalHandler = () => {
    if (modalProfile === false) {
      setModalProfile(true);
    } else {
      setModalProfile(false);
    }

  }

  const saveProfile = () => {
    const tname = name ? name : "";
    const tstatus = status ? status : "";
    editProfile(tname, tstatus).then((e) => {
      getSingleUser(auth.currentUser?.uid).then((e) => { setUserInfo(e) })
    })
    modalHandler()
  }
  //backbutton management
  App.addListener('backButton', data => {
    console.log('Restored state profile :', data);
    setModalProfile(false);
  });
  useIonViewWillLeave(() => {
    console.log("profile unmounted!");
    App.removeAllListeners()
  })

  return (
    <IonPage>
      <IonModal isOpen={modalProfile} backdropDismiss={false}>
        <IonHeader>
          <IonTitle className="ion-text-center ion-padding">Edit Profile</IonTitle>
        </IonHeader>
        <IonContent>
          {!!auth.currentUser?.uid ? <CameraUploader onlypathtofile="users/" filename={auth.currentUser.uid} functioncallbackresult={saveProfile} /> : ""}
          <IonList className="ion-text-center">
            <IonItem>
              <IonLabel>Name:</IonLabel>
              <IonInput value={name} onIonChange={(e) => setName(e.detail.value! ? e.detail.value! : "")} />
            </IonItem>
            <IonItem>
              <IonLabel>Status:</IonLabel>
              <IonInput value={status} onIonChange={(e) => setStatus(e.detail.value! ? e.detail.value! : "")} />
            </IonItem>
          </IonList>
        </IonContent>
        <IonButton onClick={saveProfile} className="ion-margin">Save</IonButton>
        <IonButton onClick={(modalHandler)} className="ion-margin">Cancel</IonButton>
      </IonModal>

      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/home" />
          </IonButtons>
          <IonTitle className="cus_font">Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen color="secondary">
        <div className="container">
          <IonCard className="ion-padding" style={{ borderRadius: "10px" }}>

            <img
              src={!!userInfo?.avatarurl ? userInfo.avatarurl : "https://media.discordapp.net/attachments/926433926027808770/965095961418428476/IMG_20220410_233007.jpg?width=476&height=480"}
              alt="#"
            />

            <IonGrid className="center-info">
              <IonRow>
                <IonCol className="ion-align-items-center">
                  <IonList className="ion-text-center">
                    <IonItem>
                      <IonTitle>Name: {userInfo?.name}</IonTitle>
                    </IonItem>
                    <IonItem>
                      <IonTitle>
                        Friend ID:
                        <IonText style={{ fontStyle: "italic" }}> {userInfo?.friendID}</IonText>
                      </IonTitle>
                    </IonItem>
                  </IonList>
                </IonCol>
              </IonRow>
            </IonGrid>
            <IonTitle style={{ fontStyle: "italic" }}>{!!userInfo?.status?.length ? userInfo.status : <i>No status is set!</i>}</IonTitle>
            <IonButton className="ion-margin" onClick={(modalHandler)}>Edit</IonButton>
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
