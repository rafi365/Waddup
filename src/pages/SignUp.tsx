import { IonButton, IonCol, IonContent, IonGrid, IonInput, IonPage, IonRow, IonText, IonTitle} from '@ionic/react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import './Home.css';

const SignUp: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const btnSignUp = useRef<HTMLIonButtonElement>(null);
  const { register, handleSubmit } = useForm();

  const registerUser = (data: any) => {
    console.log('creating a new user account with: ', data);
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
                <form onSubmit={handleSubmit(registerUser)}className='ion-margin login_form '>
                  {/* <label>Name : </label>
                  <input type="text" name="name"/>
                  <label>User ID : </label>
                  <input type="text" name="userId"/> */}
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
