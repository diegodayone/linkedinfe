import React from 'react';
import {baseURL} from "../../config"

import { Media, Modal, ModalHeader, ModalBody, ModalFooter, Input, Button } from "reactstrap"
import { tsImportEqualsDeclaration } from '@babel/types';

class ExperienceModal extends React.Component {
    state = { 
        role: "",
        area: "",
        company: "",
        description: "",
        startDate: undefined,
        file: {}
     }

    render() { 
        return (  
            <Modal isOpen={this.props.modalOpen}  >
            <ModalHeader >{this.props.selectedExp ? "Edit Experience" : "Add Experience"}</ModalHeader>
            <ModalBody>
              <Input placeholder="Role" type="text" value={this.state.role} onChange={(val) => this.setState({role: val.currentTarget.value})}></Input>
              <Input placeholder="Area" type="text" value={this.state.area} onChange={(val) => this.setState({area: val.currentTarget.value})}></Input>
              <Input placeholder="Start Date" type="datetime-local" value={this.state.startDate}  onChange={(val) => this.setState({startDate: val.currentTarget.value})}></Input>
              <Input placeholder="End Date" type="datetime-local" value={this.state.endDate} onChange={(val) => this.setState({endDate: val.currentTarget.value})}></Input>
              <Input placeholder="Company" type="text" value={this.state.company} onChange={(val) => this.setState({company: val.currentTarget.value})}></Input>
              <Input placeholder="Description" type="text" value={this.state.description} onChange={(val) => this.setState({description: val.currentTarget.value})}></Input>
            </ModalBody>
            <ModalFooter>
              <Input type="file" onChange={(val) => this.setState({ file: val.currentTarget.files[0]})} ></Input>
              <Button color="primary" onClick={this.submitExperience}>{this.props.selectedExp ? "Edit" : "Create"}</Button>
              <Button color="secondary" onClick={() => {
                    this.setState({
                        role: "",
                        area: "",
                        startDate: "",
                        endDate: "",
                        company: "",
                        description: ""
                    })
                  this.props.addExperience(false)
              }}>Cancel</Button>
            </ModalFooter>
          </Modal> 
          );
    }

    submitExperience = async() =>{
        //fetch => POST Experiences etc
        var result = {}
        if (this.props.selectedExp){ //we need to put
             result = await fetch(`${baseURL}profiles/${this.props.user._id}/experiences/${this.props.selectedExp._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify(this.state)
            } )
        }
        else { //we need to POST
            result = await fetch(`${baseURL}profiles/${this.props.user._id}/experiences`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify(this.state)
            } )

            if (this.state.file){
                var element = await result.json()
                var image = new FormData()
                image.append("image", this.state.file)

                result = await fetch(`${baseURL}profiles/${this.props.user._id}/experiences/${element._id}/picture`, {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    },
                    body: image
                })
            }
        }
        
        if (result.ok){
            this.setState({
                role: "",
                area: "",
                startDate: "",
                endDate: "",
                company: "",
                description: "",
                file: {}
            })
            this.props.addExperience(true)
        }
        else{
            console.log(result)
        }
    }

    componentDidUpdate = (prevProps) =>{

        //1212-12-12T03:33
        //2012-12-12T02:33:00.000Z
        if (prevProps.selectedExp !== this.props.selectedExp) {
            this.setState({
                role: this.props.selectedExp.role,
                area: this.props.selectedExp.area,
                startDate: this.props.selectedExp.startDate ? this.props.selectedExp.startDate.replace(":00.000Z", "") : "",
                endDate: this.props.selectedExp.endDate ? this.props.selectedExp.endDate.replace(":00.000Z", "") : "",
                company: this.props.selectedExp.company,
                description: this.props.selectedExp.description
            })
        }
    }

    componentDidMount = () =>{
        if (this.props.selectedExp){
            this.setState({
                role: this.props.selectedExp.role,
                area: this.props.selectedExp.area,
                startDate: this.props.selectedExp.startDate,
                endDate: this.props.selectedExp.endDate,
                company: this.props.selectedExp.company,
                description: this.props.selectedExp.description
            })
        }
    }
}
 
export default ExperienceModal;