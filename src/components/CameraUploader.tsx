import { IonButton, IonCol, IonContent, IonIcon, IonLabel, IonPage, IonRow } from "@ionic/react"
import { camera } from "ionicons/icons";
import { Camera, CameraResultType } from '@capacitor/camera';
import { useEffect, useState } from "react";
import { auth, storagedb, uploadPhotoHandler } from "../firebaseConfig";
import { getDownloadURL, ref } from "firebase/storage";
const CameraUploader: React.FC = () => {
    const [takenPhoto, setTakenPhoto] = useState('');
    useEffect(() => {
        getDownloadURL(ref(storagedb, "users/" + auth.currentUser!.uid)).then((e) => {
            setTakenPhoto(e);
        }).catch((e) => {
            setTakenPhoto('');
        })

    }, []);
    const takePhotoHandler = async () => {
        const photo = await Camera.getPhoto({
            quality: 90,
            allowEditing: true,
            resultType: CameraResultType.Base64
        });
        console.log(photo);

        if (!photo || /*!photo.path ||*/ !photo.base64String) {
            // console.log("NAPA KE SINI?!?!?");
            return;
        }
        // console.log("sjdkajkd");
        uploadPhotoHandler("users/", auth.currentUser!.uid, "data:image/jpg;base64," + photo.base64String).then((e) => {
            setTakenPhoto(e);
        }
        )
    }

    return (

        <>
            <IonRow className="ion-text-center">
                <IonCol>
                    <div className="image-preview">
                        {!takenPhoto && <h3>No Photo</h3>}
                        {takenPhoto && <img src={takenPhoto} alt="Preview" />}
                    </div>
                    <IonButton fill="clear" onClick={takePhotoHandler}>
                        <IonIcon slot="start" icon={camera} />
                        <IonLabel>Take Photo</IonLabel>
                    </IonButton>
                </IonCol>
            </IonRow>

            <IonRow className="ion-ion-margin-top">
                <IonCol className="ion-text-center">
                    {/* <IonButton onClick={uploadPhotoHandler}>upload photo</IonButton> */}
                </IonCol>
            </IonRow>

        </>


    )
}
export default CameraUploader;