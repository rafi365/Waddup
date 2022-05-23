import {
  IonAvatar,
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
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonText,
  IonThumbnail,
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
      <IonContent fullscreen color="secondary">
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
            
          </IonRow>
          <IonRow>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Developer Team</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonItem>
                  <IonThumbnail slot="start" className="ion-margin">
                    <IonAvatar>
                      <img src="https://cdn.discordapp.com/attachments/938285633657532456/974593450731274260/edrick.png"/>
                    </IonAvatar>
                  </IonThumbnail>
                  <IonLabel>
                    <IonText>Edrick Sugiharto Putra</IonText>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonThumbnail slot="start" className="ion-margin">
                    <IonAvatar>
                      <img src="https://cdn.discordapp.com/attachments/938285633657532456/974593450945150976/fahmi1.jpg"/>
                    </IonAvatar>
                  </IonThumbnail>
                  <IonLabel>
                    <IonText>Fahmi Ihsan</IonText>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonThumbnail slot="start" className="ion-margin">
                    <IonAvatar>
                      <img src="https://cdn.discordapp.com/attachments/938285633657532456/974593451175866368/zidane.jpg"/>
                    </IonAvatar>
                  </IonThumbnail>
                  <IonLabel>
                    <IonText>Moh Rizki Zidane</IonText>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonThumbnail slot="start" className="ion-margin">
                    <IonAvatar>
                      <img src="https://cdn.discordapp.com/attachments/938285633657532456/974593450311839754/nayfos.jpg"/>
                    </IonAvatar>
                  </IonThumbnail>
                  <IonLabel>
                    <IonText>Muhammad Rafi Sofyan</IonText>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonThumbnail slot="start" className="ion-margin">
                    <IonAvatar>
                      <img src="https://cdn.discordapp.com/attachments/938285633657532456/974593450513158154/umar.jpg"/>
                    </IonAvatar>
                  </IonThumbnail>
                  <IonLabel>
                    <IonText>Umar Haqi</IonText>
                  </IonLabel>
                </IonItem>
              </IonCardContent>
            </IonCard>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Faq;
