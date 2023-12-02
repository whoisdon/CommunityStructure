const { initializeApp } = require('firebase/app');

const firebase = () => {
    const firebaseConfig = {
      apiKey: "",
      authDomain: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: "",
      appId: "",
      measurementId: ""
    };
      
    return initializeApp(firebaseConfig);
}

module.exports = firebase();
