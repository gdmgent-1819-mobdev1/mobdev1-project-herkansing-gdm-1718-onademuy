// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');
const firebase = getInstance();

// Import the template to use
const chatTemplate = require('../templates/chat.handlebars');

export default () => {
      // Data to be passed to the template
      // Return the compiled template to the router
      update(compile(chatTemplate)({ }));
      firebase.auth().onAuthStateChanged((user)=>{
            if(user){
      const message = firebase.database().ref('Messages');
      const div = document.getElementById('messages');
      const currentUser = firebase.auth().currentUser.uid;
      const typeCheck = firebase.database().ref(`User/${currentUser}`);
      typeCheck.on('value', (userData) => {
            const info = userData.val();
            if(info.type === 'owner'){
                  document.getElementById('ifStudent').style.display = "none";
                  document.getElementById('ifOwner').style.display = "block";
            }else{
                  document.getElementById('ifStudent').style.display = "block";
                  document.getElementById('ifOwner').style.display = "none";
            }
      });
      message.on('value', (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                  const waarden = childSnapshot.val();
                  const sender = firebase.database().ref(`User/${waarden.user}`);
                  if(waarden.creator === currentUser || waarden.user === currentUser) {
                        sender.on('value', (data) => {  
                              div.innerHTML += `From: ${data.val().email} Message: ${waarden.message}`;
                              if(currentUser === waarden.creator) {
                                    if(waarden.answer){
                                          document.getElementById('replyForm').style.display = 'none';
                                    }else{
                                          document.getElementById('replyForm').style.display = 'block';

                                    }
                                    document.getElementById('replyButton').addEventListener('click', (e) => {
                                          e.preventDefault();
                                          const answer = document.getElementById('message').value;
                                          const messageref = firebase.database().ref(`Messages/${childSnapshot.key}`);
                                          messageref.child('answer').set({
                                                answer,
                                          });
                                    });
                              }
                        });
                  }
              

            });
      });  
      }
      })     
} 