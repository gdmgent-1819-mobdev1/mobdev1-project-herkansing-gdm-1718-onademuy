const firebaseInstance = require('firebase');

// Initialize Firebase

// TODO: Replace with your project's config
const config = {
  apiKey: 'AIzaSyBFHVCNU7xG3RmTRXoZG7WDm5npB6D4Pw8',
  authDomain: 'mobdev-eb8f2.firebaseapp.com',
  databaseURL: 'https://mobdev-eb8f2.firebaseio.com',
  projectId: 'mobdev-eb8f2',
  storageBucket: 'mobdev-eb8f2.appspot.com',
  messagingSenderId: '744553983429',
  appId: '1:744553983429:web:282f5500ee439e8c'
};

let instance = null;

const initFirebase = () => {
  instance = firebaseInstance.initializeApp(config);
};

const getInstance = () => {
  if (!instance) {
    initFirebase();
  }
  return instance;
};
export {
  initFirebase,
  getInstance,
};
