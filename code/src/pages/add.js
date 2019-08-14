// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import config from '../config';

const { getInstance } = require('../firebase/firebase');
const firebase = getInstance();

// Import the template to use
const addTemplate = require('../templates/add.handlebars');

export default () => {
      // Data to be passed to the template
      const user = 'Test user';
      // Return the compiled template to the router
      update(compile(addTemplate)({ }));
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
      let tinderKoten = [];
      let imagePath;
      let imgURL;
      const image = document.getElementById('image');
      image.addEventListener('change', (evt) => {
      if (image.value !== '') {
       const filename = evt.target.files[0].name.replace(/\s+/g, '-').toLowerCase();
      const storageRef = firebase.storage().ref(`images/${filename}`);

      storageRef.put(evt.target.files[0]).then(() => {
        imagePath = `images/${filename}`;

        const storeimage = firebase.storage().ref(imagePath);
        storeimage.getDownloadURL().then((url) => {
          imgURL = url;
        });
      });
    }
  });


      document.getElementById('submitkot').addEventListener('click', (e) => {  
            e.preventDefault();
            const adres = document.getElementById("address").value; 
            const URL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${adres}.json?access_token=${config.mapBoxToken}&cachebuster=1545701868024&autocomplete=true&limit=1`;
            
            if(config.mapBoxToken){
                  fetch(URL,{
                        method: 'GET',
                  })
                  .then(response => response.json())
                  .then((data) => {
                        const latitude = JSON.stringify(data.features[0].center[0])
                        const longitude = JSON.stringify(data.features[0].center[1])
                        const price = document.getElementById("price").value; 
                        const warranty = document.getElementById("warranty").value; 
                        const surface = document.getElementById("surface").value; 
                        const type = document.getElementById("type").value; 
                        const floor = document.getElementById("floor").value; 
                        const perdate = document.getElementById("perdate").value; 
                        const furnished = document.getElementById("furnished").value; 
                        const bathroom = document.getElementById("bathroom").value; 
                        const kitchen = document.getElementById("kitchen").value; 
                        const toilet = document.getElementById("toilet").value; 
                        const description = document.getElementById("description").value; 
                        const creator = firebase.auth().currentUser.uid;

                        const kotData = {
                              image: imgURL,
                              adres,
                              latitude, 
                              longitude,
                              price,
                              warranty,
                              surface,
                              type,
                              floor,
                              perdate,
                              furnished,
                              bathroom,
                              kitchen,
                              toilet,
                              description,
                              creator,
                        }
                        firebase.database().ref('Koten').push(kotData);
                        if(localStorage.getItem('tinderKoten') !== null){
                              tinderKoten = JSON.parse(localStorage.getItem('tinderKoten'));
                              tinderKoten.push(kotData);
                              tinderKoten = localStorage.setItem('tinderKoten', JSON.stringify(tinderKoten));
                        }else{
                              tinderKoten.push(kotData);
                              tinderKoten = localStorage.setItem('tinderKoten', JSON.stringify(tinderKoten));
                        }

                  })
            }
           
      })

}  