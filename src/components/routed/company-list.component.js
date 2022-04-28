import newCompanyIcon from '../../images/newCompany.png'
import React from 'react';
import {FormattedMessage} from "react-intl";
import LinkButton from "../link-button.component";
import {Navigate} from "react-router";
import DeleteModal from "../modal";
import CompanyService from "../../services/company.service";
import BreadcrumbsCustom from "../breadcrumbs.component";


class CompanyList extends React.Component {
    constructor(props) {
        super(props);
        this.refresh = this.refresh.bind(this);
        this.navigateToUrl = this.navigateToUrl.bind(this);
        this.setUrl = this.setUrl.bind(this);
        this.handleShowModal = this.handleShowModal.bind(this);
        this.handleHideModal = this.handleHideModal.bind(this);
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
        CompanyService.getAll(filter).then(
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
        if (this.state.data) {
            let companies = this.state.data
            return <div className="ps-5 pe-5">
                {this.state.showModal ? <DeleteModal show={this.state.showModal} onHide={this.handleHideModal} onAgree={this.deleteUser} objectId={this.state.projectForDelete}/> : null}
                <div className="mt-2">
                    <BreadcrumbsCustom companyList={true}/>
                </div>
                <div className="row justify-content-between pt-3">
                    <div className="col-2">
                        <h4>
                            <FormattedMessage id="company-list_head"/>
                        </h4>
                    </div>
                    <form className="col-8">
                        <div className="row" align="center">
                            <div className="col-10">
                                <FormattedMessage id="company-list_search-placeholder">
                                    {
                                        (msg) =>
                                            <input type="search"
                                                   placeholder={msg}
                                                   className="form-control"
                                                   id="company-search"
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
                            icon={newCompanyIcon}
                            titleId={"new-company-button_title"}
                            to={"/company/new"}/>
                    </div>
                </div>
                <div className="table-responsive company-table">
                    <table className="table align-middle table-hover">
                        <thead>
                        <tr>
                            <th scope="col" className="col-4">
                                <FormattedMessage id="company-list_col-name"/>
                            </th>
                            <th scope="col" className="col-6">
                                <FormattedMessage id="company-list_signer"/>
                            </th>
                            <th scope="col" className="col-2">
                                <FormattedMessage id="company-list_city"/>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {companies.length === 0 ?
                            <tr key={1}>
                                <th scope="row"></th>
                                <td><FormattedMessage id="lists_nothing-found"/></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr> : null
                        }
                        {companies.map((company) => (
                            <tr key={company.id} onClick={() => this.setUrl("/company/" + company.id)}>
                                <th scope="row">{company.name}</th>
                                <td>{company.signerPosition + " " + company.signerName}</td>
                                <td>{company.city}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div>
                    {navigateToUrl}
                </div>
            </div>
        }
    }

    render() {
        return (this.getTable())
    }
}

export default CompanyList;