import Vue from 'vue'
import App from './App.vue'
import router from './router'
import LoadScript from 'vue-plugin-load-script';
import vuetify from '@/plugins/vuetify' // path to vuetify export

if(process.env.VUE_APP_ENV=='cloud')
{
  var firebase = require('firebase');
  //var firebaseui = require('firebaseui');

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.MEASUREMENT_ID
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
}

Vue.use(LoadScript)

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
