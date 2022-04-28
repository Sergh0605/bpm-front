import React from "react";
import AuthService from "../../services/auth.service";
import ButtonsPanel from "../button-panel.component";
import {Navigate} from "react-router";
import CompanyService from "../../services/company.service";
import UserService from "../../services/user.service";
import UserForm from "../user-form.component";
import RoleService from "../../services/role.service";
import BreadcrumbsCustom from "../breadcrumbs.component";

class UserPage extends React.Component {
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
        let user = AuthService.getCurrentUser();
        let userId;
        if (this.props.match && this.props.match.params) {
            userId = this.props.match.params.userId;
        }
        let url = "";
        if (user) {
            if (!user.roles.includes("ADMIN") && user.id.toString() !== userId) {
                url = "/error/403";
            }
        }
        this.state = {
            data: "",
            formLabelClass: "form-label default-color fw-bold",
            inputClass: "",
            buttonClass: "",
            loading: false,
            disabled: this.props.disabled,
            currentUser: user,
            c_userId: userId,
            editable: true,
            message: "",
            user: {
                lastName: "Новый пользователь",
                login: "",
                password: "",
                company: {id: -1},
                deleted: false,
                email: "",
                roles: [{id: -1}],
            },
            signature: "",
            url: url,
        };
    }

    componentDidMount() {
        this.refresh();
    }

    refresh() {
        this.setState({
            loading: true,
        })
        CompanyService.getAll("").then(
            companyResponse => {
                RoleService.getAll().then(
                    roleResponse => {
                        if (this.state.c_userId) {
                            UserService.getUser(this.state.c_userId).then(
                                userResponse => {
                                    this.setState({
                                        roles: roleResponse.data,
                                        user: userResponse.data,
                                        currentRoles: userResponse.data.roles,
                                        companies: companyResponse.data,
                                        loading: false,
                                    })
                                })
                        } else {
                            this.setState({
                                    roles: roleResponse.data,
                                    companies: companyResponse.data,
                                    loading: false,
                                }
                            )
                        }
                    }
                )
            }
        )
    }

    edit() {
        this.setState({
            disabled: false,
        });
    }

    cancel() {
        if (this.state.user.id) {
            this.refresh();
            this.setState({
                disabled: true,
                message: "",
            })
        } else {
            this.setUrl("/user")
        }
    }

    save(user, file) {
        this.setState({
            message: "",
            loading: true,
        })
        if (this.state.user.id) {
            UserService.update(this.state.user.id, user, file).then(
                userResponse => {
                    if (JSON.stringify(this.state.user.roles) !== JSON.stringify(userResponse.data.roles)) {
                        UserService.updateRoles(this.state.user.id, this.state.user.roles).then(
                            () => {
                                if (this.state.currentUser.id.toString() === this.state.c_userId) {
                                    AuthService.logout();
                                } else {
                                    UserService.getUser(userResponse.data.id).then(
                                        getUserResponse => {
                                            this.setState({
                                                user: getUserResponse.data,
                                                disabled: true,
                                                loading: false
                                            });
                                        }
                                    )
                                }
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
                        this.setState({
                            user: userResponse.data,
                            disabled: true,
                            loading: false
                        });
                        if (this.state.currentUser.id.toString() === this.state.c_userId &&
                            (this.state.currentUser.login !== userResponse.data.login)
                        ) {
                            AuthService.logout();
                        }
                    }
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
                }
            )
        } else {
            UserService.save(user, file).then(
                userResponse => {
                    this.setState({
                        url: "/user/" + userResponse.data.id,
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
        console.log(this.state.url);
        return <div className="ps-5 pe-5">
            <div>
                {this.state.url ? <Navigate to={this.state.url}/> : null}
            </div>
            <div className="mt-2">
                <BreadcrumbsCustom userList={true} userListActive={this.state.currentUser.roles.includes("ADMIN")} user={this.state.user}/>
            </div>
            <div>
                <div className="row g-3 custom-height">
                    <h1>{this.state.user.lastName}</h1>
                    <div className="col-md-6">
                        <ButtonsPanel
                            hidden={!this.state.c_userId}
                            editable={this.state.editable}
                            editButtonClick={this.edit}
                        />
                        <UserForm disabled={this.state.disabled}
                                  user={this.state.user}
                                  editable={this.state.editable}
                                  cancelButtonClick={this.cancel}
                                  saveButtonClick={this.save}
                                  loading={this.state.loading}
                                  message={this.state.message}
                                  companies={this.state.companies}
                                  roles={this.state.roles}
                                  currentUser={this.state.currentUser}
                        />
                    </div>
                </div>
            </div>
        </div>
    }
}

export default UserPage;