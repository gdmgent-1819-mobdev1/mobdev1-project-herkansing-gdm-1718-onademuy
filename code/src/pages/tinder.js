// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');
const firebase = getInstance();

// Import the template to use
const tinderTemplate = require('../templates/tinder.handlebars');

export default () => {
      // Data to be passed to the template
      const user = 'Test user';
      // Return the compiled template to the router
      update(compile(tinderTemplate)({ }));
      firebase.auth().onAuthStateChanged((user)=>{
      if(user){
      const userid = firebase.auth().currentUser.uid;
      const ref = firebase.database().ref(`User/${userid}`);
      ref.on('value', (snapshot) =>{
            const waarden = snapshot.val();
            console.log(waarden);
            if (waarden.type === 'student') {
                  document.getElementById('ifStudent').style.display = "block";
                  document.getElementById('ifOwner').style.display = "none";
            }else if(waarden.type === 'owner'){
                  document.getElementById('ifStudent').style.display = "none";
                  document.getElementById('ifOwner').style.display = "block";
            }
      })
      
      

      const koten = JSON.parse(localStorage.getItem('tinderKoten'));
      console.log(koten);
      const div =  document.getElementById('tindergame');
      if(koten === null || koten === undefined || koten.length === 0){
            div.innerHTML = 'Er zijn geen koten beschikbaar';
      }  
      div.innerHTML += `
      <div id="tindercard">
            <img style="width:200px;"src="${koten[0].image}">
            <p>${koten[0].type}</p>
            <p>€ ${koten[0].price}</p>
            <p>${koten[0].adres}</p>
            <p>Distance from campus</p>
      </div>
      <button class="iconheart" id="likeButton"></button>
      <button class="iconcross" id="skipButton"></button>`;
      

      document.getElementById('skipButton').addEventListener('click', (e) => {
            e.preventDefault();
            console.log('skipped');
            koten.shift();
            localStorage.setItem('tinderKoten', JSON.stringify(koten));
            window.location.reload();
            
      })
      document.getElementById('likeButton').addEventListener('click', (e) => {
            e.preventDefault();
            console.log('liked');
            const currentUser = firebase.auth().currentUser.uid;
            const ref = firebase.database().ref('Favorites');
            const image = koten[0].image;
            const adres = koten[0].adres;
            const price = koten[0].price;
            const type = koten[0].type;
            const creator = koten[0].creator;

            const data = {
                  likedBy: currentUser,
                  image,
                  price,
                  type,
                  adres,
                  creator,
            };
            ref.push(data);
            koten.shift();
            localStorage.setItem('tinderKoten', JSON.stringify(koten));
            setTimeout(() => {
                  window.location.reload();
            }, 1000);
            

      })
              
}
})
} 