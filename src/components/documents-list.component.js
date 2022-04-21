import React from "react";
import ProjectService from "../services/project.service";
import {Navigate} from "react-router";
import DocumentService from "../services/document.service";
import {FormattedMessage} from "react-intl";
import AssembleButton from "./assemble-button.component";
import IconButton from "./icon-button.component";
import pdfIcon from "../images/pdf.png";
import deleteIcon from "../images/delete.png";

class DocumentList extends React.Component {
    constructor(props) {
        super(props);
        this.refresh = this.refresh.bind(this);
        this.assemble = this.assemble.bind(this);
        this.delete = this.delete.bind(this);
        this.navigateToUrl = this.navigateToUrl.bind(this);
        this.setUrl = this.setUrl.bind(this);
        this.getTable = this.getTable.bind(this);
        this.state = {
            editable: this.props.editable,
            projectId: this.props.projectId,
        };
    }

    componentDidMount() {
        this.refresh();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.project !== prevProps.project) {
            this.refresh();
        }
    }

    refresh() {
        ProjectService.getDocListById(this.state.projectId).then(
            response => {
                this.setState({
                    data: response.data,
                });
            });
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

    assemble(documentId) {
        DocumentService.assemble(this.state.projectId, documentId).then(this.refresh());
    }

    delete(documentId) {
        DocumentService.delete(this.state.projectId, documentId).then(
            res => {
                this.refresh();
                this.props.refreshProject();
            }
        );
    }

    getTable() {
        const navigateToUrl = this.navigateToUrl();
        if (this.state.data) {
            let docs = this.state.data
            return <div>
                <div className="modal fade"
                     tabIndex="-1"
                     id="mainModal"
                     aria-labelledby="exampleModalLabel"
                     aria-hidden="true"
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Удалить проект</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"
                                        aria-label="Закрыть"></button>
                            </div>
                            <div className="modal-body">
                                <p>
                                    <FormattedMessage id="project-delete-modal_message"/>
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" >
                                    <FormattedMessage id="project-delete-modal_yes"/>
                                </button>
                                <button type="button" className="btn btn-primary" data-bs-dismiss="modal">
                                    <FormattedMessage id="project-delete-modal_no"/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <h1>
                    <FormattedMessage id="docs-list_head"/>
                </h1>
                <div className="table-responsive">
                    <table className="table align-middle table-hover">
                        <thead>
                        <tr>
                            <th scope="col" className="full-code-col">
                                <FormattedMessage id="docs-list_col-code"/>
                            </th>
                            <th scope="col" className="name-col">
                                <FormattedMessage id="docs-list_col-name"/>
                            </th>
                            <th scope="col" className="company-col">
                                <FormattedMessage id="docs-list_col-type"/>
                            </th>
                            <th scope="col" className="time-col">
                                <FormattedMessage id="project-list_col-editTime"/>
                            </th>
                            <th scope="col" className="button-col"></th>
                            <th scope="col" className="button-col"></th>
                            <th scope="col" className="button-col"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {docs.map((doc) => (
                            <tr key={doc.id}
                                onClick={() => this.setUrl("/project/" + this.state.projectId + "/document/" + doc.id)}>
                                <th scope="row">{doc.documentFullCode}</th>
                                <td>{doc.name}</td>
                                <td>{doc.documentType.name}</td>
                                <td>{doc.editTime}</td>
                                <td><AssembleButton disabled={!this.state.editable} objectId={doc.id}
                                                    assembled={!doc.reassemblyRequired}
                                                    onClickHandler={this.assemble}/>
                                </td>
                                <td><IconButton objectId={doc.id}
                                                disabled={false}
                                                icon={pdfIcon}
                                                onClickHandler={(id) => {
                                                    DocumentService.getPdfForDownload(this.state.projectId, id)
                                                }}
                                /></td>
                                <td>
                                    <div hidden={doc.documentType.unmodified}>
                                        <IconButton objectId={doc.id}
                                                    disabled={!this.state.editable}
                                                    icon={deleteIcon}
                                                    onClickHandler={this.delete}
                                        />
                                    </div>
                                </td>
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
        return (this.getTable());
    }
}

export default DocumentList;