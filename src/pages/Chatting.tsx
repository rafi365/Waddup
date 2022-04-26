import { IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonText, IonTextarea, IonTitle, IonToolbar, CreateAnimation, createGesture, useIonViewWillEnter, IonActionSheet, IonToast } from "@ionic/react";
import { addOutline, alertOutline, callOutline, cameraOutline, micOutline, send, shareOutline, starOutline, trashOutline, videocamOutline } from "ionicons/icons";
import { SetStateAction } from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

import "./Home.css"

const Chatting = () => {

    const params = useParams();

    //  Local state
    const [ message, setMessage ] = useState("");
    const [ showSendButton, setShowSendButton ] = useState(false);
    const [ messageSent, setMessageSent ] = useState(false);

    const [ showActionSheet, setShowActionSheet ] = useState(false);
    const [ actionMessage, setActionMessage ] = useState(false);

    const [ showToast, setShowToast ] = useState(false);
    const [ toastMessage, setToastMessage ] = useState("");


    const actionSheetButtons = [

      {
          text: (actionMessage) ? "Unstar Message" : "Star Message",
          icon: starOutline,
      },
      actionMessage  ? 
      {
          text: "Reply To Message",
          icon: shareOutline,
      } 
      :
      {
          text: "Unsend Message",
          icon: alertOutline,
          handler: () => toaster("I haven't implemented unsend :) Simple store update though")
      },
      {
          text: "Delete Message",
          icon: trashOutline,
          handler: () => toaster("I haven't implemented delete :) Simple store update though"),
          role: "destructive"
      }
  ];

    useEffect(() => {

        !showActionSheet && setActionMessage(false);
    }, [ showActionSheet ]);

    //  Scroll to end of content
    useIonViewWillEnter(() => {

        scrollToBottom();
    });

    //  For displaying toast messages
    const toaster = (message: SetStateAction<string>) => {

        setToastMessage(message);
        setShowToast(true);
    }

    //  Scroll to end of content
    const scrollToBottom = async () => {
        
    }

    //  Set the state value when message val changes
    useEffect(() => {
        
        setShowSendButton(message !== "");
    }, [ message ]);



    const sendMessage = (image = false, _imagePath = false) => {

        if (message !== "" || image === true) {
            
            sendMessage();
            setMessage("");
        
            setMessageSent(true);
            setTimeout(() => setMessageSent(false), 10);
            image && setTimeout(() => scrollToBottom(), 100);
        }
    }

    return (

        <IonPage>
            <IonHeader>
                <IonToolbar>
                <IonButtons slot="start">
                <IonBackButton defaultHref="/tabs/home" />
                </IonButtons>
                
                    <IonTitle>
                            <div className="chat-contact-details">
                                <p>Image & contact</p>
                                <IonText color="medium">last seen today at 22:10</IonText>
                        </div>
                    </IonTitle>

                    <IonButtons slot="end">
                        <IonButton fill="clear" onClick={ () => toaster("As this is a UI only, video calling wouldn't work here.")}>
                            <IonIcon icon={ videocamOutline } />
                        </IonButton>

                        <IonButton fill="clear" onClick={ () => toaster("As this is a UI only, calling wouldn't work here.")}>
                            <IonIcon icon={ callOutline } />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent id="main-chat-content" >

                <IonActionSheet header="Message Actions" isOpen={ showActionSheet } onDidDismiss={ () => setShowActionSheet(false) } buttons={actionSheetButtons} />

                <IonToast color="primary" isOpen={ showToast } onDidDismiss={ () => setShowToast(false) } message={ toastMessage } position="bottom" />
            </IonContent>

            
            <IonFooter className="chat-footer" id="chat-footer">
                <IonGrid>
                    <IonRow className="ion-align-items-center">
                        <IonCol>
                            <IonIcon icon={ addOutline } color="primary" />
                        </IonCol>

                        <IonCol>
                        <div className="chat-input-container">
                        <IonTextarea rows={1} value={message} placeholder="chat here" />
                        </div>
                        </IonCol>

                            <IonCol>
                                <IonIcon icon={ cameraOutline } color="primary" />
                            </IonCol>

                            <IonCol>
                                <IonIcon icon={ micOutline } color="primary" />
                            </IonCol>


                            <IonCol className="chat-send-button" >
                                <IonIcon icon={ send } />
                            </IonCol>
                    </IonRow>
                </IonGrid>
            </IonFooter>
        </IonPage>
    );
}

export default Chatting;


