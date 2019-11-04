import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    withRouter
  } from "react-router-dom";

import Login from "./LoginComponent"
import Register from "./RegisterComponent"
import Profile from "./ProfileComponent"
import { baseURL } from "../config"
import NavigationBar from './NavigationBar';
import FeedComponent from './FeedComponent';

class MainComponent extends React.Component {
    state = {  }
    render() { 
        return ( 
          <Router>
             
              <Switch>
                <Route path="/login">
                  <Login loginSuccess={this.loginSuccess} />
                </Route>
                <Route path="/register">
                  <Register loginSuccess={this.loginSuccess} />
                </Route>
                <Route path="/profile/:username">
                    <NavigationBar></NavigationBar>
                    <Profile user={this.state.user} />
                </Route>
                <Route path="/feed">
                    <NavigationBar></NavigationBar>
                    <FeedComponent user={this.state.user} />
                </Route>
              </Switch>
              { this.state.redirect && <Redirect to={this.state.redirect}></Redirect>}
          </Router> );
    }

    componentDidMount = async ()=>{
        var token = localStorage.getItem("token")
        if (token){
            await this.refresh(token)
        }
        else{
            this.setState({
                redirect: "/login"
            })
        }
    }

    loginSuccess = async (token, user) => {
        localStorage.setItem("token", token)
        this.setState({
            token: token,
            user: user,
            redirect: "/profile/me"
        })
    }

    refresh = async (token) =>{
        var result = await fetch(`${baseURL}auth/refresh`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token
            }
        })

        if (result.ok) {
            var json = await result.json();
            this.setState({
                token: json.token,
                user: json.user,
                redirect: "/profile/me"
            })
            localStorage.setItem("token", json.token)
        }
        else{
            localStorage.removeItem("token")
        }
    }
}
 
export default MainComponent;