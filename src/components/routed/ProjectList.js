import pdfIcon from '../../images/pdf.png';
import deleteIcon from '../../images/delete.png';
import newProjectButton from '../../images/newProjectButton.png';
import React from 'react';
import {FormattedMessage} from "react-intl";
import ProjectService from "../../services/project.service";
import AssembleButton from "../assemble-button.component";
import IconButton from "../icon-button.component";
import AuthService from "../../services/auth.service";
import {Link} from "react-router-dom";
import LinkButton from "../link-button.component";

class ProjectList extends React.Component {
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

                <div className="row justify-content-between pt-3">
                    <div className="col-2">
                        <h4>
                            <FormattedMessage id="project-list_head"/>
                        </h4>
                    </div>
                    <form className="col-8">
                        <div className="row" align="center">
                            <div className="col-10">
                                <input type="search" className="form-control" id="bpm-search" placeholder=""/>
                            </div>
                            <div className="col-2" align="left">
                                <button type="submit" className="btn btn-primary mb-3 fw-bold">
                                    <FormattedMessage id="project-list_search-button"/>
                                </button>
                            </div>
                        </div>
                    </form>
                    <div className="col-1 me-2" align="right">
                            <LinkButton disabled={!this.state.editable} icon={newProjectButton} to={"/project/new"}/>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table align-middle table-hover">
                        <thead>
                        <tr>
                            <th scope="col" className="code-col">
                                <FormattedMessage id="project-list_col-code"/>
                            </th>
                            <th scope="col" className="name-col">
                                <FormattedMessage id="project-list_col-name"/>
                            </th>
                            <th scope="col" className="stage-col">
                                <FormattedMessage id="project-list_col-stage"/>
                            </th>
                            <th scope="col" className="company-col">
                                <FormattedMessage id="project-list_col-company"/>
                            </th>
                            <th scope="col" className="time-col">
                                <FormattedMessage id="project-list_col-editTime"/>
                            </th>
                            <th scope="col" className="button-col"></th>
                            <th scope="col" className="button-col"></th>
                            <th scope="col" className="button-col"></th>
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
                                <td><AssembleButton disabled={!this.state.editable} objectId={project.id}
                                                    assembled={!project.reassemblyRequired}
                                                    onClickHandler={this.assemble}/>
                                </td>
                                <td><IconButton objectId={project.id} disabled={false} icon={pdfIcon}
                                                onClickHandler={this.getPdf}/></td>
                                <td><IconButton objectId={project.id} disabled={!this.state.editable} icon={deleteIcon}
                                                onClickHandler={this.deleteProject}/></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        }
    }

    render() {
        return (this.getTable())
    }
}

export default ProjectList;