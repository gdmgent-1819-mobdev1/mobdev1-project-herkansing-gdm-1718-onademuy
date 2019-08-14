// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');
const firebase = getInstance();

// Import the template to use
const homeTemplate = require('../templates/home.handlebars');

export default () => {
  // Data to be passed to the template
  const testuser = 'Test user';
  // Return the compiled template to the router
  update(compile(homeTemplate)({ }));
  // Filter type gebouw
  const filterGebouw = document.getElementById('type');
  filterGebouw.addEventListener('change', () => {
    const koten = document.querySelectorAll('.kotBox');
    const inputGebouw = document.getElementById('type').value;
    const gebouwen = document.querySelectorAll('.kottype');

    let count = 0;
    gebouwen.forEach((gebouw) => {
      const typeGebouw = gebouw.innerHTML;
      console.log(gebouw.innerHTML);
      if (inputGebouw === 'default') {
        koten[count].style.display = 'block';
      } else if (inputGebouw !== typeGebouw) {
        koten[count].style.display = 'none';
      } else if (inputGebouw === typeGebouw) {
        koten[count].style.display = 'block';
      }
      count += 1;
    });
  });

  // Filter min prijs
  const filterMinPrijs = document.getElementById('price-min');

  filterMinPrijs.addEventListener('change', () => {
    const inputMinPrijs = document.getElementById('price-min').value;
    const huurprijzen = document.querySelectorAll('.kotprice');
    const koten = document.querySelectorAll('.kotBox');

    let count = 0;
    huurprijzen.forEach((huurprijs) => {
      const prijs = huurprijs.innerHTML;
      if (inputMinPrijs > parseInt(prijs,10)) {
        koten[count].style.display = 'none';
      } else if (inputMinPrijs <= parseInt(prijs,10)) {
        koten[count].style.display = 'block';
      }
      count += 1;
    });
  });

    // Read data



    // Filter maxprijs
    const filterMaxPrijs = document.getElementById('price-max');
    filterMaxPrijs.addEventListener('change', () => {
      const inputMaxPrijs = document.getElementById('price-max').value;
      const huurprijzen = document.querySelectorAll('.kotprice');
      const koten = document.querySelectorAll('.kotBox');

      let count = 0;
      huurprijzen.forEach((huurprijs) => {
        const prijs = huurprijs.innerHTML;
        if (inputMaxPrijs < parseInt(prijs,10)) {
          koten[count].style.display = 'none';
          console.log('prijs is te groot');
        } else if (inputMaxPrijs >= parseInt(prijs,10)) {
          koten[count].style.display = 'block';
          console.log('prijs is goed');

        }
        count += 1;
      });
    });


    // Filter oppervlakte
    const filterOpp = document.getElementById('surface');
    filterOpp.addEventListener('change', () => {
      const minOpp = document.getElementById('surface').value;
      console.log(minOpp);
      const oppervlaktes = document.querySelectorAll('.kotsurface');
      const koten = document.querySelectorAll('.kotBox');
      let count = 0;
      oppervlaktes.forEach((oppervlakte) => {
        const opp = oppervlakte.innerHTML;
        console.log(opp);
        if(minOpp >  parseInt(opp,10)){
          koten[count].style.display ='none';
        }else if (minOpp <= parseInt(opp,10)) {
          koten[count].style.display = 'block';

        }
        count += 1;
      });
    });


    // Filter Max afstand
    const filterMaxAfstand = document.getElementById('distance');
    filterMaxAfstand.addEventListener('change', () => {
      const inputMaxAfstand = document.getElementById('distance').value;
      const afstanden = document.querySelectorAll('.kotdistance');
      const koten = document.querySelectorAll('.kotBox');

      let count = 0;
      afstanden.forEach((afstand) => {
        const afst = afstand.innerHTML;
        if (inputMaxAfstand < parseInt(afst,10)) {
          koten[count].style.display = 'none';
        } else if (inputMaxAfstand >= parseInt(afst,10)) {
          koten[count].style.display = 'block';
        }
        count += 1;
      });
    });

    //reset filter
    let resetFilterBtn = document.getElementById('resetfilter');
    resetFilterBtn.addEventListener('click', function(){
      document.getElementById('type').value = "default";
      document.getElementById('price-min').value = "";
      document.getElementById('price-max').value = "";
      document.getElementById('surface').value = "";
      document.getElementById('distance').value = "";

      window.location.reload();

    })

  // logout function
  const logout = () => {
    firebase.auth().signOut();
    window.location.replace('/#/login');
  };
  document.getElementById('logout').addEventListener('click', logout);
  
  let currentKot;
  const remove = (e) => {
    e.preventDefault();
    currentKot = e.currentTarget.id;
    const ref = firebase.database().ref(`Koten/${currentKot}`);
    ref.remove();
    window.location.reload();
  };
  const edit = (e) => {
    e.preventDefault();
    currentKot = e.currentTarget.id;
    localStorage.setItem('editKot', currentKot);
    window.location.replace('/#/edit-detail');
  };
  const message = (e) => {
    e.preventDefault();
    const kot = e.currentTarget.id;
    localStorage.setItem('selectedKot', kot);
    document.getElementById('messageBox').style.display = "block";

  };
  const sendMessage = (e) => {
    e.preventDefault();
    const id = localStorage.getItem('selectedKot');
    const ref = firebase.database().ref(`Koten/${id}`);
    const date = new Date();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const day = date.getDay();
    const month = date.getMonth();
    const year = date.getFullYear();
    const time = day+'/'+month+'/'+year+','+hour + ':' + minutes + ':' + seconds;
    console.log(time);
    const messageRef = firebase.database().ref('Messages');
    ref.on('value', (snapshot) =>{
      const waarden = snapshot.val();
      const message = document.getElementById('message').value;
      const user = firebase.auth().currentUser.uid;
      const creator = waarden.creator;

      const data = {
        message,
        user,
        creator,
        time,
      };
      messageRef.push(data);
    });
  }
  document.getElementById('messageButton').addEventListener('click', sendMessage);
  const favorite = (e) => {
    e.preventDefault();
    console.log('favorite');
    const kotId = e.currentTarget.id;
    const user = firebase.auth().currentUser.email;
    const ref = firebase.database().ref('Favorites');
    const kotref = firebase.database().ref(`Koten/${kotId}`);
    kotref.on('value', (snapshot) => {
        const kot = snapshot.val();
        const adress = kot.adres;
        const type = kot.type;
        const image = kot.image;
        const price = kot.price;
        const creator = kot.creator;

        const data = {
          adress,
          type,
          image,
          price,
          likedBy: user,
          creator,
        };
        ref.push(data);
    });

  };
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const userid = firebase.auth().currentUser.uid;
      const ref = firebase.database().ref(`User/${userid}`);
      ref.once('value', (snapshot) => {
        const currentuser = snapshot.val();
        const detail = (e) => {
          e.preventDefault();
          const kot = e.currentTarget.id;
          localStorage.setItem('selectedKot', kot);
          window.location.replace('/#/kot-detail');
    }
        const degreesToRadians = (degrees) => {
          return degrees * (Math.PI / 180);
        }
        //STUDENT
        if (currentuser.type === 'student') {
          document.getElementById('ifStudent').style.display = "block";
          document.getElementById('ifOwner').style.display = "none";

          //display none voor de 2de menubar
          console.log('student');
          console.log(localStorage.getItem('tinderKoten'));
          let userLong;
          let userLat;
          const currentStudent = firebase.auth().currentUser.uid;
          const userref = firebase.database().ref(`User/${currentStudent}`);
          userref.on('value', (snapshot) => {
             userLong = snapshot.val().campusLongitude;
             userLat = snapshot.val().campusLatitude;
          });
          document.querySelector('.loggedin-student').style.display = 'block';
          const kotref = firebase.database().ref('Koten');
          kotref.on('value', (snapshot)=> {
            snapshot.forEach((childsnapshot) => {
              const currentKot = firebase.database().ref('Koten/' + childsnapshot.key);
              const kot = childsnapshot.val();
              const kotLat = kot.latitude;
              const kotLong = kot.longitude;
              const R = 6371;
              const φ1 = degreesToRadians(userLat);
              const φ2 = degreesToRadians(kotLat);
              const Δφ = degreesToRadians(kotLat - userLat);
              const Δλ = degreesToRadians(kotLong - userLong);
              const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2)
                  + Math.cos(φ1) * Math.cos(φ2)
                  * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
              const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
              const result = Math.round(R * c);
              currentKot.child('toUser').set(result);
              const kotdiv = document.getElementById('kotlist-student');
              kotdiv.innerHTML += `<div class="kotBox"><div id="${childsnapshot.key}" class="detaildiv"><img style="width:200px;" src="${kot.image}"><p class="kotdistance">${kot.toUser}</p><p class="kottype">${kot.type}</p><p class="kotprice">€ ${kot.price}</p><p class="kotsurface">${kot.surface}</p></div>
              <div id="buttonsdiv"><button id="${childsnapshot.key}" class="iconheart favoriteButton"></button><button id="${childsnapshot.key}" 
              class="iconmessage messageButton"></button></div></div>`;
            }); 
            const detaildivs = document.querySelectorAll('.detaildiv');
            for(let i = 0; i < detaildivs.length; i++){
                detaildivs[i].addEventListener('click', detail);
            };
            const messageButtons = document.querySelectorAll('.messageButton');
            for(let i = 0; i < messageButtons.length; i ++) {
              messageButtons[i].addEventListener('click', message);
            }
            const favoriteButtones = document.querySelectorAll('.favoriteButton');
            for(let i = 0; i < favoriteButtones.length; i ++) {
              favoriteButtones[i].addEventListener('click', favorite);
            }
          });

        } else if (currentuser.type === 'owner') {
          //OWNER
          //display none voor de 1ste menubar
          console.log('owner');
          document.getElementById('ifStudent').style.display = "none";
          document.getElementById('ifOwner').style.display = "block";
          document.querySelector('.loggedin-owner').style.display = 'block';
          const kotref = firebase.database().ref('Koten');
          kotref.on('value', (snapshot)=> {
            snapshot.forEach((childsnapshot) => {
              console.log(childsnapshot.val());
              const kot = childsnapshot.val();
              const kotdiv = document.getElementById('kotlist');
              if (kot.creator === firebase.auth().currentUser.uid) {
                kotdiv.innerHTML += `<div><button id="${childsnapshot.key}" class="removeButton">Remove</button><button id="${childsnapshot.key}" class="editButton">Edit</button><div class="detaildiv"> Prijs: € ${kot.price}</p><img style="width:200px;" src="${kot.image}"> </div></div>`;
                const detaildivs = document.querySelectorAll('.detaildiv');
                  for(let i = 0; i < detaildivs.length; i++){
                        detaildivs[i].addEventListener('click', detail);
                  };
                
                const removeButtons = document.querySelectorAll('.removeButton');
                const editButtons = document.querySelectorAll('.editButton');
                for (let i = 0; i<removeButtons.length; i ++) {
                  removeButtons[i].addEventListener('click', remove);
                }
                for (let i = 0; i<editButtons.length; i ++) {
                  editButtons[i].addEventListener('click', edit);
                }
              } else {
                console.log('geen kot van huidige gebruiker');
              }
          });
          });
        }else{

        }
      })
    } else {
      window.location.replace('/#/login');
    }
  });
};
 