import React from "react";
import AuthService from "../../services/auth.service";
import ButtonsPanel from "../button-panel.component";
import {Navigate} from "react-router";
import CompanyService from "../../services/company.service";
import UserService from "../../services/user.service";
import UserForm from "../user-form.component";
import RoleService from "../../services/role.service";
import CompanyForm from "../company-form.component";
import BreadcrumbsCustom from "../breadcrumbs.component";

class CompanyPage extends React.Component {
    constructor(props) {
        super(props);
        this.edit = this.edit.bind(this);
        this.setUrl = this.setUrl.bind(this);
        this.navigateToUrl = this.navigateToUrl.bind(this);
        this.refresh = this.refresh.bind(this);
        this.cancel = this.cancel.bind(this);
        this.save = this.save.bind(this);
        this.handleHideModal = this.handleHideModal.bind(this);
        this.handleShowModalForDelete = this.handleShowModalForDelete.bind(this);
        let companyId;
        if (this.props.match && this.props.match.params) {
            companyId = this.props.match.params.companyId;
        }
        this.state = {
            data: "",
            formLabelClass: "form-label default-color fw-bold",
            inputClass: "",
            buttonClass: "",
            loading: false,
            disabled: this.props.disabled,
            c_companyId: companyId,
            editable: true,
            message: "",
            company: {
                lastName: "Новая компания",
                signerPosition: "",
                signerName: "",
                city: "",
            },
            logo: "",
            url: "",
        };
    }

    componentDidMount() {
        this.refresh();
    }

/*    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) {
            this.setState({
                ...this.props,
                c_companyId: this.props.match?.params?.companyId,
                url: undefined,
            })
        }
    }*/

    refresh() {
        if (this.state.c_companyId) {
            this.setState({
                loading: true,
            })
            CompanyService.getById(this.state.c_companyId).then(
                companyResponse => {
                    this.setState({
                        company: companyResponse.data,
                        loading: false,
                    })
                }
            )
        }
    }

    edit(id) {
        this.setState({
            disabled: false,
        });
    }

    cancel() {
        if (this.state.company.id) {
            this.refresh();
            this.setState({
                disabled: true,
                message: "",
            })
        } else {
            this.setUrl("/company")
        }
    }

    save(company, file) {
        this.setState({
            message: "",
            loading: true,
        })
        if (this.state.company.id) {
            CompanyService.update(this.state.company.id, company, file).then(
                companyResponse => {
                    this.setState({
                        company: companyResponse.data,
                        disabled: true,
                        loading: false
                    });
                }, error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.response.data.error ||
                        error.toString();
                    this.setState({
                        loading: false,
                        message: resMessage,
                    })
                }
            )
        } else {
            CompanyService.save(company, file).then(
                companyResponse => {
                    this.setState({
                        url: "/company/" + companyResponse.data.id,
                        loading: false,
                    })
                },
                error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.response.data.error ||
                        error.toString();
                    this.setState({
                        loading: false,
                        message: resMessage,
                    })
                })
        }
    }

    setUrl(url) {
        this.setState({
            url: url,
        })
    }

    navigateToUrl() {
        if (this.state.url) {
            return (<Navigate to={this.state.url}/>)
        }
    }

    handleHideModal() {
        this.setState({
            showModal: false,
            documentIdForDelete: "",
        })
    }

    handleShowModalForDelete() {
        this.setState({
            showModal: true,
        })
    }


    render() {
        return <div className="ps-5 pe-5">
            <div>
                {this.state.url ? <Navigate to={this.state.url}/> : null}
            </div>
            <div className="mt-2">
                <BreadcrumbsCustom companyList={true} company={this.state.company}/>
            </div>
            <h1>{this.state.company.name}</h1>
            <div className="row g-3 custom-height">
                <div className="col-md-6">
                    <ButtonsPanel
                        hidden={!this.state.c_companyId}
                        editable={this.state.editable}
                        editButtonClick={this.edit}
                    />
                    <CompanyForm disabled={this.state.disabled}
                              company={this.state.company}
                              editable={this.state.editable}
                              cancelButtonClick={this.cancel}
                              saveButtonClick={this.save}
                              loading={this.state.loading}
                              message={this.state.message}
                    />
                </div>
            </div>
        </div>
    }
}

export default CompanyPage;