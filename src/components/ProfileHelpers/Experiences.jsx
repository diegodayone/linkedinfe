import React from 'react';
import { Media, Modal, ModalHeader, ModalBody, ModalFooter, Input, Button } from "reactstrap"
import ExperienceModal from './ExperienceModal';
import {baseURL} from "../../config"

class Experiences extends React.Component {
    state = { 
        modalOpen: false,
        selectedExp: null
     }
    render() { 
        return ( <div className="container mt-3">
            {this.state.experiences && this.state.experiences.map(exp => 
            <Media key={exp._id} className="m-2" >
                <Media left top href="#">
                    <Media object src={exp.image} alt="Generic placeholder image" style={{width: 100}} />
                </Media>
                <Media body className="pl-3">
                <Media heading>
                    {exp.role} @ {exp.company} in {exp.area}
                </Media>
                {exp.description}
                </Media>
                <Media right top>
                    <input type="button" className="btn btn-secondary" value="E" onClick={() => this.setState({selectedExp: exp, openModal: true })}></input>
                    <input type="button" className="btn btn-danger" value="X" onClick={() => this.deleteExp(exp._id)}></input>
                </Media> 
            </Media>
      )}

         <input type="button" className="btn btn-primary" value="+" onClick={this.openModal} />

         <ExperienceModal selectedExp={this.state.selectedExp} 
                          modalOpen={this.state.openModal} 
                          user={this.props.user} 
                          addExperience={this.closeModal} />

        </div> );
    }

    openModal = ()=>{
        this.setState({
            openModal: true
        })
    }

    closeModal = async (reload) => {
        if (reload){
            var result = await fetch(`${baseURL}profiles/${this.props.user._id}/experiences`, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            })
    
            if (result.ok){
                this.setState({experiences: await result.json(),     openModal: false})
            }
        }
        else{
            this.setState({ openModal: false})
        }
     
    }

    deleteExp = async (id) =>{
        var result = await fetch(`${baseURL}profiles/${this.props.user._id}/experiences/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })

        if (result.ok){
            var exps = this.state.experiences.filter(x => x._id != id)
            this.setState({ experiences: exps})
        }

    }

    componentDidMount = async () =>{
        var result = await fetch(`${baseURL}profiles/${this.props.user._id}/experiences`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })

        if (result.ok){
            this.setState({experiences: await result.json()})
        }
    }

    // 1) edit the elements
    // 2) post a picture
}
 
export default Experiences;