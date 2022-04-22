import React from "react";
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonBackButton } from "@ionic/react";
import {
  Chat,
  Channel,
  ChannelHeader,
  Thread,
  Window,
  MessageList,
  MessageInput,
  useChatContext
} from "stream-chat-react";

import "@ionic/core/css/core.css";
import "@ionic/core/css/ionic.bundle.css";
import "stream-chat-react/dist/css/index.css";
import "stream-chat-react/dist/css/index.css";
import './Home.css';

const Chatting: React.FC = () => {

  const { client } = useChatContext();

  return (
    <IonPage style={{ paddingTop: "2px" }}>
      <IonHeader>
        <IonToolbar>
        <IonButtons slot="start">
        <IonBackButton defaultHref="home" />
        </IonButtons>
          <IonTitle>Nama orang (contact)</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
      <Chat client={client}>
            <Channel>
              <Window>
                <ChannelHeader />
                <MessageList />
                <div className="footer">
                  <MessageInput />
                </div>
              </Window>
              <Thread />
            </Channel>
          </Chat>
      </IonContent>
    </IonPage>
  );
};

export default Chat;
