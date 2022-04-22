import React from "react";
import ProjectService from "../../services/project.service";
import AuthService from "../../services/auth.service";
import ButtonsPanel from "../button-panel.component";
import {Navigate} from "react-router";
import PdfPreview from "../pdf-preview.component";
import DeleteModal from "../modal";
import CommentSidebar from "../comment-sideBar.component";
import BreadcrumbsCustom from "../breadcrumbs.component";
import DocumentService from "../../services/document.service";
import DocumentForm from "../document-form.component";

class DocumentPage extends React.Component {
    constructor(props) {
        super(props);
        this.assemble = this.assemble.bind(this);
        this.download = this.download.bind(this);
        this.edit = this.edit.bind(this);
        this.delete = this.delete.bind(this);
        this.setUrl = this.setUrl.bind(this);
        this.navigateToUrl = this.navigateToUrl.bind(this);
        this.refresh = this.refresh.bind(this);
        this.cancel = this.cancel.bind(this);
        this.save = this.save.bind(this);
        this.handleHideModal = this.handleHideModal.bind(this);
        this.handleShowModal = this.handleShowModal.bind(this);
        this.handleShowComments = this.handleShowComments.bind(this);
        this.handleHideComments = this.handleHideComments.bind(this);
        let user = AuthService.getCurrentUser();
        let editable = false;
        if (user) {
            if (user.roles.includes("EDITOR")) {
                editable = true;
            }
        }
        let projectId;
        let documentId;
        if (this.props.match && this.props.match.params) {
            projectId = this.props.match.params.projectId;
            documentId = this.props.match.params.documentId;
        }
        this.state = {
            data: "",
            formLabelClass: "form-label default-color fw-bold",
            inputClass: "",
            buttonClass: "",
            loading: false,
            disabled: this.props.disabled,
            c_projectId: projectId,
            c_documentId: documentId,
            editable: editable,
            message: "",
            document: {
                name: "Создание нового документа",
                project: {
                    id: projectId,
                    name: "",
                },
                documentType: {id: -1},
                code: "",
                reassemblyRequired: false,
                version: 1,
            }
        };
    }

    componentDidMount() {
        ProjectService.getById(this.state.c_projectId).then(
            response => {
                this.setState({
                    project: response.data,
                })
                if (this.state.c_documentId) {
                    this.refresh()
                }
            })
    }


    refresh() {
        DocumentService.getById(this.state.c_projectId, this.state.c_documentId).then(
            response => {
                this.setState({
                    document: response.data
                });
            }
        );
    }

    assemble() {
        DocumentService.assemble(this.state.c_projectId, this.state.c_documentId).then(this.refresh);
    }

    download() {
        DocumentService.getPdfForDownload(this.state.c_projectId, this.state.c_documentId)
    }
    ;

    edit() {
        this.setState({
            disabled: false,
        });
    }

    delete(id) {
        DocumentService.delete(this.state.c_projectId, this.state.c_documentId).then(() => {
            this.setUrl("/project/" + this.state.c_projectId)
        });
    }

    cancel() {
        if (this.state.c_documentId) {
            this.refresh();
            this.setState({
                disabled: true,
            })
        } else {
            this.setUrl("/project/" + this.state.c_projectId)
        }
    }

    save(document) {
        this.setState({
            message: "",
            loading: true,
        })
        if (this.state.c_documentId) {
            DocumentService.update(this.state.c_projectId, this.state.c_documentId, document).then(
                response => {
                    this.setState({
                        document: response.data,
                        disabled: true,
                        loading: false
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
                }
            )
        } else {
            DocumentService.save(this.state.c_projectId, document).then(
                response => {
                    this.setState({
                        url: "/project/" + response.data.project.id + "/document/" + response.data.id,
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
                }
            )
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
        this.setState({showModal: false})
    }

    handleShowModal(id) {
        this.setState({
            showModal: true,
        })
    }

    handleShowComments() {
        this.setState({showComments: true})
    }

    handleHideComments() {
        this.setState({showComments: false})
    }


    render() {
        const navigateToUrl = this.navigateToUrl();
        return <div className="ps-5 pe-5">
            <div>
                {navigateToUrl}
            </div>
            <div>
                {this.state.showModal ?
                    <DeleteModal show={this.state.showModal}
                                 onHide={this.handleHideModal}
                                 onAgree={this.delete}
                                 objectId={this.state.c_documentId}/> : null}
            </div>
            <div>
                {this.state.showComments && this.state.c_documentId ?
                    <CommentSidebar show={this.state.showComments}
                                    onHide={this.handleHideComments}
                                    projectId={this.state.c_projectId}
                                    documentId={this.state.c_documentId}/> : null}
            </div>
            <div className="mt-2">
                <BreadcrumbsCustom object={this.state.document}/>
            </div>
            <h1>{this.state.document.name}</h1>
            <div className="row g-3 custom-height">
                <div className="col-md-6">
                    <ButtonsPanel
                        hidden={!this.state.c_documentId}
                        editable={this.state.editable}
                        assembleButtonClick={this.assemble}
                        reassemblyRequired={this.state.document.reassemblyRequired}
                        downloadButtonClick={this.download}
                        editButtonClick={this.edit}
                        commentButtonClick={this.handleShowComments}
                        deleteButtonClick={this.handleShowModal}
                    />
                    <DocumentForm disabled={this.state.disabled}
                                  project={this.state.project}
                                  document={this.state.document}
                                  editable={this.state.editable}
                                  cancelButtonClick={this.cancel}
                                  saveButtonClick={this.save}
                                  loading={this.state.loading}
                                  message={this.state.message}
                    />
                </div>
                <div className="col-md-6">
                    {this.state.c_documentId ?
                        <PdfPreview objectId={this.state.c_documentId}
                                    object={this.state.document}/> : null}
                </div>
            </div>
        </div>
    }
}

export default DocumentPage;