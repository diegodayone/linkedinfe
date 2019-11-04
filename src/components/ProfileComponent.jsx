import React from "react";
import Headline from "./ProfileHelpers/Headline";
import Experiences from "./ProfileHelpers/Experiences";
import { withRouter } from "react-router-dom"
import { baseURL } from "../config"

class Profile extends React.Component {
  state = {};
  render() {
    return (
      <div className="container">
        {this.state.user && <>
          <Headline user={this.state.user}></Headline>

          <Experiences user={this.state.user}></Experiences>
          </>
        }
         {!this.state.user && this.props.user && <>
          <Headline user={this.props.user}></Headline>

          <Experiences user={this.props.user}></Experiences>
          </>
        } 
      </div>
    );
  }

  componentDidMount = async () =>{
      if (this.props.match.params.username !== "me"){
        var result = await fetch(`${baseURL}profiles?username=${this.props.match.params.username}`,{  
          headers: {
          "Authorization": "Bearer " + localStorage.getItem("token")
      }

        })
        var json = await result.json();

        this.setState({ user: json[0]})
      }
  }
}

export default withRouter(Profile);
