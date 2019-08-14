// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import config from '../config';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();

// Import the template to use
const loginTemplate = require('../templates/login.handlebars');

export default () => {
      // Data to be passed to the template
      const user = 'Test user';
      // Return the compiled template to the router
      update(compile(loginTemplate)({ }));
      document.getElementById('googlelogin-button').addEventListener('click', (e) => {
            e.preventDefault();
            const provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('https://www.googleapis.com/auth/plus.login');

            firebase.auth().signInWithPopup(provider).then(function(result) {
                  var token = result.credential.accessToken;
                  var user = result.user;
                }).catch(function(error) {
                  var errorCode = error.code;
                  var errorMessage = error.message;
                  var email = error.email;
                  var credential = error.credential;
                });
      });
      document.getElementById('registershow-button').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('form-register').style.display = "block";
            document.getElementById('form-login').style.display ="none";
      })
      document.getElementById('ifStudent').style.display = "none";
      document.getElementById('ifOwner').style.display = "none";

      document.getElementById('login-button').addEventListener('click', (e) => {  
            e.preventDefault();
            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;

            firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                  const id = firebase.auth().currentUser.uid;
                  const ref = firebase.database().ref(`User/${id}`);
                  ref.once('value', (snapshot) => {
                        const currentuser = snapshot.val();
                        if(currentuser.type == 'owner'){
                              console.log('logged in owner');
                              window.location.replace('/')
                        }else if(currentuser.type == 'student'){
                              console.log('logged in student');
                              window.location.replace('/')
                        }
                  })
            })
            })
  


      const selectField = document.getElementById("type");
      selectField.addEventListener('change', (e) => {
            if(selectField.value == "owner"){
                  console.log('owner');
                  document.getElementById('ifStudent').style.display = "none";
            }else if(selectField.value == 'student'){
                  console.log('student');
                  document.getElementById('ifStudent').style.display = "inline";

            }
            else{
                  console.log('geen type');
            }
      })
      document.getElementById('register-button').addEventListener('click', (e) => {  
            e.preventDefault(); 
            const adress = document.getElementById("adressCampus").value;
            const URL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${adress}.json?access_token=${config.mapBoxToken}&cachebuster=1545701868024&autocomplete=true&limit=1`;
            
            if(config.mapBoxToken){
                  fetch(URL,{
                        method: 'GET',
                  })
                  .then(response => response.json())
                  .then((data) => {
                        const campusLatitude = JSON.stringify(data.features[0].center[0]);
                        const campusLongitude = JSON.stringify(data.features[0].center[1]);
                        const email = document.getElementById("register-email").value;
                        const password = document.getElementById("register-password").value;
                        const type = document.getElementById("type").value;
                        const phone = document.getElementById("register-phone").value;

                        console.log(type);
                        if(type === 'owner'){
                              console.log('dit is een owner');
                              firebase.auth().createUserWithEmailAndPassword(email, password)
                              .then(()=> {
                                    const id = firebase.auth().currentUser.uid;
                                    firebase.database().ref().child("User").child(id).set({
                                          email,
                                          password,
                                          type,
                                          phone,
                                    });
                                    window.location.replace('/')

                              }) 
                        }else if(type === 'student'){
                              console.log('dit is een student');
                              firebase.auth().createUserWithEmailAndPassword(email, password)
                              .then(()=> {
                                    const id = firebase.auth().currentUser.uid;
                                    firebase.database().ref().child("User").child(id).set({
                                          email, password, type, phone, adress, campusLatitude,campusLongitude,
                                    });
                                    window.location.replace('/')
                        })
            
            
                        } 
                  });
            }
      })
}