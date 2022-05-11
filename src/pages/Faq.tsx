import {
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";

const Faq: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/home" />
          </IonButtons>
          <IonTitle className="cus_font">
            Frequently Asked Question (not really...)
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen color="medium">
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonCard>
                {/* <img
                  src="https://media.discordapp.net/attachments/926433926027808770/965095961418428476/IMG_20220410_233007.jpg?width=476&height=480"
                  alt="#"
                /> */}
                <IonCardHeader>
                  <IonCardTitle>What is the purpose of Waddup?</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  The main purpose of Waddup is to fulfill the final assignment of IF670 Class.
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol>
              <IonCard>
                {/* <img
                  src="https://media.discordapp.net/attachments/926433926027808770/965095961418428476/IMG_20220410_233007.jpg?width=476&height=480"
                  alt="#"
                /> */}
                <IonCardHeader>
                  <IonCardTitle>What is the purpose of Waddup?</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  The main purpose of Waddup is to fulfill the final assignment of IF670 Class.
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Faq;
