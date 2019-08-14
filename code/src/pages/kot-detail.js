// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');
const firebase = getInstance();

// Import the template to use
const kotdetailTemplate = require('../templates/kot-detail.handlebars');

export default () => {
      // Data to be passed to the template
      // Return the compiled template to the router
      update(compile(kotdetailTemplate)({ }));
      firebase.auth().onAuthStateChanged((user) => {
            if(user){
                  const userid = firebase.auth().currentUser.uid;
      const userref = firebase.database().ref(`User/${userid}`);
      userref.on('value', (snapshot) =>{
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
      const kot = localStorage.getItem('selectedKot');
      const ref = firebase.database().ref(`Koten/${kot}`);
      ref.on('value', (snapshot) => {
           const waarden = snapshot.val();
           document.getElementById('kotdetail').innerHTML += `<div class="detaildiv"><img style="width:200px;" src="${waarden.image}"></div><div>
           <div class="linksrechts"><div class="links"><p>Adress: ${waarden.adres}</p>
           <p>Type: ${waarden.type}</p>
           <p>Surface: ${waarden.surface} m2</p>
           <p>Price: € ${waarden.price}</p>
           <p>Warranty: € ${waarden.warranty}</p>
           <p>Per Date: ${waarden.perdate}</p></div>
           <div class="rechts"><p>Floor: ${waarden.floor}</p>
           <p>Bathroom: ${waarden.bathroom}</p>
           <p>Toilet: ${waarden.toilet}</p>
           <p>Furnished${waarden.furnished}</p>
           <p>Kitchen: ${waarden.kitchen}</p>
           <p>Description: ${waarden.description}</p></div>
      </div></div>`;
      });
      }
      })
} 