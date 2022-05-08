import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
  CreateAnimation,
  createGesture,
  useIonViewWillEnter,
  IonActionSheet,
  IonToast,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonThumbnail,
  IonAvatar,
  IonLabel,
  IonItem,
} from "@ionic/react";
import {
  addOutline,
  alertOutline,
  callOutline,
  cameraOutline,
  micOutline,
  send,
  shareOutline,
  starOutline,
  trashOutline,
  videocamOutline,
} from "ionicons/icons";
import { SetStateAction, useRef } from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

import "./Home.css";
import "./Chatting.css";
import { auth, chatmessagetoWchatmessage, db, getchatdata, Wchat, Wchatmessage } from "../firebaseConfig";
import { addDoc, collection, doc, onSnapshot, orderBy, query, QuerySnapshot, serverTimestamp } from "firebase/firestore";

const Chatting = () => {
  const params = useParams();

  //  Local state
  const [message, setMessage] = useState("");
  const [showSendButton, setShowSendButton] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  const [showActionSheet, setShowActionSheet] = useState(false);
  const [actionMessage, setActionMessage] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [chatInfos, setChatInfos] = useState<Wchat | null>();
  const [chatboxtext, setChatboxtext] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<Wchatmessage[]>();

  const actionSheetButtons = [
    {
      text: actionMessage ? "Unstar Message" : "Star Message",
      icon: starOutline,
    },
    actionMessage
      ? {
        text: "Reply To Message",
        icon: shareOutline,
      }
      : {
        text: "Unsend Message",
        icon: alertOutline,
        handler: () =>
          toaster(
            "I haven't implemented unsend :) Simple store update though"
          ),
      },
    {
      text: "Delete Message",
      icon: trashOutline,
      handler: () =>
        toaster("I haven't implemented delete :) Simple store update though"),
      role: "destructive",
    },
  ];

  // useEffect(() => {
  //   !showActionSheet && setActionMessage(false);
  // }, [showActionSheet]);

  //  Scroll to end of content
  // useIonViewWillEnter(() => {
  //   scrollToBottom();
  // });

  //  For displaying toast messages
  const toaster = (message: SetStateAction<string>) => {
    setToastMessage(message);
    setShowToast(true);
  };

  //  Scroll to end of content
  // const scrollToBottom = async () => { };

  //  Set the state value when message val changes
  // useEffect(() => {
  //   setShowSendButton(message !== "");
  // }, [message]);

  const sendMessage = () => {
    addDoc(collection(db, "chats", chatInfos!.chatuid, 'message'), {
      timestamp: serverTimestamp(),
      text: chatboxtext,
      img: null,
      userUID: auth.currentUser?.uid
    })
    setChatboxtext("")
    // console.log("Document written with ID: ", docRef.id);
  };
  const urlvar = useParams<{ chatID: string }>().chatID;
  useEffect(() => {
    console.log('firing getchatdata')
    getchatdata(urlvar).then((e) => {
      // console.log('chat',e)
      setChatInfos(e)
      const q = query(collection(db, "chats", e!.chatuid, 'message'), orderBy("timestamp", "asc"));
      const unsub = onSnapshot(q, (querySnapshot) => {
        let temp: Wchatmessage[] = [];
        querySnapshot.forEach((doc) => {
          // console.log('messages',doc.data());
          temp.push(chatmessagetoWchatmessage(doc));
        });
        // console.log(temp)
        setChatMessages(temp);
      });
      return unsub; // unsubscribe on unmount
    });

    console.log('done firing!');
  }, []);

  const imgStyle = {
    height: "45px",
    width: "45px",
    margin: "auto",
    "border-radius": "50%"
  }



  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/home" />
          </IonButtons>

          <IonTitle>
            <div className="chat-contact-details">
              {/* <p>Image & contact</p> */}
              {/* <p>{urlvar}</p> */}
              <p>{chatInfos?.isgroup ? chatInfos?.chatname : chatInfos?.users?.find(e => e.uid !== auth.currentUser?.uid)?.name}</p>
              <IonText color="medium">last seen today at 22:10</IonText>
            </div>
          </IonTitle>

          <IonButtons slot="end">
            <IonButton
              fill="clear"
              onClick={() =>
                toaster(
                  "As this is a UI only, video calling wouldn't work here."
                )
              }
            >
              <IonIcon icon={videocamOutline} />
            </IonButton>

            <IonButton
              fill="clear"
              onClick={() =>
                toaster("As this is a UI only, calling wouldn't work here.")
              }
            >
              <IonIcon icon={callOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent id="main-chat-content">
        <IonActionSheet
          header="Message Actions"
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          buttons={actionSheetButtons}
        />

        <IonToast
          color="primary"
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          position="bottom"
        />

        {/* put chat bubbles here */}
        
            {chatMessages?.map((e) => {
              const time = e.timestamp ? e.timestamp.toDate().toLocaleTimeString() : "";
              const date = e.timestamp ? e.timestamp.toDate().toDateString() : "";
              return (
                <>
                <IonItem>
                  <IonThumbnail slot="start">
                    {/* <IonAvatar> */}
                      <img style={imgStyle} src='https://media.discordapp.net/attachments/841587576464736266/946390659852546069/tasm3_confirmed_20220224_155923_0.jpg?width=338&height=338' />
                    {/* </IonAvatar> */}
                  </IonThumbnail> 
                  <IonLabel>
                    <p>
                      <strong>{chatInfos?.users?.find(a => a.uid === e.userUID)?.name}</strong>
                      <br />
                      <p>{date} {time}</p>
                    </p>
                  </IonLabel>
                </IonItem>
                <IonCard className="chat-bubble" >
                  <IonCardContent>
                    <h2>
                      <strong>{e.text}</strong>
                    </h2>
                  </IonCardContent>
                </IonCard>

                {/* BAREBONE CHAT
                <p key={e.uid}>
                {chatInfos?.users?.find(a => a.uid === e.userUID)?.name}
                <br />
                {date} {time}
                <br />
                 {e.text}
                </p> */}

                </>
              )
            })}
          
        
      </IonContent>

      <IonFooter className="chat-footer" id="chat-footer">
        <IonGrid>
          <IonRow className="ion-align-items-center">
            <IonCol size="1">
              <IonIcon icon={addOutline} color="primary" />
            </IonCol>

            <div className="chat-input-container">
              <IonTextarea rows={1} value={chatboxtext} onIonChange={(e) => setChatboxtext(e.detail.value! ? e.detail.value! : "")} placeholder="chat here" />
            </div>

            <IonCol size="1">
              <IonIcon icon={cameraOutline} color="primary" />
            </IonCol>

            <IonCol size="1">
              <IonIcon icon={micOutline} color="primary" />
            </IonCol>

            <IonCol size="1" className="chat-send-button" onClick={() => { sendMessage() }}>
              <IonIcon icon={send} />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonFooter>
    </IonPage>
  );
};

export default Chatting;
