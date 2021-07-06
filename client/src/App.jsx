import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import "./style.css";
import Header    from "./components/Header";
import Footer    from "./components/Footer";
import Home      from "./pages/Home";
import Login     from "./pages/Login";
import Register  from "./pages/Register";
import Posts     from "./pages/Posts";
import Users     from "./pages/Users";
import Profile   from "./pages/Profile";
import UserPosts from "./pages/UserPosts";
import jwt_decode from "jwt-decode";
import { getAuthToken, removeAuthToken } from "./config";
//===================================================================================================
function App () {
  const [user, setUser] = useState({});
  
  const checkLoggedInUser = useCallback( () => {
    let authToken = getAuthToken();
    if(!authToken){
      setUser(null);
    }else{
      // axios.defaults.headers.common["Authorization"] = authToken; 
      let userDecoded = jwt_decode(authToken);
      if(userDecoded.exp * 1000 < Date.now()){
        setUser(null);
        removeAuthToken();
      }
      delete userDecoded.password;
      setUser(userDecoded);
    };
  }, [setUser]);
  
  useEffect( () => {
    checkLoggedInUser();
  }, [checkLoggedInUser]);
  
  return <div className="App">
    <Router>
      <Header isLoggedIn={user}/>
      <Switch>
      <Route exact path="/">         <Home user={user}/> </Route>
      <Route exact path="/register"  render={props=> user?<Redirect to={"/register"}/>:<Register   {...props}/>}/>
      <Route exact path="/login"     render={props=> user?<Redirect to={user.admin?"/users":"/posts"}/>:<Login{...props} setUser={setUser}/>}/> 
      <Route exact path="/posts"     render={props=>!user?<Redirect to={"/login"}/>:<Posts      {...props} user={user}/>}/>
      <Route exact path="/profile"   render={props=>!user?<Redirect to={"/login"}/>:<Profile    {...props} user={user}/>}/>
      <Route exact path="/users"     render={props=>!user?<Redirect to={"/login"}/>:<Users      {...props} user={user}/>}/>
      <Route exact path="/userposts" render={props=>!user?<Redirect to={"/login"}/>:<UserPosts  {...props} user={user}/>}/>
      </Switch>
      <Footer />
    </Router></div>
};
//===================================================================================================
export default App;
// header
// body ==> main 
// footer
