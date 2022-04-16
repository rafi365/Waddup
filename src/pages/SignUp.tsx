import { IonButton, IonCol, IonContent, IonGrid, IonPage, IonRow, IonText, IonTitle} from '@ionic/react';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

const SignUp: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const btnSignUp = useRef<HTMLIonButtonElement>(null);
  
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
                <form action="submit" className='ion-margin login_form '>
                  <label>Name : </label>
                  <input type="text" name="name"/>
                  <label>User ID : </label>
                  <input type="text" name="userId"/>
                  <label>Email : </label>
                  <input type="text" name="email"/>
                  <label>Password : </label>
                  <input type="text" name="password"/>
                  <div className='btn ion-text-center'>
                    <IonButton 
                      type='submit' 
                      color="secondary" 
                      className='ion-text-center'
                      expand='block'
                      ref={btnSignUp}
                    > Sign Up
                    </IonButton>   
                  </div>     
                </form>
              </IonCol>
            </IonRow>
            <IonRow className="ion-text-center moveto-signup">
              <IonCol className="ion-align-items-center">
                <IonText>Already have account ? 
                  <Link to={'login'} style={linkStyle}>
                    Sign In now !
                  </Link>
                </IonText>
              </IonCol>
            </IonRow> 
          </IonGrid>
        </IonContent>
    </IonPage>
  );
};

export default SignUp;
