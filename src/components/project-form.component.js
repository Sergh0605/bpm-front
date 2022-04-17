import React from "react";
import {FormattedMessage} from "react-intl";
import ProjectService from "../services/project.service";
import StageService from "../services/stage.service";
import CompanyService from "../services/company.service";

class ProjectForm extends React.Component {
    constructor(props) {
        super(props);
        this.onCompanyChange = this.onCompanyChange.bind(this);
        this.state = {
            formLabelClass: "form-label default-color fw-bold",
            inputClass: "",
            buttonClass: "",
            disabled: this.props.disabled,
            stages: [],
            companies: [],
            users: [],
            project: {
                name: "",
                code: "",
                releaseDate: "",
                objectName: "",
                objectAddress: "",
                volumeNumber: "",
                volumeName: "",
                company: {id: ""},
                stage: {id: ""},
                designer: {id: ""},
                supervisor: {id: ""},
                controller: {id: ""},
                chief: {id: ""},
            }

        };
    }

    componentDidMount() {
        StageService.getAll().then(
            stjResponse => {
                CompanyService.getAll().then(
                    companyResponse => {
                        if (this.props.projectId) {
                            ProjectService.getById(this.props.projectId).then(
                                prjResponse => {
                                    CompanyService.getUsersById(prjResponse.data.company.id).then(
                                        compResponse => {
                                            this.setState({
                                                users: compResponse.data,
                                                project: prjResponse.data,
                                                companies: companyResponse.data,
                                                stages: stjResponse.data,
                                                disabled: this.props.disabled
                                            })
                                        }
                                    )
                                }
                            );
                        } else {
                            this.setState({
                                    companies: companyResponse.data,
                                    stages: stjResponse.data,
                                    disabled: this.props.disabled
                                }
                            )
                        }
                    }
                )
            }
        )
    }

    onCompanyChange(e) {
        CompanyService.getUsersById(e.target.value).then(
            response => {
                this.setState({
                    users: response.data,
                    selectedCompanyId: e.target.value
                })
            });
    }

    render() {
        let objectsList = (objects, objectIdInProject) => objects && objects.length > 0 &&
            objects.map((object, i) => {
                return (
                    <option key={i} value={object.id} selected={object.id === objectIdInProject}>
                        {object.name}
                    </option>
                )
            })

        const users = this.state.users;
        let userList = (userId) => users && users.length > 0 &&
            users.map((user, i) => {
                return (
                    <option key={i} value={user.id} selected={user.id === userId}>
                        {user.lastName}
                    </option>
                )
            })


        return <fieldset disabled={this.state.disabled}>
            <form className="row g-3">
                <div className="col-12 m-0">
                    <label htmlFor="projectName" className={this.state.formLabelClass}>
                        <FormattedMessage id="project-page_name"/> *
                    </label>
                    <input type="text"
                           className="form-control"
                           id="projectName"
                           name="name"
                           defaultValue={this.state.project.name}/>
                </div>
                <div className="col-md-6 m-0">
                    <label htmlFor="projectCode" className={this.state.formLabelClass}>
                        <FormattedMessage id="project-page_code"/> *
                    </label>
                    <input type="text"
                           className="form-control"
                           id="projectCode"
                           name="code"
                           defaultValue={this.state.project.code}/>
                </div>
                <div className="col-md-6 m-0">
                    <label htmlFor="releaseDate" className={this.state.formLabelClass}>
                        <FormattedMessage id="project-page_date"/> *
                    </label>
                    <input type="date"
                           className="form-control"
                           id="releaseDate"
                           name="releaseDate"
                           defaultValue={this.state.project.releaseDate}/>
                </div>
                <div className="col-12 m-0">
                    <label htmlFor="objectName" className={this.state.formLabelClass}>
                        <FormattedMessage id="project_page-object-name"/>
                    </label>
                    <input type="text"
                           className="form-control"
                           id="objectName"
                           name="objectName"
                           defaultValue={this.state.project.objectName}/>
                </div>
                <div className="col-12 m-0">
                    <label htmlFor="objectAddress" className={this.state.formLabelClass}>
                        <FormattedMessage id="project_page-object-address"/>
                    </label>
                    <input type="text"
                           className="form-control"
                           id="objectAddress"
                           name="objectAddress"
                           defaultValue={this.state.project.objectAddress}/>
                </div>
                <div className="col-md-6 m-0">
                    <label htmlFor="volumeNumber" className={this.state.formLabelClass}>
                        <FormattedMessage id="project_page-volume-number"/>
                    </label>
                    <input type="number"
                           className="form-control"
                           id="volumeNumber"
                           name="volumeNumber"
                           defaultValue={this.state.project.volumeNumber}/>
                </div>
                <div className="col-md-6 m-0">
                    <label htmlFor="volumeName" className={this.state.formLabelClass}>
                        <FormattedMessage id="project_page-volume-name"/>
                    </label>
                    <input type="text"
                           className="form-control"
                           id="volumeName"
                           name="volumeName"
                           defaultValue={this.state.project.volumeName}/>
                </div>
                <div className="col-md-6 m-0">
                    <label htmlFor="company" className={this.state.formLabelClass}>
                        <FormattedMessage id="project_page-company"/>
                    </label>
                    <select className="form-select" id="company" name="company" onChange={this.onCompanyChange}>
                        <option selected={!this.state.project} hidden={true}>
                            <FormattedMessage id="project_page-company-choice"/>
                        </option>
                        {objectsList(this.state.companies, this.state.selectedCompanyId || this.state.project.company.id)}
                    </select>
                </div>
                <div className="col-md-6 m-0">
                    <label htmlFor="stage" className={this.state.formLabelClass}>
                        <FormattedMessage id="project_page-stage"/>
                    </label>
                    <select className="form-select" id="stage" name="stage">
                        <option selected={!this.state.project} hidden={true}>
                            <FormattedMessage id="project_page-stage-choice"/>
                        </option>
                        {objectsList(this.state.stages, this.state.project.stage.id)}
                    </select>
                </div>
                <div className="col-md-3 m-0">
                    <label htmlFor="designer" className={this.state.formLabelClass}>
                        <FormattedMessage id="project_page-designer"/>
                    </label>
                    <select className="form-select" id="designer" name="designer">
                        <option selected={!this.state.project} hidden={true}>
                            <FormattedMessage id="project_page-user-choice"/>
                        </option>
                        {userList(this.state.project.designer.id)}
                    </select>
                </div>
                <div className="col-md-3 m-0">
                    <label htmlFor="supervisor" className={this.state.formLabelClass}>
                        <FormattedMessage id="project_page-supervisor"/>
                    </label>
                    <select className="form-select" id="supervisor" name="supervisor">
                        <option selected={!this.state.project} hidden={true}>
                            <FormattedMessage id="project_page-user-choice"/>
                        </option>
                        {userList(this.state.project.supervisor.id)}
                    </select>
                </div>
                <div className="col-md-3 m-0">
                    <label htmlFor="controller" className={this.state.formLabelClass}>
                        <FormattedMessage id="project_page-controller"/>
                    </label>
                    <select className="form-select" id="controller" name="controller">
                        <option selected={!this.state.project} hidden={true}>
                            <FormattedMessage id="project_page-user-choice"/>
                        </option>
                        {userList(this.state.project.controller.id)}
                    </select>
                </div>
                <div className="col-md-3 m-0">
                    <label htmlFor="chief" className={this.state.formLabelClass}>
                        <FormattedMessage id="project_page-chief"/>
                    </label>
                    <select className="form-select" id="chief" name="chief">
                        <option selected={!this.state.project} hidden={true}>
                            <FormattedMessage id="project_page-user-choice"/>
                        </option>
                        {userList(this.state.project.chief.id)}
                    </select>
                </div>
            </form>
        </fieldset>
    }

    getFilledProjectForm(disabled) {

    }

    getButtons(disabled) {

    }

    getDocumentsList(disabled) {

    }

}

export default ProjectForm;