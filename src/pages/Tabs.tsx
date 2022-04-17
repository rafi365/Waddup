import React from "react";

import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from "@ionic/react";
import { chatbubbleEllipses, peopleCircle } from "ionicons/icons";
import { Redirect, Route } from "react-router";
import Home from "../pages/Home";
import Contact from "../pages/Contact";
import Profile from "./Profile";

const Tabs = () => (
    <>
        <IonTabs>
            <IonRouterOutlet>
                <Route path='/tabs/home' component={Home}/>
                <Route path='/tabs/contacts' component={Contact} />
                <Route path="/tabs/profile" component={Profile} />
                <Redirect exact path='/tabs' to='/tabs/home' />
            </IonRouterOutlet>
            <IonTabBar slot='bottom' color="primary">
                <IonTabButton tab='home' href='/tabs/home'>
                    <IonIcon icon={chatbubbleEllipses}/>
                    <IonLabel>Chats</IonLabel>
                </IonTabButton>
                <IonTabButton tab='contacts' href='/tabs/contacts'>
                    <IonIcon icon={peopleCircle}/>
                    <IonLabel>Chats</IonLabel>
                </IonTabButton>
            </IonTabBar>
        </IonTabs>

    </>
)

export default Tabs;