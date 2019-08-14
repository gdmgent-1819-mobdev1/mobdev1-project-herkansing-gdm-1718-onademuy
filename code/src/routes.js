// Pages
import HomeView from './pages/home';
import AboutView from './pages/about';
import FirebaseView from './pages/firebase-example';
import MapboxView from './pages/mapbox-example';
import AddView from './pages/add';
import ChatView from './pages/chat';
import DeleteView from './pages/delete';
import EditDetailView from './pages/edit-detail';
import EditView from './pages/edit';
import FavoritesView from './pages/favorites';
import KotDetailView from './pages/kot-detail';
import LoginView from './pages/login';
import NewPageView from './pages/newPage';
import TinderView from './pages/tinder';


export default [
  { path: '/', view: HomeView },
  { path: '/about', view: AboutView },
  { path: '/firebase', view: FirebaseView },
  { path: '/mapbox', view: MapboxView },
  { path: '/add', view: AddView },
  { path: '/chat', view: ChatView },
  { path: '/delete', view: DeleteView },
  { path: '/edit-detail', view: EditDetailView },
  { path: '/edit', view: EditView },
  { path: '/favorites', view: FavoritesView },
  { path: '/kot-detail', view: KotDetailView },
  { path: '/login', view: LoginView },
  { path: '/newPage', view: NewPageView },
  { path: '/tinder', view: TinderView },
];