import { IonCol, IonContent, IonGrid,  IonPage, IonRow, IonTitle,  IonText, IonButton, IonInput} from '@ionic/react';
import { useRef, useState } from 'react';
import {Link} from 'react-router-dom';
import './Home.css';
import { Controller, useForm } from 'react-hook-form'

const Login: React.FC = () => {
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
    </IonPage>
  );
};

export default Login;
