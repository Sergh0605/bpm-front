import React from "react";
import {FormattedMessage} from "react-intl";
import ProjectService from "../../services/project.service";
import ProjectForm from "../project-form.component";

class ProjectPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: "",
            formLabelClass: "form-label default-color fw-bold",
            inputClass: "",
            buttonClass: "",
            disabled: this.props.disabled,
            projectId: this.props.projectId,
        };
    }

    componentDidMount() {
            this.setState({
                disabled: this.props.disabled,
                projectId: this.props.projectId,
            });
        }

    render() {
        return <div className="ps-5 pe-5">
            <div className="row g-3">
                <div className="col-md-6">
                    <ProjectForm disabled={this.state.disabled} projectId={this.state.projectId}/>
                </div>
                <div className="col-md-6">

                </div>
            </div>

        </div>
    }

}

export default ProjectPage;