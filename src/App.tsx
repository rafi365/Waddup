import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonRouterOutlet,
  IonTitle,
  IonToggle,
  IonToolbar,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Home from "./pages/Home";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
// import Profile from "./pages/Profile";
// import Contact from "./pages/Contact";
import {
  helpCircleOutline,
  moon,
  personCircleOutline,
  settingsOutline,
} from "ionicons/icons";
import Tabs from "./pages/Tabs";
import Chatting from "./pages/Chatting";
import { useEffect, useState } from "react";
import { auth } from "./firebaseConfig";
import { User } from "firebase/auth";

setupIonicReact();

const toggleDarkModeHandler = () => {
  document.body.classList.toggle("dark");
};

const App: React.FC = () => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User|null|undefined>();

  // Handle user state changes
  function onAuthStateChanged(user:User|null|undefined) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // if (initializing) return (<>
  // <h1>Connecting to firebase Servers.......</h1>
  // </>);
  if (initializing) return null;


  return(
    <IonApp>
      <IonReactRouter>
        <IonMenu contentId="main">
          <IonHeader>
            <IonToolbar color="primary">
              <IonTitle className="ion-text-center">Menu</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent color="medium">
            <IonList>
              <IonMenuToggle>
                <IonItem button routerLink="/tabs/profile">
                  <IonIcon slot="start" icon={personCircleOutline} />
                  <IonLabel>Profile</IonLabel>
                </IonItem>
                <IonItem>
                  <IonIcon slot="start" icon={helpCircleOutline} />
                  <IonLabel>FAQ</IonLabel>
                </IonItem>
                <IonItem>
                  <IonIcon slot="start" icon={settingsOutline} />
                  <IonLabel>Settings</IonLabel>
                </IonItem>
                <IonItem>
                  <IonIcon slot="start" icon={moon} />
                  <IonLabel>Dark Mode</IonLabel>
                  <IonToggle
                    slot="end"
                    name="darkMode"
                    onIonChange={toggleDarkModeHandler}
                  />
                </IonItem>
              </IonMenuToggle>
            </IonList>
          </IonContent>
          <IonFooter>
            <IonToolbar color="primary">
              <IonTitle className="ion-text-center">Version 0.0.1</IonTitle>
            </IonToolbar>
          </IonFooter>
        </IonMenu>
        <IonRouterOutlet id="main">
          <Route path="/tabs" component={Tabs} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={SignUp}/>
          <Route path="/chat/:chatID" component={Chatting}/>
          <Redirect exact from="/" to="/login" />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
