import React from "react";

import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, useIonViewWillEnter } from "@ionic/react";
import { chatbubbleEllipses, peopleCircle } from "ionicons/icons";
import { Redirect, Route, useHistory } from "react-router";
import Home from "../pages/Home";
import Contact from "../pages/Contact";
import Profile from "./Profile";
import Chatting from "./Chatting";
import { auth } from "../firebaseConfig";

const Tabs = () => {
    const history = useHistory();
    useIonViewWillEnter(() => {
        // console.log('ionViewWillEnter event fired');
        // console.log(!auth.currentUser?.uid);
        if (!auth.currentUser?.uid) {//if user is logged out(false)
            history.replace('/login');
        }
    });
    return (
        <>
            <IonTabs>
                <IonRouterOutlet>
                    <Route path='/tabs/home' component={Home} />
                    <Route path='/tabs/contacts' component={Contact} />
                    <Route path="/tabs/profile" component={Profile} />
                    <Redirect exact path='/tabs' to='/tabs/home' />
                </IonRouterOutlet>
                <IonTabBar slot='bottom' color="primary">
                    <IonTabButton tab='home' href='/tabs/home'>
                        <IonIcon icon={chatbubbleEllipses} />
                        <IonLabel>Chats</IonLabel>
                    </IonTabButton>
                    <IonTabButton tab='contacts' href='/tabs/contacts'>
                        <IonIcon icon={peopleCircle} />
                        <IonLabel>Contacts</IonLabel>
                    </IonTabButton>
                </IonTabBar>
            </IonTabs>

        </>
    )
}

export default Tabs;