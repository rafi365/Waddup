import { IonCol, IonContent, IonGrid, IonPage, IonRow, IonTitle, IonText, IonButton, IonInput, IonToast, useIonViewWillEnter, IonHeader, IonModal, IonToolbar, IonItemDivider, IonIcon, useIonViewWillLeave, useIonViewDidEnter } from '@ionic/react';
import { useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './Home.css';
import { GoogleAuthProvider, sendPasswordResetEmail, signInWithCredential, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { logoGoogle } from 'ionicons/icons';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { App } from '@capacitor/app';

const Login: React.FC = () => {
  const history = useHistory();
  const [toastMessage, setToastMessage] = useState('');
  const [isReset, setIsReset] = useState(false);
  const resetemailref = useRef<HTMLIonInputElement>(null);
  const emailref = useRef<HTMLIonInputElement>(null);
  const passwordref = useRef<HTMLIonInputElement>(null);
  useIonViewWillEnter(() => {
    // console.log('ionViewWillEnter event fired');
    // console.log(auth.currentUser?.uid);
    if (!!auth.currentUser?.uid) {//if user is logged in(true)
      history.replace('/tabs/home');
    }
  });
  const loginUser = (e: any) => {
    e.preventDefault();
    // console.log('creating a new user account with: ', data);
    const email = emailref.current?.value?.toString();
    const password = passwordref.current?.value?.toString();
    if (!!email && !!password) {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          // Signed in 
          // ...
          history.replace('/tabs/home');
        })
        .catch((error) => {
          console.log("Signin Failed!");
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          console.log(errorMessage);
          setToastMessage(errorMessage);
        })
    } else {
      setToastMessage('Input box is blank!');
    }
  }
  const signInWithGoogle = async () => {
    //USING CAPACITOR FIREBASE SDK
    // 1. Create credentials on the native layer
    const result = await FirebaseAuthentication.signInWithGoogle();
    // 2. Sign in on the web layer using the id token
    const credential = GoogleAuthProvider.credential(result.credential?.idToken);
    signInWithCredential(auth, credential)
      .then(() => {
        history.replace('/tabs/home');
      }).catch((error) => {
        console.log("Signin Failed!");
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        setToastMessage(errorMessage);
      });
  };


  const doresetpass = (e: any) => {
    e.preventDefault();
    const email: string = resetemailref.current?.value ? resetemailref.current?.value.toString() : ""
    console.log(email);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        // ..
        setToastMessage('Password Reset Email Sent!')
      })
      .catch((error) => {
        const errorMessage = error.message;
        // ..
        setToastMessage(errorMessage)
      });

  }

  const linkStyle = {
    margin: "1rem",
    color: 'white'
  };
  //backbutton management
  useIonViewDidEnter(() => {
    App.addListener('backButton', data => {
      console.log('Restored state login:', data);
      console.log('login reset ', isReset);
      if (isReset) {
        setIsReset(false)
      } else {
        App.exitApp();
      }
    });
  })
  useIonViewWillLeave(() => {
    console.log("login unmounted!");
    App.removeAllListeners()
  })
  return (
    <IonPage>
      <IonContent color='primary'>
        <IonGrid className='content-login-signup'>
          <IonRow className="ion-text-center">
            <IonCol className="ion-align-items-center">
              <IonTitle className='app-title'>Waddup</IonTitle>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton
                onClick={() => signInWithGoogle()}
                color="secondary"
                className='ion-text-center'
                expand='block'
              >
                <IonIcon icon={logoGoogle} className='ion-padding-end' />Login With Google
              </IonButton>

              <IonItemDivider color='primary'></IonItemDivider>
            </IonCol>
          </IonRow>
          <IonRow className='ion-justify-content-center'>
            <IonCol className="ion-align-items-center">
              <form onSubmit={loginUser} className='ion-margin login_form '>
                <label>Email: </label>
                <IonInput type="email" ref={emailref} required className='inputcss' />
                <label>Password: </label>
                <IonInput type="password" ref={passwordref} required className='inputcss' />
                <div className='btn ion-text-center'>
                  <IonButton
                    type='submit'
                    color="secondary"
                    className='ion-text-center'
                    expand='block'
                  > Login
                  </IonButton>
                </div>
              </form>
            </IonCol>
          </IonRow>
          <IonRow className="ion-text-center">
            <IonCol className="ion-align-items-center">
              <IonText>Forgot your password?
                <a onClick={() => setIsReset(true)} style={linkStyle}>
                  Click Here!
                </a>
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow className="ion-text-center moveto-signup">
            <IonCol className="ion-align-items-center">
              <IonText>Don't have an account ?
                <Link to={'signup'} style={linkStyle}>
                  Sign up
                </Link>
              </IonText>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
      <IonToast isOpen={!!toastMessage}
        message={toastMessage}
        duration={2000}
        onDidDismiss={() => { setToastMessage('') }} />



      <IonModal isOpen={isReset} backdropDismiss={false}>
        <IonHeader>
          <IonToolbar color='primary'>
            <IonTitle>Password Reset</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent color='primary'>
          <IonGrid className='content-login-signup'>
            <IonRow className="ion-text-center">
              <IonCol className="ion-align-items-center">
                <IonTitle className='app-title'>Waddup</IonTitle>
              </IonCol>
            </IonRow>
            <IonRow className='ion-justify-content-center'>
              <IonCol className="ion-align-items-center">
                <form onSubmit={doresetpass} className='ion-margin login_form '>
                  <label>Email: </label>
                  <IonInput type="email" ref={resetemailref} required className='inputcss' />
                  <div className='btn ion-text-center'>
                    <IonButton
                      type='submit'
                      color="secondary"
                      className='ion-text-center'
                      expand='block'
                    > Reset Password
                    </IonButton>
                    <IonButton
                      type='button'
                      color="secondary"
                      className='ion-text-center'
                      expand='block'
                      onClick={() => setIsReset(false)}
                    > Go Back
                    </IonButton>
                  </div>
                </form>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonModal>


    </IonPage>
  );
};

export default Login;
