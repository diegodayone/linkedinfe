import React from 'react';
import { baseURL } from "../config"
import { Link } from "react-router-dom"

class Register extends React.Component {
    state = {
        email: "",
        password: "",
        error: ""
      }
    render() { 
        return ( 
        <div className="container loginContainer">
            <input className="form-control" type="email" value={this.state.email} onChange={(val) => this.setState({ email: val.currentTarget.value})} placeholder="Email"></input>
            <input className="form-control" type="password" value={this.state.password} onChange={(val) => this.setState({ password: val.currentTarget.value})} placeholder="Password"></input>
            <input type="button" className="btn btn-primary" value="Register" onClick={this.Register} ></input>
            {this.state.error && <h2>{this.state.error}</h2>}

            <p>Do you have an account? <Link to="/login">Just login</Link> </p>
        </div> );
    }

    Register = async () =>{
        var result = await fetch(`${baseURL}auth/signUp`, {
            method: "POST",
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (result.ok){
            var json = await result.json();
            this.props.loginSuccess(json.token, json.user)
        }
        else {
            this.setState({ error: await result.text()})
        }
    }
}
 
export default Register;