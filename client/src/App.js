import React,{Fragment,useEffect} from 'react';
import Navbar from './components/layout/Navbar';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";
//redux
import { Provider } from 'react-redux';
import store from './store';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import  ReactDOM  from 'react-dom';
import Alert from './components/layout/Alert'
import './App.css';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import CreateProfile from './components/profile-form/CreateProfile';
import EditProfile from './components/profile-form/EditProfile';
import AddExperince from './components/profile-form/AddExperince';
import AddEducation from './components/profile-form/AddEducation';
import Profiles from './components/Profiles/Profiles';
import Profile from './components/Profile/Profile';
import Posts from './components/Posts/Posts';
import Post from '../src/components/Post/Post';


if(localStorage.token)
   {
     setAuthToken(localStorage.token);
   }

const App=()=>{
  useEffect (()=>{
    store.dispatch(loadUser());
  },[]);
  return (
  <Provider store={store}>
  <Router>
    <Fragment>
      <Navbar/>
      <Routes>
      <Route exact path="/" Component={Landing}/>
      </Routes>
      <section className='container'>
        <Alert/>
           <Routes>
          <Route exact path="/register" Component={Register}/>
          <Route exact path="/login" Component={Login}/>
          <Route exact path="/profiles" Component={Profiles}/>
          <Route exact path="/profile/:id" Component={Profile}/>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
               <Dashboard />
              </PrivateRoute>
            }
          />
            <Route
            path="/posts/:id"
            element={
              <PrivateRoute>
               <Post/>
              </PrivateRoute>
            }
          />
          <Route
            path="/posts"
            element={
              <PrivateRoute>
               <Posts/>
              </PrivateRoute>
            }
          />
          <Route
            path="/create-profile"
            element={
              <PrivateRoute>
               <CreateProfile />
              </PrivateRoute>
            }
          />
           <Route
            path="/add-education"
            element={
              <PrivateRoute>
               <AddEducation />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-experience"
            element={
              <PrivateRoute>
               <AddExperince />
              </PrivateRoute>
            }
          />
           <Route
            path="/edit-profile"
            element={
              <PrivateRoute>
               <EditProfile />
              </PrivateRoute>
            }
          />
          </Routes>
          
      </section>
     
    </Fragment>
    </Router>
    </Provider>
)};


export default App;
