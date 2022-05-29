import { IonButton, IonCol, IonIcon, IonLabel, IonRow } from "@ionic/react"
import { camera } from "ionicons/icons";
import { Camera, CameraResultType } from '@capacitor/camera';
import { useEffect, useState } from "react";
import { storagedb, uploadPhotoHandler } from "../firebaseConfig";
import { getDownloadURL, ref } from "firebase/storage";
const CameraUploader: React.FC<{ onlypathtofile: string, filename: string, functioncallbackresult: (result: string | null) => void }> = ({ onlypathtofile, filename, functioncallbackresult }) => {
    const [takenPhoto, setTakenPhoto] = useState('');
    useEffect(() => {
        getDownloadURL(ref(storagedb, onlypathtofile + filename)).then((e) => {
            setTakenPhoto(e);
        }).catch((e) => {
            setTakenPhoto('');
        })

    }, []);
    const takePhotoHandler = async () => {
        const photo = await Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.Base64
        });
        // console.log(photo);

        if (!photo || !photo.base64String) {
            return;
        }
        uploadPhotoHandler(onlypathtofile, filename, "data:image/jpg;base64," + photo.base64String).then((e) => {
            setTakenPhoto(e);
            functioncallbackresult(e);
        }
        )
    }

    return (

        <>
            <IonRow className="ion-text-center">
                <IonCol>
                    <div>
                        {!takenPhoto && <h3>No Photo</h3>}
                        {takenPhoto && <img src={takenPhoto} alt="Preview" />}
                    </div>
                    <IonButton color="secondary" onClick={takePhotoHandler}>
                        <IonIcon slot="start" icon={camera} />
                        <IonLabel>Upload Photo</IonLabel>
                    </IonButton>
                </IonCol>
            </IonRow>
        </>


    )
}
export default CameraUploader;