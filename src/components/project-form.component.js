import React from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import {FormattedMessage} from "react-intl";
import CompanyService from "../services/company.service";
import {required} from "../utils/validators";

class ProjectForm extends React.Component {
    constructor(props) {
        super(props);
        this.onCompanyChange = this.onCompanyChange.bind(this);
        this.onCancelHandler = this.onCancelHandler.bind(this);
        this.onSaveHandler = this.onSaveHandler.bind(this);
        this.refresh = this.refresh.bind(this);
        this.state = {
            loading: true,
            url: "",
            formLabelClass: "form-label default-color fw-bold mb-0",
            inputClass: "",
            buttonClass: "",
            disabled: this.props.disabled,
            stages: [],
            companies: [],
            users: [],
            project: {
                name: "Создание нового проекта",
                code: "",
                releaseDate: "",
                objectName: "",
                objectAddress: "",
                volumeNumber: 1,
                volumeName: "",
                company: {id: -1},
                stage: {id: -1},
                designer: {id: -1},
                supervisor: {id: -1},
                controller: {id: -1},
                chief: {id: -1},
                version: 1,
            },
        };
    }

    componentDidMount() {
        this.refresh();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) {
            this.refresh();
        }
    }

    onCompanyChange(e) {
        this.setState({
            loading: true
        })
        CompanyService.getUsersById(e.target.value).then(
            response => {
                this.setState({
                    users: response.data,
                    project: {
                        ...this.state.project,
                        company: {
                            id: e.target.value
                        },
                        designer: {id: -1},
                        supervisor: {id: -1},
                        controller: {id: -1},
                        chief: {id: -1},
                    },
                    loading: false,
                    showCompanyErrorMessage: false,
                    showDesignerErrorMessage: false,
                    showControllerErrorMessage: false,
                    showSupervisorErrorMessage: false,
                    showChiefErrorMessage: false,
                })
            });
    }

    onChangeHandle(field, e) {
        let fields = this.state.project;
        fields[field] = e.target.value;
        this.setState({fields})
    }

    onSelectChangeHandle(field, showField, e) {
        let fields = this.state.project;
        fields[field] = {
            id: e.target.value
        };
        this.setState({fields});
        let allFields = this.state;
        allFields[showField] = false;
        this.setState({allFields});
    }

    onCancelHandler(e) {
        e.preventDefault();
        this.setState({
            showCompanyErrorMessage: false,
            showStageErrorMessage: false,
            showDesignerErrorMessage: false,
            showControllerErrorMessage: false,
            showSupervisorErrorMessage: false,
            showChiefErrorMessage: false,
            showCodeDuplicationErrorMessage: false,
        })
        this.props.cancelButtonClick();
    }

    onSaveHandler(e) {
        e.preventDefault();
        this.form.validateAll();
        if (this.state.project.company.id < 0) {
            this.setState({
                showCompanyErrorMessage: true,
            })
        }
        if (this.state.project.stage.id < 0) {
            this.setState({
                showStageErrorMessage: true,
            })
        }
        if (this.state.project.designer.id < 0) {
            this.setState({
                showDesignerErrorMessage: true,
            })
        }
        if (this.state.project.controller.id < 0) {
            this.setState({
                showControllerErrorMessage: true,
            })
        }
        if (this.state.project.supervisor.id < 0) {
            this.setState({
                showSupervisorErrorMessage: true,
            })
        }
        if (this.state.project.chief.id < 0) {
            this.setState({
                showChiefErrorMessage: true,
            })
        }
        if (this.checkBtn.context._errors.length === 0 &&
            this.state.project.chief.id > 0 &&
            this.state.project.supervisor.id > 0 &&
            this.state.project.controller.id > 0 &&
            this.state.project.designer.id > 0 &&
            this.state.project.stage.id > 0 &&
            this.state.project.company.id > 0) {
            this.props.saveButtonClick(this.state.project);
        }
    }

    refresh() {
        if (this.props.message.includes("already exists")) {
            this.setState({
                showCodeDuplicationErrorMessage: true,
                project: this.props.project,
                companies: this.props.companies,
                users: this.props.users,
                stages: this.props.stages,
                loading: this.props.loading,
            })
        } else {
            this.setState({
                project: this.props.project,
                errMessage: this.props.message,
                companies: this.props.companies,
                users: this.props.users,
                stages: this.props.stages,
                loading: this.props.loading,
            })
        }
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

        return (
            <div>
                <fieldset disabled={this.props.disabled}>
                    <Form
                        className="row g-3"
                        onSubmit={this.onSaveHandler}
                        ref={c => {
                            this.form = c;
                        }}
                    >
                        <div className="col-12 m-0">
                            <label htmlFor="projectName" className={this.state.formLabelClass}>
                                <FormattedMessage id="project-page_name"/> *
                            </label>
                            <Input type="text"
                                   className="form-control mb-1"
                                   id="projectName"
                                   name="name"
                                   value={this.state.project.name}
                                   onChange={this.onChangeHandle.bind(this, "name")}
                                   validerrormessage={<FormattedMessage id="project-page_validation-name"/>}
                                   validations={[required]}
                            />
                        </div>
                        <div className="col-md-6 m-0">
                            <label htmlFor="projectCode" className={this.state.formLabelClass}>
                                <FormattedMessage id="project-page_code"/> *
                            </label>
                            <Input type="text"
                                   className="form-control mb-1"
                                   id="projectCode"
                                   name="code"
                                   value={this.state.project.code}
                                   onChange={this.onChangeHandle.bind(this, "code")}
                                   validerrormessage={<FormattedMessage id="project-page_validation-code"/>}
                                   validations={[required]}
                            />
                            {this.state.showCodeDuplicationErrorMessage && (
                                <div className="alert alert-danger mt-1" role="alert">
                                    <FormattedMessage id="project-page_validation-code-duplication"/>
                                </div>)}
                        </div>
                        <div className="col-md-6 m-0">
                            <label htmlFor="releaseDate" className={this.state.formLabelClass}>
                                <FormattedMessage id="project-page_date"/> *
                            </label>
                            <Input type="date"
                                   className="form-control mb-1"
                                   id="releaseDate"
                                   name="releaseDate"
                                   value={this.state.project.releaseDate}
                                   onChange={this.onChangeHandle.bind(this, "releaseDate")}
                                   validerrormessage={<FormattedMessage id="project-page_validation-release-date"/>}
                                   validations={[required]}
                            />
                        </div>
                        <div className="col-12 m-0">
                            <label htmlFor="objectName" className={this.state.formLabelClass}>
                                <FormattedMessage id="project_page-object-name"/>
                            </label>
                            <Input type="text"
                                   className="form-control mb-1"
                                   id="objectName"
                                   name="objectName"
                                   value={this.state.project.objectName}
                                   onChange={this.onChangeHandle.bind(this, "objectName")}
                            />
                        </div>
                        <div className="col-12 m-0">
                            <label htmlFor="objectAddress" className={this.state.formLabelClass}>
                                <FormattedMessage id="project_page-object-address"/>
                            </label>
                            <Input type="text"
                                   className="form-control mb-1"
                                   id="objectAddress"
                                   name="objectAddress"
                                   value={this.state.project.objectAddress}
                                   onChange={this.onChangeHandle.bind(this, "objectAddress")}
                            />
                        </div>
                        <div className="col-md-6 m-0">
                            <label htmlFor="volumeNumber" className={this.state.formLabelClass}>
                                <FormattedMessage id="project_page-volume-number"/> *
                            </label>
                            <Input type="number"
                                   className="form-control mb-1"
                                   id="volumeNumber"
                                   name="volumeNumber"
                                   value={this.state.project.volumeNumber}
                                   onChange={this.onChangeHandle.bind(this, "volumeNumber")}
                                   validerrormessage={<FormattedMessage
                                       id="project-page_validation-volume-number"/>}
                                   validations={[required]}
                            />
                        </div>
                        <div className="col-md-6 m-0">
                            <label htmlFor="volumeName" className={this.state.formLabelClass}>
                                <FormattedMessage id="project_page-volume-name"/> *
                            </label>
                            <Input type="text"
                                   className="form-control mb-1"
                                   id="volumeName"
                                   name="volumeName"
                                   value={this.state.project.volumeName}
                                   onChange={this.onChangeHandle.bind(this, "volumeName")}
                                   validerrormessage={<FormattedMessage id="project-page_validation-volume-name"/>}
                                   validations={[required]}
                            />
                        </div>
                        <div className="col-md-6 m-0">
                            <label htmlFor="company" className={this.state.formLabelClass}>
                                <FormattedMessage id="project_page-company"/>
                            </label>
                            <select
                                className="form-select"
                                id="company"
                                name="company"
                                onChange={this.onCompanyChange}>
                                <option selected={this.state.project.company.id === -1} hidden={true}>
                                    <FormattedMessage id="project_page-company-choice"/>
                                </option>
                                {objectsList(this.state.companies, this.state.project.company.id)}
                            </select>
                            {this.state.showCompanyErrorMessage && (
                                <div className="alert alert-danger mt-1" role="alert">
                                    <FormattedMessage id="project-page_validation-company"/>
                                </div>)}
                        </div>
                        <div className="col-md-6 m-0">
                            <label htmlFor="stage" className={this.state.formLabelClass}>
                                <FormattedMessage id="project_page-stage"/>
                            </label>
                            <select
                                className="form-select"
                                id="stage"
                                name="stage"
                                onChange={this.onSelectChangeHandle.bind(this, "stage", "showStageErrorMessage")}
                            >
                                <option selected={this.state.project.stage.id === -1} hidden={true}>
                                    <FormattedMessage id="project_page-stage-choice"/>
                                </option>
                                {objectsList(this.state.stages, this.state.project.stage.id)}
                            </select>
                            {this.state.showStageErrorMessage && (
                                <div className="alert alert-danger mt-1" role="alert">
                                    <FormattedMessage id="project-page_validation-stage"/>
                                </div>)}
                        </div>
                        <div className="col-md-3 m-0">
                            <label htmlFor="designer" className={this.state.formLabelClass}>
                                <FormattedMessage id="project_page-designer"/>
                            </label>
                            <select
                                className="form-select"
                                id="designer"
                                name="designer"
                                onChange={this.onSelectChangeHandle.bind(this, "designer", "showDesignerErrorMessage")}
                            >
                                <option selected={this.state.project.designer.id === -1} hidden={true}>
                                    <FormattedMessage id="project_page-user-choice"/>
                                </option>
                                {userList(this.state.project.designer.id)}
                            </select>
                            {this.state.showDesignerErrorMessage && (
                                <div className="alert alert-danger mt-1" role="alert">
                                    <FormattedMessage id="project-page_validation-designer"/>
                                </div>)}
                        </div>
                        <div className="col-md-3 m-0">
                            <label htmlFor="supervisor" className={this.state.formLabelClass}>
                                <FormattedMessage id="project_page-supervisor"/>
                            </label>
                            <select
                                className="form-select"
                                id="supervisor"
                                name="supervisor"
                                onChange={this.onSelectChangeHandle.bind(this, "supervisor", "showSupervisorErrorMessage")}
                            >
                                <option selected={this.state.project.supervisor.id === -1} hidden={true}>
                                    <FormattedMessage id="project_page-user-choice"/>
                                </option>
                                {userList(this.state.project.supervisor.id)}
                            </select>
                            {this.state.showSupervisorErrorMessage && (
                                <div className="alert alert-danger mt-1" role="alert">
                                    <FormattedMessage id="project-page_validation-supervisor"/>
                                </div>)}
                        </div>
                        <div className="col-md-3 m-0">
                            <label htmlFor="controller" className={this.state.formLabelClass}>
                                <FormattedMessage id="project_page-controller"/>
                            </label>
                            <select
                                className="form-select"
                                id="controller"
                                name="controller"
                                onChange={this.onSelectChangeHandle.bind(this, "controller", "showControllerErrorMessage")}
                            >
                                <option selected={this.state.project.controller.id === -1} hidden={true}>
                                    <FormattedMessage id="project_page-user-choice"/>
                                </option>
                                {userList(this.state.project.controller.id)}
                            </select>
                            {this.state.showControllerErrorMessage && (
                                <div className="alert alert-danger mt-1" role="alert">
                                    <FormattedMessage id="project-page_validation-controller"/>
                                </div>)}
                        </div>
                        <div className="col-md-3 m-0">
                            <label htmlFor="chief" className={this.state.formLabelClass}>
                                <FormattedMessage id="project_page-chief"/>
                            </label>
                            <select
                                className="form-select"
                                id="chief"
                                name="chief"
                                onChange={this.onSelectChangeHandle.bind(this, "chief", "showChiefErrorMessage")}
                            >
                                <option selected={this.state.project.chief.id === -1} hidden={true}>
                                    <FormattedMessage id="project_page-user-choice"/>
                                </option>
                                {userList(this.state.project.chief.id)}
                            </select>
                            {this.state.showChiefErrorMessage && (
                                <div className="alert alert-danger mt-1" role="alert">
                                    <FormattedMessage id="project-page_validation-chief"/>
                                </div>)}
                        </div>
                        <div className="col-12">
                            <div align="end">
                                <button
                                    className="btn btn-primary fw-bold fs-5 custom-button me-2"
                                    disabled={this.props.loading}
                                    hidden={this.props.disabled}>
                                    {this.props.loading && (
                                        <span className="spinner-border spinner-border-sm"></span>
                                    )}
                                    <span>
                                    <FormattedMessage id="project-page_save-button"/>
                                </span>
                                </button>
                                <button
                                    className="btn btn-outline-primary fw-bold fs-5 custom-button"
                                    hidden={this.props.disabled}
                                    onClick={this.onCancelHandler}
                                >
                                    <FormattedMessage id="project-page_cancel-button"/>
                                </button>
                            </div>
                        </div>
                        <div className="col-12">
                            {this.state.errMessage && (
                                <div className="form-group pt-3 small">
                                    <div className="alert alert-danger p-1" role="alert">
                                        {this.state.errMessage}
                                    </div>
                                </div>
                            )}
                        </div>
                        <CheckButton
                            style={{display: "none"}}
                            ref={c => {
                                this.checkBtn = c;
                            }}
                        />
                    </Form>
                </fieldset>
            </div>
        );
    }
}

export default ProjectForm;