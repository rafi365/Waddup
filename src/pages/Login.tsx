import { IonCol, IonContent, IonGrid,  IonPage, IonRow, IonTitle,  IonText, IonButton, IonInput, IonToast, useIonViewWillEnter} from '@ionic/react';
import { useRef, useState } from 'react';
import {Link, useHistory} from 'react-router-dom';
import './Home.css';
import { Controller, useForm } from 'react-hook-form'
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const Login: React.FC = () => {
  const { register, handleSubmit } = useForm();
  const history = useHistory();
  const [ toastMessage, setToastMessage ] = useState('');
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
    if(!!auth.currentUser?.uid){//if user is logged in(true)
      history.replace('/tabs/home');
    }
  });
  const loginUser = (data: any) => {
    console.log('creating a new user account with: ', data);
    if(!!data['email'] && !!data['password']){
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
    }else{
      setToastMessage('Input box is blank!');
    }
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
                <form onSubmit={handleSubmit(loginUser)}className='ion-margin login_form '>
                  <label>Email: </label>
                  <IonInput type="email" {...register("email")} required className='inputcss'/>
                  <label>Password: </label>
                  <IonInput type="password" {...register("password")} required className='inputcss'/>
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
            <IonRow className="ion-text-center moveto-signup">
              <IonCol className="ion-align-items-center">
                <IonText>Haven't already account ? 
                  <Link to={'signup'} style={linkStyle}>
                    Sign Up now !
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

export default Login;
