import React from 'react';
import {FormattedMessage} from "react-intl";
import ActivityService from "../../services/activity.service";
import ReactPaginate from "react-paginate";
import BreadcrumbsCustom from "../breadcrumbs.component";


class ActivityList extends React.Component {
    constructor(props) {
        super(props);
        this.refresh = this.refresh.bind(this);
        this.getPage = this.getPage.bind(this);
        this.onClickHandle = this.onClickHandle.bind(this);
        this.state = {
            data: "",
            filter: "",
        };
    }

    componentDidMount() {
        this.refresh("");
    }

    refresh(filter) {
        ActivityService.getPage(0, filter).then(
            response => {
                this.setState({
                    data: response.data,
                });
            }
        );
    }

    getPage(event) {
        ActivityService.getPage(event.selected, this.state.filter).then(
            response => {
                this.setState({
                    data: response.data,
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

    getTable() {
        if (this.state.data && this.state.data.content) {
            let activities = this.state.data.content
            return <div className="ps-5 pe-5">
                <div className="mt-2">
                    <BreadcrumbsCustom activityLog={true}/>
                </div>
                <div className="row justify-content-between pt-3">
                    <div className="col-2">
                        <h4>
                            <FormattedMessage id="activity-list_head"/>
                        </h4>
                    </div>
                    <form className="col-8">
                        <div className="row" align="center">
                            <div className="col-10">
                                <FormattedMessage id="activity-list_search-placeholder">
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
                    </div>
                </div>
                <div className="table-responsive user-list">
                    <table className="table align-middle table-hover">
                        <thead>
                        <tr>
                            <th scope="col" className="activity-login-col">
                                <FormattedMessage id="user-list_col-login"/>
                            </th>
                            <th scope="col" className="activity-action-col">
                                <FormattedMessage id="activity-list_col-action"/>
                            </th>
                            <th scope="col" className="activity-message-col">
                                <FormattedMessage id="activity-list_col-message"/>
                            </th>
                            <th scope="col" className="activity-timestamp-col">
                                <FormattedMessage id="activity-list_col-timestamp"/>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {activities.length === 0 ?
                            <tr key={1}>
                                <th scope="row"></th>
                                <td><FormattedMessage id="lists_nothing-found"/></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr> : null
                        }
                        {activities.map((activity) => (
                            <tr key={activity.id}>
                                <th scope="row">{activity.login}</th>
                                <td>{activity.action}</td>
                                <td>{activity.message}</td>
                                <td>{activity.timestamp}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
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
                            initialPage={this.state.data.number}
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

export default ActivityList;