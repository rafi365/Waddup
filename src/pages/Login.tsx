import { IonCol, IonContent, IonGrid,  IonPage, IonRow, IonTitle,  IonText, IonButton} from '@ionic/react';
import { useRef, useState } from 'react';
import {Link} from 'react-router-dom';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false);
  const btnLogin = useRef<HTMLIonButtonElement>(null);

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
                  <label>Email: </label>
                  <input type="text" name="email"/>
                  <label>Password: </label>
                  <input type="text" name="password"/>
                  <div className='btn ion-text-center'>
                    <IonButton 
                      type='submit' 
                      color="secondary" 
                      className='ion-text-center'
                      expand='block'
                      ref={btnLogin}
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
    </IonPage>
  );
};

export default Login;
