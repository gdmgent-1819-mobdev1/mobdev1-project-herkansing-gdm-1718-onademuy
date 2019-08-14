// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import config from '../config';

const { getInstance } = require('../firebase/firebase');
const firebase = getInstance();

// Import the template to use
const editdetailTemplate = require('../templates/edit-detail.handlebars');

export default () => {
    // Data to be passed to the template
    const user = 'Test user';
    // Return the compiled template to the router
    update(compile(editdetailTemplate)({ }));
    let image;
    let imagePath;
    let imgURL;
    let noNewImage;
    const newImage = document.getElementById('image');
    newImage.addEventListener('change', (evt) => {
        if (newImage !== '') {
            const filename = evt.target.files[0].name.replace(/\s+/g, '-').toLowerCase();
            const storageRef = firebase.storage().ref(`images/${filename}`);
            storageRef.put(evt.target.files[0]).then(() => {
            imagePath = `images/${filename}`;
            const storeimage = firebase.storage().ref(imagePath);
            storeimage.getDownloadURL().then((url) => {
                imgURL = url;
                if (imgURL !== '') {
                image = imgURL;
                }
            });
            });
        }
        });
    const currentkot = localStorage.getItem('editKot');
    const ref = firebase.database().ref('Koten/' + currentkot);
    ref.on('value', (snapshot)=>{
        const waarden = snapshot.val();
        noNewImage = waarden.image;
        if (imgURL === undefined){
            image = noNewImage;
        }
        const adres = document.getElementById("adress");
        adres.value = waarden.adres;
        const price = document.getElementById("price");
        price.value = waarden.price;
        const warranty = document.getElementById("warranty");
        warranty.value = waarden.warranty;
        const surface = document.getElementById("surface");
        surface.value = waarden.surface;
        const type = document.getElementById("type");
        type.value = waarden.type;
        const floor = document.getElementById("floor");
        floor.value = waarden.floor;
        const perdate = document.getElementById("perdate");
        perdate.value = waarden.perdate;
        const furnished = document.getElementById("furnished");
        furnished.value = waarden.furnished;
        const bathroom = document.getElementById("bathroom");
        bathroom.value = waarden.bathroom;
        const kitchen = document.getElementById("kitchen");
        kitchen.value = waarden.kitchen;
        const toilet = document.getElementById("toilet");
        toilet.value = waarden.toilet;
        const description = document.getElementById("description");
        description.value = waarden.description;
        image = waarden.image;
        console.log(image);
    })
    
    document.getElementById('submitchanges').addEventListener('click', (e) =>{
        e.preventDefault();
        const nieuwAdres = document.getElementById("adress").value
        const URL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${nieuwAdres}.json?access_token=${config.mapBoxToken}&cachebuster=1545701868024&autocomplete=true&limit=1`;
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
                    
                    
                    const ref = firebase.database().ref('Koten/' + currentkot);
                    ref.set({
                        adres: nieuwAdres,  
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
                        image,
                    })
                })
            }
        localStorage.removeItem('currentkot');
    })
}