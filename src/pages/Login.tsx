import { IonCol, IonContent, IonGrid, IonPage, IonRow, IonTitle, IonText, IonButton, IonInput, IonToast, useIonViewWillEnter, IonHeader, IonModal, IonToolbar } from '@ionic/react';
import { useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './Home.css';
import { Controller, useForm } from 'react-hook-form'
import { onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const Login: React.FC = () => {
  const { register, handleSubmit } = useForm();
  const history = useHistory();
  const [toastMessage, setToastMessage] = useState('');
  const [isReset, setIsReset] = useState(false);
  const resetemailref = useRef<HTMLIonInputElement>(null);
  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     // User is signed in, see docs for a list of available properties
  //     // https://firebase.google.com/docs/reference/js/firebase.User
  //     const uid = user.uid;
  //     history.replace('/tabs/home');
  //   }
  // });
  useIonViewWillEnter(() => {
    console.log('ionViewWillEnter event fired');
    console.log(auth.currentUser?.uid);
    if (!!auth.currentUser?.uid) {//if user is logged in(true)
      history.replace('/tabs/home');
    }
  });
  const loginUser = (data: any) => {
    console.log('creating a new user account with: ', data);
    if (!!data['email'] && !!data['password']) {
      signInWithEmailAndPassword(auth, data['email'], data['password'])
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
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
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        setToastMessage(errorMessage)
      });

  }

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
              <form onSubmit={handleSubmit(loginUser)} className='ion-margin login_form '>
                <label>Email: </label>
                <IonInput type="email" {...register("email")} required className='inputcss' />
                <label>Password: </label>
                <IonInput type="password" {...register("password")} required className='inputcss' />
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
