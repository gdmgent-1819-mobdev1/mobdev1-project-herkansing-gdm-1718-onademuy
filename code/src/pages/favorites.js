// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');
const firebase = getInstance();

// Import the template to use
const favoritesTemplate = require('../templates/favorites.handlebars');

export default () => {
      // Data to be passed to the template
      const user = 'Test user';
      // Return the compiled template to the router
      update(compile(favoritesTemplate)({ }));
      firebase.auth().onAuthStateChanged((user)=>{
            if(user){
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
      const detail = (e) => {
            e.preventDefault();
            const kot = e.currentTarget.id;
            localStorage.setItem("selectedKot", kot);
            window.location.replace("/#/kot-detail");
      }
      const remove = (e) => {
            const target = e.currentTarget.id;
            const kot = firebase.database().ref('Favorites/' + target);
            kot.remove();
            window.location.reload();
      }
      const message = (e) => {
            e.preventDefault();
            const kot = e.currentTarget.id;
            document.getElementById('messageBox').style.display = "block";
      }
      const ref = firebase.database().ref('Favorites');
      ref.on('value', (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                  const kot = childSnapshot.val();

                  if(kot.likedBy === firebase.auth().currentUser.email ){
                        document.querySelector('#favorites').innerHTML += `<div class="detaildiv" id="${childSnapshot.key}"><img style="width:200px;" src="${kot.image}"><p>${kot.adress}</p><p>${kot.type}</p><p>${kot.price}</p></div><div id="${childSnapshot.key}"><button id ="${childSnapshot.key}" class="iconcross deleteButton" ></button><button id="${childSnapshot.key}" class="iconmessage messageButton"></button><div class="iconshare fb-share-button" data-href="https://developers.facebook.com/docs/plugin/" data-layout="button" data-size="large" data-mobile-iframe="true"><a target="_blank" href="https://facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2F&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore" ></a></div>`;
                  }

                  const detaildivs = document.querySelectorAll('.detaildiv');
                  for(let i = 0; i < detaildivs.length; i++){
                        detaildivs[i].addEventListener('click', detail);
                  };

                  const deleteButtons = document.querySelectorAll('.deleteButton');
                  for(let i = 0; i < deleteButtons.length; i++){
                        deleteButtons[i].addEventListener('click', remove);
                  };
                  const messageButtons = document.querySelectorAll('.messageButton');
                  for(let i = 0; i < messageButtons.length; i++){
                        messageButtons[i].addEventListener('click', message);
                  };
                
             });
      });
      }
      })
} 