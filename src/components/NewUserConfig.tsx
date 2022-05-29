import { IonButton, IonCol, IonGrid, IonInput, IonRow, IonToast } from '@ionic/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { addUser, auth, checkFriendIDdupe } from '../firebaseConfig';
import CameraUploader from './CameraUploader';

const NewUserConfig: React.FC = () => {
  const { register, handleSubmit } = useForm();
  const [toastMessage, setToastMessage] = useState('');
  const [avatarURL, setAvatarURL] = useState<string | null>(null);

  const registerUser = async (data: any) => {
    // console.log('creating a new user account with: ', data);
    if (!!data['name'] && !!data['friendID']) {
      checkFriendIDdupe(data['friendID']).then((isdupe) => {
        // console.log("checked ", isdupe);
        if (isdupe) {
          setToastMessage('friendID has already been taken!')
        } else {
          addUser(data['name'], data['friendID'], avatarURL);
        }
      }

      )
    } else {
      setToastMessage('Input box is blank!');
    }
  };
  const linkStyle = {
    margin: "1rem",
    color: 'black',
    backgroundColor: "gray"
  };
  const linkStylebox = {
    marginTop: "1rem",
    marginBottom: "1rem",
    color: 'black',
    backgroundColor: "white"
  };

  return (
    <IonGrid style={linkStyle}>
      {!!auth.currentUser?.uid ? <CameraUploader onlypathtofile="users/" filename={auth.currentUser.uid} functioncallbackresult={(e) => setAvatarURL(e)} /> : ""}
      <IonRow>
        <IonCol>
          <form onSubmit={handleSubmit(registerUser)} >
            <label>Name : </label>
            <IonInput type="text" {...register("name")} style={linkStylebox} />
            <label>Friend ID : </label>
            <IonInput type="text" {...register("friendID")} style={linkStylebox} />
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
      <IonToast isOpen={!!toastMessage}
        message={toastMessage}
        duration={2000}
        onDidDismiss={() => { setToastMessage('') }} />
    </IonGrid>
  );
};

export default NewUserConfig;
