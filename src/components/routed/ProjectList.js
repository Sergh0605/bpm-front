import pdfIcon from '../../images/pdf.png';
import deleteIcon from '../../images/delete.png';
import newProjectButton from '../../images/newProjectButton.png';
import React from 'react';
import {FormattedMessage} from "react-intl";
import ProjectService from "../../services/project.service";
import AssembleButton from "../assemble-button.component";
import IconButton from "../icon-button.component";
import LinkButton from "../link-button.component";
import {Navigate} from "react-router";
import DeleteModal from "../modal";
import CustomPaginator from "../custom-pagination.component";


class ProjectList extends React.Component {
    constructor(props) {
        super(props);
        this.refresh = this.refresh.bind(this);
        this.assemble = this.assemble.bind(this);
        this.deleteProject = this.deleteProject.bind(this);
        this.navigateToUrl = this.navigateToUrl.bind(this);
        this.setUrl = this.setUrl.bind(this);
        this.handleShowModal = this.handleShowModal.bind(this);
        this.handleHideModal = this.handleHideModal.bind(this);
        this.getPage = this.getPage.bind(this);
        this.state = {
            data: "",
            editable: this.props.editable,
            showModal: false,
        };
    }

    componentDidMount() {
        this.setState({
            showModal: false,
        })
        this.refresh();
    }

    refresh() {
        ProjectService.getAll().then(
            response => {
                this.setState({
                    data: response.data,
                    showModal: false
                });
            }
        );
    }

    getPage(pageNumber) {
        ProjectService.getPage(pageNumber).then(
            response => {
                this.setState({
                    data: response.data,
                    showModal: false
                });
            }
        );
    }

    navigateToUrl() {
        if (this.state.url) {
            return (<Navigate to={this.state.url}/>)
        }
    }

    setUrl(url) {
        this.setState({
            url: url,
        })
    }

    assemble(projectId) {
        ProjectService.assemble(projectId).then(this.refresh);
    }

    deleteProject(projectId) {
        ProjectService.delete(projectId).then(this.refresh);
    }

    handleHideModal() {
        this.setState({showModal: false})
    }

    handleShowModal(projectId) {
        this.setState({
            showModal: true,
            projectForDelete: projectId,
        })
    }

    getTable() {
        const navigateToUrl = this.navigateToUrl();
        if (this.state.data && this.state.data.content) {
            let projects = this.state.data.content
            return <div className="ps-5 pe-5">
                {this.state.showModal ? <DeleteModal show={this.state.showModal} onHide={this.handleHideModal} onAgree={this.deleteProject} objectId={this.state.projectForDelete}/> : null}
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
                            <tr key={project.id} onClick={() => this.setUrl("/project/" + project.id)}>
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
                                                onClickHandler={(id) => {
                                                    ProjectService.getPdfForDownload(id)
                                                }}/>
                                </td>
                                <td><IconButton objectId={project.id}
                                                disabled={!this.state.editable}
                                                icon={deleteIcon}
                                                onClickHandler={this.handleShowModal}/>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div>
                    {navigateToUrl}
                </div>
                    <div className="d-flex justify-content-center">
                        {this.state.data.totalPages > 1 ? <CustomPaginator active={this.state.data.number} pageCount={this.state.data.totalPages} onSetPage={this.getPage}/> : null}
                    </div>
            </div>
        }
    }

    render() {
        return (this.getTable())
    }
}

export default ProjectList;