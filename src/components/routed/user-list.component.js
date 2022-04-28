import newUserIcon from '../../images/newUser.png'
import React from 'react';
import {FormattedMessage} from "react-intl";
import LinkButton from "../link-button.component";
import {Navigate} from "react-router";
import DeleteModal from "../modal";
import UserService from "../../services/user.service";
import ReactPaginate from "react-paginate";
import BreadcrumbsCustom from "../breadcrumbs.component";


class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.refresh = this.refresh.bind(this);
        this.navigateToUrl = this.navigateToUrl.bind(this);
        this.setUrl = this.setUrl.bind(this);
        this.handleShowModal = this.handleShowModal.bind(this);
        this.handleHideModal = this.handleHideModal.bind(this);
        this.getPage = this.getPage.bind(this);
        this.onClickHandle = this.onClickHandle.bind(this);
        this.state = {
            data: "",
            showModal: false,
            filter: "",
        };
    }

    componentDidMount() {
        this.setState({
            showModal: false,
        })
        this.refresh("");
    }

    refresh(filter) {
        UserService.getPage(0, filter).then(
            response => {
                this.setState({
                    data: response.data,
                    showModal: false
                });
            }
        );
    }

    getPage(event) {
        UserService.getPage(event.selected, this.state.filter).then(
            response => {
                this.setState({
                    data: response.data,
                    showModal: false
                });
            }
        );
    }

    onChangeHandle(field, e) {
        let fields = this.state;
        fields[field] = e.target.value;
        this.setState({fields})
        if (e.target.value === "") {
            this.refresh("");
        }
    }

    onClickHandle(e) {
        e.preventDefault();
        this.refresh(this.state.filter)
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


    deleteUser(userId) {
        UserService.delete(userId).then(() => this.refresh(this.state.filter));
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
            let users = this.state.data.content
            return <div className="ps-5 pe-5">
                {this.state.showModal ?
                    <DeleteModal show={this.state.showModal} onHide={this.handleHideModal} onAgree={this.deleteUser}
                                 objectId={this.state.projectForDelete}/> : null}
                <div className="mt-2">
                    <BreadcrumbsCustom userList={true}/>
                </div>
                <div className="row justify-content-between pt-3">
                    <div className="col-2">
                        <h4>
                            <FormattedMessage id="user-list_head"/>
                        </h4>
                    </div>
                    <form className="col-8">
                        <div className="row" align="center">
                            <div className="col-10">
                                <FormattedMessage id="user-list_search-placeholder">
                                    {
                                        (msg) =>
                                            <input type="search"
                                                   placeholder={msg}
                                                   className="form-control"
                                                   id="activity-search"
                                                   value={this.state.filter}
                                                   onChange={this.onChangeHandle.bind(this, "filter")}/>
                                    }
                                </FormattedMessage>
                            </div>
                            <div className="col-2" align="left">
                                <button className="btn btn-primary mb-3 fw-bold"
                                        onClick={this.onClickHandle}>
                                    <FormattedMessage id="project-list_search-button"/>
                                </button>
                            </div>
                        </div>
                    </form>
                    <div className="col-1 me-2" align="right">
                        <LinkButton
                            icon={newUserIcon}
                            titleId={"new-user-button_title"}
                            to={"/user/new"}/>
                    </div>
                </div>
                <div className="table-responsive user-list">
                    <table className="table align-middle table-hover">
                        <thead>
                        <tr>
                            <th scope="col" className="user-login-col">
                                <FormattedMessage id="user-list_col-login"/>
                            </th>
                            <th scope="col" className="user-name-col">
                                <FormattedMessage id="user-list_col-name"/>
                            </th>
                            <th scope="col" className="user-email-col">
                                <FormattedMessage id="user-list_col-email"/>
                            </th>
                            <th scope="col" className="user-company-col">
                                <FormattedMessage id="user-list_col-company"/>
                            </th>
                            <th scope="col" className="user-role-col">
                                <FormattedMessage id="user-list_col-role"/>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.length === 0 ?
                            <tr key={1}>
                                <th scope="row"></th>
                                <td><FormattedMessage id="lists_nothing-found"/></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr> : null
                        }
                        {users.map((user) => (
                            <tr key={user.id} onClick={() => this.setUrl("/user/" + user.id)}>
                                <th scope="row">{user.login}</th>
                                <td>{user.lastName}</td>
                                <td>{user.email}</td>
                                {user.company ? <td>{user.company.name}</td> : <td/>}
                                <td>{user.roles[0].name}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div>
                    {navigateToUrl}
                </div>
                <div className="d-flex justify-content-center">
                    {this.state.data.totalPages > 1 ?
                        <ReactPaginate
                            breakLabel="..."
                            nextLabel=">"
                            onPageChange={this.getPage}
                            pageRangeDisplayed={5}
                            pageCount={this.state.data.totalPages}
                            marginPagesDisplayed={2}
                            previousLabel="<"
                            renderOnZeroPageCount={null}
                            initialPage={0}
                            pageLinkClassName="page-link"
                            className="pagination"
                            pageClassName="page-item"
                            nextClassName="page-item"
                            previousClassName="page-item"
                            breakClassName="page-item"
                            activeClassName="active"
                            previousLinkClassName="page-link"
                            nextLinkClassName="page-link"
                            activeLinkClassName="page-link"
                            breakLinkClassName="page-link"
                        /> : null}
                </div>
            </div>
        }
    }

    render() {
        return (this.getTable())
    }
}

export default UserList;