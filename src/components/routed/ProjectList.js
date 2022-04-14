import pdfIcon from '../../images/pdf.png';
import deleteIcon from '../../images/delete.png';
import React from 'react';
import {FormattedMessage} from "react-intl";
import ProjectService from "../../services/project.service";
import AssembleButton from "../assemble-button.component";
import IconButton from "../icon-button.component";
import AuthService from "../../services/auth.service";

class ProjectList extends React.Component {
    // eslint-disable-next-line no-useless-constructor
    constructor(props) {
        super(props);
        this.refresh = this.refresh.bind(this);
        this.assemble = this.assemble.bind(this);
        this.deleteProject = this.deleteProject.bind(this);
        this.getPdf = this.getPdf.bind(this);
        this.state = {
            data: "",
            editable: this.props.editable
        };
    }

    componentDidMount() {
        this.refresh();
    }

    refresh() {
        ProjectService.getAll().then(
            response => {
                this.setState({
                    data: response.data
                });
            }
        );
    }

    assemble(projectId) {
        ProjectService.assemble(projectId).then(this.refresh);
    }

    deleteProject(projectId) {
        ProjectService.delete(projectId).then(this.refresh);
    }

    getPdf(projectId) {
        ProjectService.getPdf(projectId)
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'project.pdf'); //TODO customize name
                document.body.appendChild(link);
                link.click();
            }
        );
    }

    getTable() {
        if (this.state.data && this.state.data.content) {
            let projects = this.state.data.content
            return <div className="ps-5 pe-5">
                <table className="table table-hover">
                    <thead>
                    <tr>
                        <th scope="col">
                            <FormattedMessage id="project-list_col-code"/>
                        </th>
                        <th scope="col">
                            <FormattedMessage id="project-list_col-name"/>
                        </th>
                        <th scope="col">
                            <FormattedMessage id="project-list_col-stage"/>
                        </th>
                        <th scope="col">
                            <FormattedMessage id="project-list_col-company"/>
                        </th>
                        <th scope="col">
                            <FormattedMessage id="project-list_col-editTime"/>
                        </th>
                        <th scope="col"></th>
                        <th scope="col"></th>
                        <th scope="col"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {projects.map((project) => (
                        <tr key={project.id}>
                            <th scope="row">{project.code}</th>
                            <td>{project.name}</td>
                            <td>{project.stage.name}</td>
                            <td>{project.company.name}</td>
                            <td>{project.editTime}</td>
                            <td><AssembleButton disabled={!this.state.editable} objectId={project.id} assembled={!project.reassemblyRequired} onClickHandler={this.assemble}/></td>
                            <td><IconButton objectId={project.id} disabled={false} icon={pdfIcon} onClickHandler={this.getPdf}/></td>
                            <td><IconButton objectId={project.id} disabled={!this.state.editable} icon={deleteIcon} onClickHandler={this.deleteProject}/></td>
                            <td></td>
                            <td></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        }
    }

    render() {
        return (this.getTable())
    }
}

export default ProjectList;