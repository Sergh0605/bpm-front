import React from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import {FormattedMessage} from "react-intl";
import CompanyService from "../services/company.service";
import DocumentTypeService from "../services/document-type.service";

const required = (value, props) => {
    if (!value || value < 1) {
        return (
            <div className="alert alert-danger" role="alert">
                <div className="align-items-center">
                    {props.validerrormessage}
                </div>
            </div>
        );
    }
};

class DocumentForm extends React.Component {
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
            users: [],
            document: {
                name: "Создание нового документа",
                project: {
                    id: "",
                    name: "",
                },
                documentFullCode: "",
                documentType: {id: -1},
                code: "",
                reassemblyRequired: false,
                version: 1,
            },
        };
    }

    componentDidMount() {
        this.refresh()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) {
            this.refresh();
        }
    }

    onChangeHandle(field, e) {
        let fields = this.state.document;
        fields[field] = e.target.value;
        this.setState({fields})
    }

    onChangeFile(e) {
        let fields = this.state;
        fields["file"] = e.target.files[0];
        fields["fileName"] = e.target.value;
        let extension = "." + e.target.value.split('.').pop();
        fields["fileExtensionError"] = extension !== this.state.fileExtension;
        this.setState({fields})
    }

    onSelectDocumentType(e) {
        let fields = this.state.document;
        fields["documentType"] = {
            id: e.target.value
        };
        this.setState({fields});
        let allFields = this.state;
        allFields["showDocumentTypeErrorMessage"] = false;
        let extension = ".txt";
        if (e.target.value === "4") {
            extension = ".txt"
        }
        if (e.target.value === "5") {
            extension = ".pdf"
        }
        allFields["fileExtension"] = extension;
        this.setState({allFields});
    }

    onSelectChangeHandle(field, showField, e) {
        let fields = this.state.document;
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
            showDocumentTypeErrorMessage: false,
            fileExtensionError: false,
        })
        this.props.cancelButtonClick();
    }

    onSaveHandler(e) {
        e.preventDefault();
        this.form.validateAll();
        if (this.state.document.documentType.id < 0) {
            this.setState({
                showDocumentTypeErrorMessage: true,
            })
        }
        if (this.checkBtn.context._errors.length === 0 &&
            this.state.document.documentType.id > 0 &&
            !this.state.fileExtensionError) {
            this.props.saveButtonClick(this.state.document, this.state.file);
        }
    }

    refresh() {
        this.setState({
            document: this.props.document,
            fileExtension: ".txt",
        })
        if (this.props.project) {
            this.setState({
                loading: true,
            })
            CompanyService.getUsersById(this.props.project.company.id).then(
                usrResponse => {
                    DocumentTypeService.getAll().then(
                        typeResponse => {
                            this.setState({
                                users: usrResponse.data,
                                types: typeResponse.data,
                                loading: false,
                            })
                        }
                    )
                }
            )
        }
    }

    render() {
        let typesList = (types, typeIdInDocument) => types && types.length > 0 &&
            types.map((type, i) => {
                if (!type.unmodified) {
                    return (
                        <option key={i} value={type.id} selected={type.id === typeIdInDocument}>
                            {type.name}
                        </option>
                    )
                } else {
                    return null
                }
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
        let supervisorList = () => {
            if (this.props.project) {
                let supervisorId;
                if (this.state.document.supervisor) {
                    supervisorId = this.state.document.supervisor.id;
                } else {
                    supervisorId = this.props.project.supervisor.id;
                }
                return (userList(supervisorId))
            } else {
                return null;
            }
        }

        let designerList = () => {
            if (this.props.project) {
                let supervisorId;
                if (this.state.document.designer) {
                    supervisorId = this.state.document.designer.id;
                } else {
                    supervisorId = this.props.project.designer.id;
                }
                return (userList(supervisorId))
            } else {
                return null;
            }
        }

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
                            <label htmlFor="documentName" className={this.state.formLabelClass}>
                                <FormattedMessage id="document-page_name"/> *
                            </label>
                            <Input type="text"
                                   className="form-control mb-1"
                                   id="documentName"
                                   name="name"
                                   value={this.state.document.name}
                                   onChange={this.onChangeHandle.bind(this, "name")}
                                   validerrormessage={<FormattedMessage id="document-page_validation-name"/>}
                                   validations={[required]}
                            />
                        </div>
                        <div className="col-md-6 m-0">
                            <label htmlFor="documentFullCode" className={this.state.formLabelClass}>
                                <FormattedMessage id="document-page_full-code"/>
                            </label>
                            <Input type="text"
                                   className="form-control mb-1"
                                   id="documentFullCode"
                                   name="full-code"
                                   value={this.state.document.documentFullCode}
                                   disabled={true}
                            />
                        </div>
                        <div className="col-md-6 m-0">
                            <label htmlFor="documentCode" className={this.state.formLabelClass}>
                                <FormattedMessage id="document-page_code"/> *
                            </label>
                            <Input type="text"
                                   className="form-control mb-1"
                                   id="documentCode"
                                   name="code"
                                   value={this.state.document.code}
                                   onChange={this.onChangeHandle.bind(this, "code")}
                                   validerrormessage={<FormattedMessage id="document-page_validation-code"/>}
                                   validations={[required]}
                            />
                        </div>
                        <div className="col-md-6 m-0">
                            <label htmlFor="type" className={this.state.formLabelClass}>
                                <FormattedMessage id="document_page-type"/>
                            </label>
                            <select
                                className="form-select"
                                id="type"
                                name="type"
                                disabled={this.state.document.id}
                                onChange={this.onSelectDocumentType.bind(this)}>
                                <option selected={this.state.document.documentType.id === -1} hidden={true}>
                                    <FormattedMessage id="document_page-type-choice"/>
                                </option>
                                {typesList(this.state.types, this.state.document.documentType.id)}
                            </select>
                            {this.state.showDocumentTypeErrorMessage && (
                                <div className="alert alert-danger mt-1" role="alert">
                                    <FormattedMessage id="document-page_validation-document-type"/>
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
                                onChange={this.onSelectChangeHandle.bind(this, "designer", "showDocumentTypeErrorMessage")}
                            >
                                {designerList()}
                            </select>
                        </div>
                        <div className="col-md-3 m-0">
                            <label htmlFor="supervisor" className={this.state.formLabelClass}>
                                <FormattedMessage id="project_page-supervisor"/>
                            </label>
                            <select
                                className="form-select"
                                id="supervisor"
                                name="supervisor"
                                onChange={this.onSelectChangeHandle.bind(this, "supervisor", "showDocumentTypeErrorMessage")}>
                                {supervisorList()}
                            </select>
                        </div>
                        <div className="col-12 m-0">
                            <label htmlFor="file" className={this.state.formLabelClass}>
                                <FormattedMessage id="document_page-file"/>
                            </label>
                            <Input type="file"
                                   accept={this.state.fileExtension}
                                   disabled={this.state.document.documentType.id < 0}
                                   className="form-control mb-1"
                                   id="file"
                                   name="file"
                                   value={this.state.fileName}
                                   onChange={this.onChangeFile.bind(this)}
                            />
                            {this.state.fileExtensionError && (
                                <div className="alert alert-danger mt-1" role="alert">
                                    <FormattedMessage id="document-page_validation-file"/>
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
                            {this.props.message && (
                                <div className="form-group pt-3 small">
                                    <div className="alert alert-danger p-1" role="alert">
                                        {this.props.message}
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

export default DocumentForm;