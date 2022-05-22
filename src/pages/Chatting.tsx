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
  IonActionSheet,
  IonCard,
  IonCardContent,
  IonLabel,
  useIonViewDidEnter,
  IonSearchbar,
  IonToast,
  IonModal,
  IonListHeader,
  IonList,
  IonInput,
  IonAvatar,
  IonItem,
  IonThumbnail,
} from "@ionic/react";
import {
  addOutline,
  callOutline,
  cameraSharp,
  caretForwardCircle,
  close,
  heart,
  locationSharp,
  peopleOutline,
  searchOutline,
  send,
  share,
  trash,
} from "ionicons/icons";
import { SetStateAction } from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Geolocation, Position } from '@capacitor/geolocation';

import "./Home.css";
import "./Chatting.css";
import { auth, chatmessagetoWchatmessage, db, getchatdata, Wchat, Wchatmessage } from "../firebaseConfig";
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";

const Chatting = () => {
  //  Local state
  const [isGroupSettingOpened, setIsGroupSettingOpened] = useState(false);
  const { register, handleSubmit } = useForm();
  const [chatInfos, setChatInfos] = useState<Wchat | null>();
  const [chatboxtext, setChatboxtext] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<Wchatmessage[]>();
  const [showActionSheet, setShowActionSheet] = useState(false);

  const [isSearch, setIsSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const sendMessage = () => {
    if (!!chatboxtext) {
      addDoc(collection(db, "chats", chatInfos!.chatuid, 'message'), {
        timestamp: serverTimestamp(),
        text: chatboxtext,
        img: null,
        location: null,
        userUID: auth.currentUser?.uid
      })
    }
    setChatboxtext("")
    // console.log("Document written with ID: ", docRef.id);
  };
  const sendLocationMessage = (locationdata: Position) => {
    addDoc(collection(db, "chats", chatInfos!.chatuid, 'message'), {
      timestamp: serverTimestamp(),
      text: chatboxtext,
      img: null,
      location: {
        lat: locationdata.coords.latitude,
        long: locationdata.coords.longitude
      },
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

  const stringToColour = (str: string) => {
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
  const getCurrentPosition = async () => {

    const coordinates = await Geolocation.getCurrentPosition();

    console.log('Current position:', coordinates);
    return coordinates;
  };

  const ChangeGroupSettings = async (groupName: string) => {
    await updateDoc(doc(db, "chats", chatInfos!.chatuid), {
      chatname: groupName
    });
  }

  const ChangeGroupSettingsHandler = (data: any) => {
    setIsGroupSettingOpened(false);
    ChangeGroupSettings(data['gname']);
    // const result = contactList?.flatMap((e) =>
    //   (!!data[e.uid]) ? [e.uid] : []
    // )
    // if (result?.length) {
    //   createGroup(result, data["gname"]);

    // } else {
    //   setToastMessage('Please add at least 1 contact to the group!');
    // }
    // console.log("FORM", result);
    // console.log(data);

  }

  return (
    <IonPage>

      <IonModal isOpen={isGroupSettingOpened} backdropDismiss={false}>
        <IonHeader>
          <IonToolbar color='primary'>
            <IonTitle>Group Chat Details</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <form onSubmit={handleSubmit(ChangeGroupSettingsHandler)}>
            <IonLabel>Group Name</IonLabel>
            <IonInput required placeholder='Insert Group Name' {...register("gname")} />
            <IonButton
              type='submit'
              color="secondary"
              className='ion-text-center'
              expand='block'
            > Edit Group Name
            </IonButton>

            <IonList>
              <IonListHeader>Group Members</IonListHeader>
              <IonContent style={{ height: "500px" }}>
                {!!chatInfos?.users ? chatInfos.users?.map((e) => {
                  return (
                    <div key={e.uid}>
                      <label htmlFor={e.uid!.toString()}>
                        <IonItem color='secondary' lines="full">
                          {/* <input type='checkbox' slot='start' {...register(e.uid!.toString(), {})} id={e.uid!.toString()} /> */}
                          <IonThumbnail slot="start" className='ion-margin' >
                            <IonAvatar>
                              <img src={!!e.avatarurl ? e.avatarurl : 'https://media.discordapp.net/attachments/841587576464736266/946390659852546069/tasm3_confirmed_20220224_155923_0.jpg?width=338&height=338'} />
                            </IonAvatar>
                          </IonThumbnail>
                          <IonLabel color='light' className='ion-margin'>
                            <IonText><strong>{e.name}</strong></IonText><br />
                            <p>{e.status}</p>
                          </IonLabel>
                        </IonItem>
                      </label>
                    </div>
                  )
                }) : <h1>No Contacts!</h1>}
              </IonContent>

            </IonList>
          </form>


          <IonRow className='ion-text-center'>
            <IonCol>
              <IonButton color='secondary' onClick={() => setIsGroupSettingOpened(false)}>Cancel</IonButton>
            </IonCol>
          </IonRow>

        </IonContent>
      </IonModal>
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
                  <p>{chatInfos?.isgroup ? chatInfos?.chatname : chatInfos?.users?.find(e => e.uid !== auth.currentUser?.uid)?.name}</p>
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
                {chatInfos?.isgroup ?
                  <IonButton
                    fill="clear"
                    onClick={() => { setIsGroupSettingOpened(true) }}
                  >
                    <IonIcon icon={peopleOutline} />
                  </IonButton>
                  :
                  ""}

              </IonButtons>
            </>
          }
        </IonToolbar>
      </IonHeader>

      <IonContent id="main-chat-content">

        {/* put chat bubbles here */}

        {chatMessages?.map((e) => {
          const time = e.timestamp ? e.timestamp.toDate().toLocaleTimeString() : "";
          const date = e.timestamp ? e.timestamp.toDate().toDateString() : "";
          const locationstr = !!e.location?.lat ? encodeURIComponent(e.location.lat + "," + e.location.long) : null
          if (e.text?.toLowerCase().includes(searchText.toLowerCase())) {
            if (auth.currentUser?.uid == e.userUID) {
              return (
                <div key={e.uid} >
                  <IonCard color="primary" className="chat-bubble-sent">
                    <IonCardContent >
                      {!!locationstr ? <IonButton href="#" onClick={() => { window.open(`https://www.google.com/maps/search/?api=1&query=${locationstr}`, '_system', 'location=yes'); return false; }} size='small'><IonIcon slot="icon-only" icon={locationSharp} /> View Location</IonButton> : ""}

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
                  <IonLabel className="chat-bubble-received">
                    <p className="chat-time">
                      {/* note: json stringify is to make the string more random but still the same everytime */}
                      <strong style={{ color: stringToColour(e.userUID ? JSON.stringify(e.userUID) : "grey") }}>{chatInfos?.users?.find(a => a.uid === e.userUID)?.name}</strong>
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
        })}

        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          buttons={[{
            text: 'Share Current Location',
            icon: locationSharp,
            handler: () => {
              // console.log('loc clicked');
              getCurrentPosition().then((e) => {
                if (!!e.coords.latitude) {
                  sendLocationMessage(e)
                } else {
                  setToastMessage('Unable to get location data');
                }
              })
                .catch((e) => { setToastMessage(e['message']) })
            }
          }, {
            text: 'Send Image',
            icon: cameraSharp,
            handler: () => {
              console.log('cam clicked');
            }
          }, {
            text: 'Cancel',
            icon: close,
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }]}
        >
        </IonActionSheet>


      </IonContent>

      <IonFooter className="chat-footer" id="chat-footer">
        <IonGrid>
          <IonRow className="ion-align-items-center">
            <IonCol size="1" onClick={() => setShowActionSheet(true)}>
              <IonIcon icon={addOutline} color="primary" />
            </IonCol>

            <div className="chat-input-container">
              <IonTextarea rows={1} value={chatboxtext} onIonChange={(e) => setChatboxtext(e.detail.value! ? e.detail.value! : "")} placeholder="chat here" />
            </div>

            <IonCol size="1" className="chat-send-button" onClick={() => { sendMessage() }}>
              <IonIcon icon={send} />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonFooter>
      <IonToast isOpen={!!toastMessage}
        message={toastMessage}
        duration={3000}
        onDidDismiss={() => { setToastMessage('') }} />
    </IonPage>
  );
};

export default Chatting;
