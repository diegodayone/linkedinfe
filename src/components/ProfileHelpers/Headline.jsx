import React from "react";

class Headline extends React.Component {
  state = {};
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <img src={this.props.user.image}></img>
          </div>
          <div className="col-md-8">
            <h3>
              {this.props.user.firstName} {this.props.user.lastName}
            </h3>
            <h4>
              {this.props.user.title} {this.props.user.area}
            </h4>
            <h3>
              {this.props.user.email} {this.props.user.lastName}
            </h3>
          </div>    
        </div>
      </div>
    );
  }
}

export default Headline;
