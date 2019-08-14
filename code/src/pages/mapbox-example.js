// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import mapboxgl from 'mapbox-gl';
import config from '../config';

// Import the update helper
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();

// Import the template to use
const mapTemplate = require('../templates/page-with-map.handlebars');

export default () => {
  // Data to be passed to the template
  const title = 'Mapbox example';
  update(compile(mapTemplate)({ title }));
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
  const pins = [];
  const ref = firebase.database().ref('Koten');
  ref.on('value', (snapshot) =>{
    snapshot.forEach((childsnapshot)=> {
      const kot = childsnapshot.val();
      const pin = {
        id: childsnapshot.key,
        longitude: kot.longitude,
        latitude: kot.latitude,
        price: kot.price,
        image: kot.image,
        surface: kot.surface,
        adres: kot.adres,
      };
      pins.push(pin);
    });
  });

  // Mapbox code
  if (config.mapBoxToken) {
    mapboxgl.accessToken = config.mapBoxToken;
    // eslint-disable-next-line no-unused-vars
    const map = new mapboxgl.Map({
      container: 'map',
      center: [3.725, 51.05389],
      style: 'mapbox://styles/mapbox/streets-v9',
      zoom: 10,
    });
    map.on('load', () => {
      
      pins.forEach((pin) => {
        
        new mapboxgl.Marker()
        .setLngLat([pin.latitude, pin.longitude])
        .setPopup(new mapboxgl.Popup().setHTML(`<img style="width:200px;" src="${pin.image}"><h1>€ ${pin.price}</h1><h1>${pin.surface} m<sup>2</sup></h1><h1>${pin.adres}</h1>`))
        .addTo(map);
        
      });
      
    });

  } else {
    console.error('Mapbox will crash the page if no access token is given.');
  }
}
})
};

