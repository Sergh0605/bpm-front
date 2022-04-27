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
import CompanyService from "../../services/company.service";
import DocumentTypeService from "../../services/document-type.service";

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
            url:"",
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
                documentType: {id: -1},
                code: "",
                reassemblyRequired: false,
                version: 1,
            }
        };
    }

    componentDidMount() {
        this.setState({
            loading: true
        })
        ProjectService.getById(this.state.c_projectId).then(
            prjResponse => {
                CompanyService.getUsersById(prjResponse.data.company.id).then(
                    usrResponse => {
                        DocumentTypeService.getAll().then(
                            typeResponse => {
                                if (this.state.c_documentId) {
                                    DocumentService.getById(this.state.c_projectId, this.state.c_documentId).then(
                                        docResponse => {
                                            DocumentService.getPdf(this.state.c_projectId, this.state.c_documentId).then(
                                                pdfResponse => {
                                                    this.setState({
                                                        users: usrResponse.data,
                                                        types: typeResponse.data,
                                                        project: prjResponse.data,
                                                        document: docResponse.data,
                                                        pdfFile: pdfResponse.data,
                                                        loading: false,
                                                    });
                                                }
                                            )
                                        }
                                    );
                                } else {
                                    this.setState({
                                        users: usrResponse.data,
                                        types: typeResponse.data,
                                        project: prjResponse.data,
                                        document: {
                                            name: "Создание нового документа",
                                            project: prjResponse.data,
                                            documentType: {id: -1},
                                            code: "",
                                            reassemblyRequired: false,
                                            version: 1,
                                        },
                                        loading: false,
                                    })
                                }
                            })
                    })
            })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) {
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
            this.setState({
                data: "",
                formLabelClass: "form-label default-color fw-bold",
                url:"",
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
                    documentType: {id: -1},
                    code: "",
                    reassemblyRequired: false,
                    version: 1,
                }
            });
            if (this.state.c_projectId && this.state.c_documentId) {
                this.refresh();
            }
        }
    }

    refresh() {
        this.setState({
            loading: true
        })
        DocumentService.getById(this.state.c_projectId, this.state.c_documentId).then(
            docResponse => {
                DocumentService.getPdf(this.state.c_projectId, this.state.c_documentId).then(
                    pdfResponse => {
                        this.setState({
                            document: docResponse.data,
                            pdfFile: pdfResponse.data,
                            loading: false,
                        });
                    }
                )
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

    save(document, file) {
        this.setState({
            message: "",
            loading: true,
        })
        if (this.state.c_documentId) {
            DocumentService.update(this.state.c_projectId, this.state.c_documentId, document, file).then(
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
            DocumentService.save(this.state.c_projectId, document, file).then(
                response => {
                    //window.location.assign("/project/" + response.data.project.id + "/document/" + response.data.id);
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
        let editable = false;
        if (this.state.editable && !this.state.document.documentType.unmodified) {
            editable = true;
        }
        return <div className="ps-5 pe-5">
            <div>
                {this.state.url ? <Navigate to={this.state.url}/> : null}
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
                <BreadcrumbsCustom document={this.state.document} project={this.state.document.project}/>
            </div>
            <h1>{this.state.document.name}</h1>
            <div className="row g-3 custom-height">
                <div className="col-md-6">
                    <ButtonsPanel
                        hidden={!this.state.c_documentId}
                        editable={editable}
                        assembleButtonClick={this.assemble}
                        reassemblyRequired={this.state.document.reassemblyRequired}
                        downloadButtonClick={this.download}
                        editButtonClick={this.edit}
                        commentButtonClick={this.handleShowComments}
                        deleteButtonClick={this.handleShowModal}
                    />
                    <DocumentForm disabled={this.state.disabled}
                                  document={this.state.document}
                                  project={this.state.project}
                                  editable={this.state.editable}
                                  users={this.state.users}
                                  types={this.state.types}
                                  cancelButtonClick={this.cancel}
                                  saveButtonClick={this.save}
                                  loading={this.state.loading}
                                  message={this.state.message}
                    />
                </div>
                <div className="col-md-6">
                    {this.state.c_documentId ?
                        <PdfPreview pdfFile={this.state.pdfFile}/> : null}
                </div>
            </div>
        </div>
    }
}

export default DocumentPage;