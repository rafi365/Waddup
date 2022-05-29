import { IonButton, IonCol, IonContent, IonGrid, IonInput, IonPage, IonRow, IonText, IonTitle, IonToast, useIonViewWillEnter } from '@ionic/react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import './Home.css';

const SignUp: React.FC = () => {
  const [toastMessage, setToastMessage] = useState('');
  const history = useHistory();
  const emailref = useRef<HTMLIonInputElement>(null);
  const passwordref = useRef<HTMLIonInputElement>(null);
  useIonViewWillEnter(() => {
    console.log('ionViewWillEnter event fired');
    console.log(auth.currentUser?.uid);
    if (!!auth.currentUser?.uid) {//if user is logged in(true)
      history.replace('/tabs/home');
    }
  });
  const registerUser = (e: any) => {
    e.preventDefault();
    // console.log('creating a new user account with: ', data);
    const email = emailref.current?.value?.toString();
    const password = passwordref.current?.value?.toString();
    if (!!email && !!password) {
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          // Signed in 
          // ...
          setToastMessage('Sign Up Success!');
          history.replace('/tabs/home');
        })
        .catch((error) => {
          console.log("SignUp Failed!");
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          console.log(errorMessage);
          setToastMessage(errorMessage);
        });
    } else {
      setToastMessage('Input box is blank!');
    }
  };
  const linkStyle = {
    margin: "1rem",
    color: 'white'
  };

  return (
    <IonPage>
      <IonContent color='primary'>
        <IonGrid className='content-login-signup'>
          <IonRow className="ion-text-center">
            <IonCol className="ion-align-items-center">
              <IonTitle className='app-title'>Waddup</IonTitle>
            </IonCol>
          </IonRow>
          <IonRow className='ion-justify-content-center'>
            <IonCol className="ion-align-items-center">
              <form onSubmit={registerUser} className='ion-margin login_form '>
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
                  > Sign Up
                  </IonButton>
                </div>
              </form>
            </IonCol>
          </IonRow>
          <IonRow className="ion-text-center moveto-signup">
            <IonCol className="ion-align-items-center">
              <IonText>Already have an account ?
                <Link to={'login'} style={linkStyle}>
                  Sign in
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
    </IonPage>
  );
};

export default SignUp;
