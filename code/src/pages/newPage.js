// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';

// Import the update helper
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
// VERANDER LIST.HANDLEBARS NAAR DE FILE WAARMEE JE WILT LINKEN IN TEMPLATES
const aboutTemplate = require('../templates/home.handlebars');

export default () => {
  // Data to be passed to the template
  let loading = true;
  let posts = {};
  const title = 'Firebase calls example';
  // Return the compiled template to the router
  update(compile(aboutTemplate)({ title, loading, posts }));
}