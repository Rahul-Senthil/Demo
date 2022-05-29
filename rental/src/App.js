import './App.css';
import {Route, Switch, Redirect} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import AllPost from './components/AllPost';
import Post from './components/Post';
import NewPost from './components/NewPost';
import Account from './components/Account';
import Login from './components/Login';
import EditPost from './components/EditPost';
import CheckPin from './components/CheckPin';

function App() {
  return (
    <div>
      <Navbar />
      <Switch> 
      <Route path="/home" component={Home}/>
      <Route path="/post/:id" component={Post}/>
      <Route path="/posts" component={AllPost}/>
      <Route path="/account/:id/edit-post" component={EditPost}/>
      <Route path="/account/:id/new-post" component={NewPost}/>
      <Route path="/account/:id" component={Account}/>
      <Route path="/login" component={Login}/>
      <Route path="/check-pin" component={CheckPin}/>
      <Redirect from="/"exact to="/home" />
      </Switch>
    </div>
  );
}

export default App;
