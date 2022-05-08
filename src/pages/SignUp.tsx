import { IonButton, IonCol, IonContent, IonGrid, IonInput, IonPage, IonRow, IonText, IonTitle, IonToast, useIonViewWillEnter } from '@ionic/react';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import './Home.css';

const SignUp: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const btnSignUp = useRef<HTMLIonButtonElement>(null);
  const { register, handleSubmit } = useForm();
  const [toastMessage, setToastMessage] = useState('');
  const history = useHistory();
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
  const registerUser = (data: any) => {
    console.log('creating a new user account with: ', data);
    if (!!data['email'] && !!data['password']) {
      createUserWithEmailAndPassword(auth, data['email'], data['password'])
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
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
              <form onSubmit={handleSubmit(registerUser)} className='ion-margin login_form '>
                {/* <label>Name : </label>
                  <input type="text" name="name"/>
                  <label>User ID : </label>
                  <input type="text" name="userId"/> */}
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
