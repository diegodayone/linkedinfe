import React from 'react';
import { baseURL } from "../config"
import { Link } from "react-router-dom"
import { Media, Input, Button } from "reactstrap"
import Moment from 'react-moment';

class FeedComponent extends React.Component {
    state = { 
        postText: "",
        file: null
     }
    render() { 
        return (<div className="container">

        <div>
            <h3>Write your post...</h3>
            <Input type="text" value={this.state.postText} onChange={(val) => this.setState({postText: val.currentTarget.value})}></Input>
            <Input type="file" onChange={(val)=> this.setState({ file: val.currentTarget.files[0]})} ></Input>
            <Button onClick={this.postMessage} >Share</Button>
        </div>

        {this.state.posts && this.state.posts.map(exp => 
        <Media key={exp._id} >
            {exp.image &&
            <Media left top href="#">
                <Media object src={exp.image} alt="Generic placeholder image" style={{width: 100}} />
            </Media> }
            <Media body className="pl-3">
            <Media heading>
               {exp.text}
            </Media>
                <Moment fromNow>{exp.createdAt}</Moment> by <Link to={"/profile/" + exp.userId}> {exp.userId} </Link>
            </Media>
            <Media right top>
                {exp.userId == this.props.user.username &&
                <input type="button" className="btn btn-danger" value="X" onClick={() => this.deletePost(exp._id)}></input> }
            </Media> 
        </Media>
        )}
        </div>  
        );
    }

    deletePost = async (id) =>{
        var result = await fetch(`${baseURL}posts/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })

        if (result.ok){
            var exps = this.state.posts.filter(x => x._id != id)
            this.setState({ posts: exps})
        }

    }


    componentDidMount = async  () => {
        var result = await fetch(`${baseURL}posts`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })

        if (result.ok){
            this.setState({ posts: await result.json() })
        }
    }

    postMessage = async () => {
        var result = await fetch(`${baseURL}posts`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: this.state.postText
            })
        })

        if (result.ok){
            var json = await result.json()

            if (this.state.file){

                var formData = new FormData()
                formData.append("image", this.state.file)

                var imageUrl = await fetch(`${baseURL}posts/${json._id}/picture`, {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    },
                    body: formData
                })

                var posts = this.state.posts;
                json.image = await imageUrl.text();
                posts.push(json)
                this.setState({ 
                    posts: posts
                })
            }
            else{
                var posts = this.state.posts;
                posts.push(json)
                this.setState({ 
                    posts: posts
                })
            }
        }
    }

}
 
export default FeedComponent;