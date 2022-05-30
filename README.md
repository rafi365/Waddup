## Waddup
An Ionic based Chat App with Firebase
Features

 - Chat
 - Group Chat
 - User status
 - Share current location
 - Share photo
 - ID based add contacts
 - Simple Search function
 - Google and Email sign in

## How to Install

install ionic
    
    npm install -g @ionic/cli
install project dependency
    
    npm install
    
   
launch in browser

    npm start
deploy on android (android studio required)

    ionic cap sync android
    ionic cap open android


## Firebase Config
To use your own firebase config, navigate to `./src/firebaseConfig.ts` and edit

 

     // Your web app's Firebase configuration
    
    const firebaseConfig = {
    
    //YOUR KEY HERE
    
    };

and replace `./android/app/google-services.json` for android deploy (package name can be found in `capacitor.config.ts`)

firebase features needed

 - Firebase Authentication (Google and Email Auth)
 - Cloud Firestore
 - Cloud Storage for Firebase