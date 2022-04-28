import React from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import {FormattedMessage} from "react-intl";
import {extensionMismatch, passwordLength, required} from "../utils/validators";

class UserForm extends React.Component {
    constructor(props) {
        super(props);
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
            roles: [],
            companies: [],
            user: {
                lastName: "Новый пользователь",
                login: "",
                password: "",
                company: {id: -1},
                deleted: false,
                email: "",
                roles: [{id: -1}]
            },
            fileExtensions: [".png", ".jpg"],
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

    onChangeHandle(field, e) {
        let fields = this.state.user;
        fields[field] = e.target.value;
        this.setState({fields})
    }

    onChangeFile(e) {
        let fields = this.state;
        fields["file"] = e.target.files[0];
        fields["fileName"] = e.target.value;
        this.setState({fields})
    }

    onSelectChangeHandle(field, showField, e) {
        let fields = this.state.user;
        if (field === "roles") {
            fields[field] = [{id: e.target.value}];
        } else {
            fields[field] = {
                id: e.target.value
            };
        }
        this.setState({fields});
        let allFields = this.state;
        allFields[showField] = false;
        this.setState({allFields});
    }

    onCancelHandler(e) {
        e.preventDefault();
        this.setState({
            showCompanyErrorMessage: false,
            showRoleErrorMessage: false,
            fileExtensionError: false,
        })
        this.props.cancelButtonClick();
    }

    onSaveHandler(e) {
        e.preventDefault();
        this.form.validateAll();
        if (this.state.user.company.id < 0) {
            this.setState({
                showCompanyErrorMessage: true,
            })
        }
        if (this.state.user.roles[0].id < 0) {
            this.setState({
                showRoleErrorMessage: true,
            })
        }
        if (this.checkBtn.context._errors.length === 0 &&
            this.state.user.company.id > 0 &&
            this.state.user.roles[0].id > 0 &&
            !this.state.fileExtensionError) {
            this.props.saveButtonClick(this.state.user, this.state.file);
        }
    }

    refresh() {
        this.setState({
            user: this.props.user,
            loading: this.props.loading,
            companies: this.props.companies,
            types: this.props.types,
            roles: this.props.roles,
            showLoginDuplicationErrorMessage: false,
            showFileMaxSizeException: false,
            errMessage: this.props.message,
        })
        if (this.props.message.includes("already exists")) {
            this.setState({
                showLoginDuplicationErrorMessage: true,
                errMessage: "",
            })}
        if (this.props.message.includes("Maximum upload size exceeded")) {
            this.setState({
                showFileMaxSizeException: true,
                errMessage: "",
            })}
        }

    render() {
        const companies = this.state.companies;
        let companyList = (companyId) => companies && companies.length > 0 &&
            companies.map((company, i) => {
                return (
                    <option key={i} value={company.id} selected={company.id === companyId}>
                        {company.name}
                    </option>
                )
            })

        const roles = this.state.roles;
        let roleList = (roleId) => roles && roles.length > 0 &&
            roles.map((role, i) => {
                return (
                    <option key={i} value={role.id} selected={role.id === roleId}>
                        {role.name}
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
                        <div className="col-md-6 m-0">
                            <label htmlFor="userName" className={this.state.formLabelClass}>
                                <FormattedMessage id="user-page_name"/> *
                            </label>
                            <Input type="text"
                                   className="form-control mb-1"
                                   id="userName"
                                   name="name"
                                   maxlength="13"
                                   value={this.state.user.lastName}
                                   onChange={this.onChangeHandle.bind(this, "lastName")}
                                   validerrormessage={<FormattedMessage id="user-page_validation-name"/>}
                                   validations={[required]}
                            />
                        </div>
                        <div className="col-md-6 m-0">
                            <label htmlFor="email" className={this.state.formLabelClass}>
                                <FormattedMessage id="user-page_email"/> *
                            </label>
                            <Input type="email"
                                   className="form-control mb-1"
                                   id="email"
                                   name="email"
                                   maxlength="50"
                                   value={this.state.user.email}
                                   onChange={this.onChangeHandle.bind(this, "email")}
                                   validerrormessage={<FormattedMessage id="user-page_validation-email"/>}
                                   validations={[required]}
                            />
                        </div>
                        <div className="col-md-6 m-0">
                            <label htmlFor="login" className={this.state.formLabelClass}>
                                <FormattedMessage id="user-page_login"/> *
                            </label>
                            <Input type="text"
                                   className="form-control mb-1"
                                   id="login"
                                   name="login"
                                   maxlength="20"
                                   value={this.state.user.login}
                                   onChange={this.onChangeHandle.bind(this, "login")}
                                   validerrormessage={<FormattedMessage id="user-page_validation-login"/>}
                                   validations={[required]}
                            />
                            {this.state.showLoginDuplicationErrorMessage && (
                                <div className="alert alert-danger mt-1" role="alert">
                                    <FormattedMessage id="user-page_validation-login-duplication"/>
                                </div>)}
                        </div>
                        <div className="col-md-6 m-0">
                            <label htmlFor="password" className={this.state.formLabelClass}>
                                <FormattedMessage id="user-page_password"/> *
                            </label>
                            <Input type="password"
                                   className="form-control mb-1"
                                   id="password"
                                   name="password"
                                   maxlength="100"
                                   disabled={this.state.user.id}
                                   value={this.state.user.password}
                                   onChange={this.onChangeHandle.bind(this, "password")}
                                   validerrormessage={<FormattedMessage id="user-page_validation-password"/>}
                                   validations={[passwordLength]}
                            />
                        </div>
                        <div className="col-md-6 m-0">
                            <label htmlFor="company" className={this.state.formLabelClass}>
                                <FormattedMessage id="user_page-company"/> *
                            </label>
                            <select
                                className="form-select"
                                id="company"
                                name="company"
                                disabled={this.state.user.id}
                                onChange={this.onSelectChangeHandle.bind(this, "company", "showCompanyErrorMessage")}>
                                <option selected={this.state.user.company.id === -1} hidden={true}>
                                    <FormattedMessage id="user-page_company-choice"/>
                                </option>
                                {companyList(this.state.user.company.id)}
                            </select>
                            {this.state.showCompanyErrorMessage && (
                                <div className="alert alert-danger mt-1" role="alert">
                                    <FormattedMessage id="user-page_validation-company"/>
                                </div>)}
                        </div>
                        <div className="col-md-6 m-0">
                            <label htmlFor="role" className={this.state.formLabelClass}>
                                <FormattedMessage id="user_page-role"/> *
                            </label>
                            <select
                                className="form-select"
                                id="role"
                                name="role"
                                disabled={!this.props.currentUser.roles.includes("ADMIN")}
                                onChange={this.onSelectChangeHandle.bind(this, "roles", "showRoleErrorMessage")}>
                                <option selected={this.state.user.roles[0].id === -1} hidden={true}>
                                    <FormattedMessage id="user-page_role-choice"/>
                                </option>
                                {roleList(this.state.user.roles[0].id)}
                            </select>
                            {this.state.showRoleErrorMessage && (
                                <div className="alert alert-danger mt-1" role="alert">
                                    <FormattedMessage id="user-page_validation-role"/>
                                </div>)}
                        </div>
                        <div className="col-12 m-0">
                            <label htmlFor="file" className={this.state.formLabelClass}>
                                <FormattedMessage id="user-page_file"/>
                            </label>
                            <Input type="file"
                                   accept={this.state.fileExtensions}
                                   className="form-control mb-1"
                                   id="file"
                                   name="file"
                                   value={this.state.fileName}
                                   fileExtensions={this.state.fileExtensions}
                                   onChange={this.onChangeFile.bind(this)}
                                   validerrormessage={<FormattedMessage id="user-page_validation-file"/>}
                                   validations={[extensionMismatch]}
                            />
                            {this.state.showFileMaxSizeException && (
                                <div className="alert alert-danger mt-1" role="alert">
                                    <FormattedMessage id="document-page_validation-file-max-size"/>
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

export default UserForm;