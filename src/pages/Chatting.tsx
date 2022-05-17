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
  useIonViewDidEnter,
  IonSearchbar,
} from "@ionic/react";
import {
  addOutline,
  alertOutline,
  callOutline,
  cameraOutline,
  micOutline,
  searchOutline,
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

  const [isSearch, setIsSearch] = useState(false);
  const [searchText, setSearchText] = useState('');

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
        // scrolltobottom()
      });
      return unsub; // unsubscribe on unmount
    });

    console.log('done firing!');
  }, []);

  // const imgStyle = {
  //   height: "45px",
  //   width: "45px",
  //   margin: "auto",
  //   "border-radius": "50%"
  // }

  useEffect(() => {
    scrolltobottom();
  }, [chatMessages]);
  useIonViewDidEnter(() => {
    scrolltobottom();
  })
  const scrolltobottom = () => {
    const element = document.getElementById("main-chat-content") as HTMLIonContentElement;
    element.scrollToBottom(500)
  }

  const stringToColour = (str:string) => {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
  }


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          {isSearch ?

            <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)} inputmode="search" showCancelButton='always' onIonCancel={() => { setIsSearch(false); scrolltobottom() }}></IonSearchbar>
            :
            <>
              <IonButtons slot="start">
                <IonBackButton defaultHref="/tabs/home" />
              </IonButtons>
              <IonTitle>
                <div className="chat-contact-details">
                  {/* <p>Image & contact</p> */}
                  {/* <p>{urlvar}</p> */}
                  <p>{chatInfos?.isgroup ? chatInfos?.chatname : chatInfos?.users?.find(e => e.uid !== auth.currentUser?.uid)?.name}</p>
                  {/* <IonText color="medium">last seen today at 22:10</IonText> */}
                  {chatInfos?.isgroup ? "" : <IonText color="medium">{chatInfos?.users?.find(e => e.uid !== auth.currentUser?.uid)?.status}</IonText>}
                </div>
              </IonTitle>

              <IonButtons slot="end">
                <IonButton
                  fill="clear"
                  onClick={() =>
                    setIsSearch(true)
                  }
                >
                  <IonIcon icon={searchOutline} />
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
            </>
          }
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
          if (e.text?.toLowerCase().includes(searchText.toLowerCase())) {
            if (auth.currentUser?.uid == e.userUID) {
              return (
                <div key={e.uid} >
                  <IonCard color="primary" className="chat-bubble-sent">
                    <IonCardContent >
                      <h2>
                        <strong>{e.text}</strong>
                      </h2>
                    </IonCardContent>
                    <p className="chat-time">{date} {time}</p>
                  </IonCard>
                </div>
              )
            } else {
              return (
                <div key={e.uid}>
                  {/* <IonItem className="chat-bubble-received">
                    <IonThumbnail slot="start">
                      <IonAvatar>
                        <img src="https://media.discordapp.net/attachments/841587576464736266/946390659852546069/tasm3_confirmed_20220224_155923_0.jpg?width=338&height=338"/>
                      </IonAvatar>
                    </IonThumbnail> */}
                  <IonLabel className="chat-bubble-received">
                    <p className="chat-time">
                      {/* note: json stringify is to make the string more random but still the same everytime */}
                      <strong style={{color: stringToColour(e.userUID?JSON.stringify(e.userUID) : "grey")}}>{chatInfos?.users?.find(a => a.uid === e.userUID)?.name}</strong>
                      <br />
                    </p>
                  </IonLabel>
                  {/* </IonItem> */}
                  <IonCard className="chat-bubble-received">
                    <IonCardContent>
                      <h2>
                        <strong>{e.text}</strong>
                      </h2>
                    </IonCardContent>
                    <p className="chat-time">{date} {time}</p>
                  </IonCard>

                </div>

              )
            }
          } else {
            return (null)
          }
          // LINEAR BUBBLE CHAT

          // return (
          //   <div key={e.uid}>
          //     <IonItem>
          //       <IonThumbnail slot="start">
          //         <IonAvatar>
          //           <img src='https://media.discordapp.net/attachments/841587576464736266/946390659852546069/tasm3_confirmed_20220224_155923_0.jpg?width=338&height=338' />
          //         </IonAvatar>
          //       </IonThumbnail>
          //       <IonLabel>
          //         <p>
          //           <strong>{chatInfos?.users?.find(a => a.uid === e.userUID)?.name}</strong>
          //           <br />
          //         </p>
          //         <p>{date} {time}</p>
          //       </IonLabel>
          //     </IonItem>
          //     <IonCard className="chat-bubble">
          //       <IonCardContent>
          //         <h2>
          //           <strong>{e.text}</strong>
          //         </h2>
          //       </IonCardContent>
          //     </IonCard>
          //   </div>
          // )
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
