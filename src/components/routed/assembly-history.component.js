import pdfIcon from '../../images/pdf.png';
import React from 'react';
import {FormattedMessage} from "react-intl";
import ProjectService from "../../services/project.service";
import IconButton from "../icon-button.component";
import ReactPaginate from "react-paginate";
import projectService from "../../services/project.service";
import BreadcrumbsCustom from "../breadcrumbs.component";


class AssemblyHistoryList extends React.Component {
    constructor(props) {
        super(props);
        this.refresh = this.refresh.bind(this);
        this.getPage = this.getPage.bind(this);
        let projectId;
        if (this.props.match && this.props.match.params) {
            projectId = this.props.match.params.projectId;
        }
        this.state = {
            data: "",
            projectId: projectId,
        };
    }

    componentDidMount() {
        this.refresh();
    }

    refresh() {
        projectService.getById(this.state.projectId)
            .then(
                prjResponse => {
                    ProjectService.getHistoryPage(this.state.projectId, 0).then(
                        historyResponse => {
                            this.setState({
                                project: {
                                    ...prjResponse.data,
                                },
                                data: historyResponse.data,
                            });
                        }
                    );
                }
            )

    }

    getPage(event) {
        ProjectService.getHistoryPage(this.state.projectId, event.selected).then(
            response => {
                this.setState({
                    data: response.data,
                });
            }
        );
    }

    getTable() {
        if (this.state.project && this.state.data && this.state.data.content) {
            let history = this.state.data.content
            return <div className="ps-5 pe-5">
                <div className="mt-2">
                    <BreadcrumbsCustom project={this.state.project} history={true}/>
                </div>
                <div className="row justify-content-between pt-3">
                    <div className="col-2">
                        <h4>
                            <FormattedMessage id="history-list_head"/>
                        </h4>
                    </div>
                    <form className="col-8">
                        <div className="row" align="center">
                            <div className="col-10">
                                <input type="search" className="form-control" id="bpm-search" placeholder=""/>
                            </div>
                            <div className="col-2" align="left">
                                <button type="submit" className="btn btn-primary mb-3 fw-bold">
                                    <FormattedMessage id="project-list_search-button"/>
                                </button>
                            </div>
                        </div>
                    </form>
                    <div className="col-1 me-2" align="right">
                    </div>
                </div>
                <div align="center">
                    <h2>{this.state.project.name}</h2>
                </div>
                <div className="table-responsive history-table">
                    <table className="table align-middle table-hover">
                        <thead>
                        <tr>
                            <th scope="col" className="col-11">
                                <FormattedMessage id="history-list_col-time"/>
                            </th>
                            <th scope="col" className="col-1"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {history.length === 0 ?
                            <tr key={1}>
                                <th scope="row"></th>
                                <td><FormattedMessage id="lists_nothing-found"/></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr> : null
                        }
                        {history.map((assembly) => (
                            <tr key={assembly.id}>
                                <th scope="row">{assembly.creationTime}</th>
                                <td><IconButton objectId={assembly.id}
                                                disabled={false}
                                                icon={pdfIcon}
                                                titleId={"download-button_title"}
                                                onClickHandler={(id) => {
                                                    ProjectService.getHistoryPdfForDownload(this.state.projectId, id)
                                                }}/>
                                </td>
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

export default AssemblyHistoryList;