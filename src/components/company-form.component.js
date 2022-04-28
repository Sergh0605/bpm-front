import React from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import {FormattedMessage} from "react-intl";
import {extensionMismatch, required} from "../utils/validators";

class CompanyForm extends React.Component {
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
            company: {
                lastName: "Новая компания",
                signerPosition: "",
                signerName: "",
                city: "",
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
        let fields = this.state.company;
        fields[field] = e.target.value;
        this.setState({fields})
    }

    onChangeFile(e) {
        let fields = this.state;
        fields["file"] = e.target.files[0];
        fields["fileName"] = e.target.value;
        this.setState({fields})
    }

    onCancelHandler(e) {
        e.preventDefault();
        this.setState({
            fileExtensionError: false,
        })
        this.props.cancelButtonClick();
    }

    onSaveHandler(e) {
        e.preventDefault();
        this.form.validateAll();
        if (this.checkBtn.context._errors.length === 0 &&
            !this.state.fileExtensionError) {
            this.props.saveButtonClick(this.state.company, this.state.file);
        }
    }

    refresh() {
        this.setState({
            showNameDuplicationErrorMessage: false,
            showFileMaxSizeException: false,
            company: this.props.company,
            loading: this.props.loading,
            errMessage: this.props.message,
        })
        if (this.props.message.includes("already exists")) {
            this.setState({
                showNameDuplicationErrorMessage: true,
                errMessage: "",
            })
        }
        if (this.props.message.includes("Maximum upload size exceeded")) {
            this.setState({
                showFileMaxSizeException: true,
                errMessage: "",
            })
        }
    }

    render() {
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
                            <label htmlFor="companyName" className={this.state.formLabelClass}>
                                <FormattedMessage id="company-page_name"/> *
                            </label>
                            <Input type="text"
                                   className="form-control mb-1"
                                   id="companyName"
                                   name="name"
                                   maxlength="100"
                                   value={this.state.company.name}
                                   onChange={this.onChangeHandle.bind(this, "name")}
                                   validerrormessage={<FormattedMessage id="company-page_validation-name"/>}
                                   validations={[required]}
                            />
                            {this.state.showNameDuplicationErrorMessage && (
                                <div className="alert alert-danger mt-1" role="alert">
                                    <FormattedMessage id="company-page_validation-name-duplication"/>
                                </div>)}
                        </div>
                        <div className="col-md-6 m-0">
                            <label htmlFor="signerPos" className={this.state.formLabelClass}>
                                <FormattedMessage id="company-page_signer-position"/> *
                            </label>
                            <Input type="text"
                                   className="form-control mb-1"
                                   id="signerPos"
                                   name="signerPos"
                                   maxlength="100"
                                   value={this.state.company.signerPosition}
                                   onChange={this.onChangeHandle.bind(this, "signerPosition")}
                                   validerrormessage={<FormattedMessage id="company-page_validation-signer-position"/>}
                                   validations={[required]}
                            />
                        </div>
                        <div className="col-md-6 m-0">
                            <label htmlFor="signerName" className={this.state.formLabelClass}>
                                <FormattedMessage id="company-page_signer-name"/> *
                            </label>
                            <Input type="signerName"
                                   className="form-control mb-1"
                                   id="signerName"
                                   name="signerName"
                                   maxlength="25"
                                   value={this.state.company.signerName}
                                   onChange={this.onChangeHandle.bind(this, "signerName")}
                                   validerrormessage={<FormattedMessage id="company-page_validation-signer-name"/>}
                                   validations={[required]}
                            />
                        </div>
                        <div className="col-md-6 m-0">
                            <label htmlFor="city" className={this.state.formLabelClass}>
                                <FormattedMessage id="company-page_city"/> *
                            </label>
                            <Input type="text"
                                   className="form-control mb-1"
                                   id="city"
                                   name="city"
                                   maxlength="100"
                                   value={this.state.company.city}
                                   onChange={this.onChangeHandle.bind(this, "city")}
                                   validerrormessage={<FormattedMessage id="company-page_validation-city"/>}
                                   validations={[required]}
                            />
                        </div>
                        <div className="col-12 m-0">
                            <label htmlFor="file" className={this.state.formLabelClass}>
                                <FormattedMessage id="company-page_file"/>
                            </label>
                            <Input type="file"
                                   accept={this.state.fileExtensions}
                                   className="form-control mb-1"
                                   id="file"
                                   name="file"
                                   value={this.state.fileName}
                                   onChange={this.onChangeFile.bind(this)}
                                   fileExtensions={this.state.fileExtensions}
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

export default CompanyForm;