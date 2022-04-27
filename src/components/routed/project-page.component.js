import React from "react";
import ProjectService from "../../services/project.service";
import ProjectForm from "../project-form.component";
import AuthService from "../../services/auth.service";
import DocumentList from "../documents-list.component";
import ButtonsPanel from "../button-panel.component";
import {Navigate} from "react-router";
import PdfPreview from "../pdf-preview.component";
import DeleteModal from "../modal";
import CommentSidebar from "../comment-sideBar.component";
import BreadcrumbsCustom from "../breadcrumbs.component";
import DocumentService from "../../services/document.service";
import StageService from "../../services/stage.service";
import CompanyService from "../../services/company.service";

class ProjectPage extends React.Component {
    constructor(props) {
        super(props);
        this.assemble = this.assemble.bind(this);
        this.newDoc = this.newDoc.bind(this);
        this.download = this.download.bind(this);
        this.history = this.history.bind(this);
        this.edit = this.edit.bind(this);
        this.delete = this.delete.bind(this);
        this.setUrl = this.setUrl.bind(this);
        this.navigateToUrl = this.navigateToUrl.bind(this);
        this.refresh = this.refresh.bind(this);
        this.cancel = this.cancel.bind(this);
        this.save = this.save.bind(this);
        this.handleHideModal = this.handleHideModal.bind(this);
        this.handleShowModalForProjectDelete = this.handleShowModalForProjectDelete.bind(this);
        this.handleShowModalForDocumentDelete = this.handleShowModalForDocumentDelete.bind(this);
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
        if (this.props.match && this.props.match.params) {
            projectId = this.props.match.params.projectId;
        }
        this.state = {
            data: "",
            formLabelClass: "form-label default-color fw-bold",
            inputClass: "",
            buttonClass: "",
            loading: false,
            disabled: this.props.disabled,
            c_projectId: projectId,
            editable: editable,
            message: "",
            project: {
                name: "Создание нового проекта",
                code: "",
                releaseDate: "",
                objectName: "",
                objectAddress: "",
                volumeNumber: 1,
                volumeName: "",
                company: {id: -1},
                stage: {id: -1},
                designer: {id: -1},
                supervisor: {id: -1},
                controller: {id: -1},
                chief: {id: -1},
                reassemblyRequired: false,
                version: 1,
            }
        };
    }

    componentDidMount() {
        this.refresh();
    }

    refresh() {
        this.setState({
            loading: true,
        })
        StageService.getAll().then(
            stjResponse => {
                CompanyService.getAll("").then(
                    companyResponse => {
                        if (this.state.c_projectId) {
                            ProjectService.getById(this.state.c_projectId).then(
                                prjResponse => {
                                    CompanyService.getUsersById(prjResponse.data.company.id).then(
                                        compUsrResponse => {
                                            ProjectService.getPdf(this.state.c_projectId).then(
                                                pdfResponse => {
                                                    ProjectService.getDocListById(this.state.c_projectId).then(
                                                        docListResponse => {
                                                            this.setState({
                                                                docList: docListResponse.data,
                                                                users: compUsrResponse.data,
                                                                project: prjResponse.data,
                                                                companies: companyResponse.data,
                                                                stages: stjResponse.data,
                                                                loading: false,
                                                                pdfFile: pdfResponse.data,
                                                            });
                                                        });
                                                })
                                        })
                                })
                        } else {
                            this.setState({
                                    companies: companyResponse.data,
                                    stages: stjResponse.data,
                                    loading: false,
                                }
                            )
                        }
                    }
                )
            }
        )
    }

    assemble(id) {
        ProjectService.assemble(this.state.project.id).then(this.refresh);
    }

    newDoc(id) {
        this.setUrl("/project/" + this.state.project.id + "/document/new");
    }

    download(id) {
        ProjectService.getPdfForDownload(this.state.project.id)
    };

    history(id) {
        this.setUrl("/project/" + this.state.project.id + "/history");
    }

    edit(id) {
        this.setState({
            disabled: false,
        });
    }

    delete(id) {
        if (this.state.documentIdForDelete) {
            DocumentService.delete(this.state.c_projectId, this.state.documentIdForDelete).then(() => {
                this.setState({
                    documentIdForDelete: "",
                    showModal: false,
                });
                this.refresh();
            })
        } else {
            ProjectService.delete(this.state.project.id).then(() => {
                this.setUrl("/")
            });
        }
    }

    cancel() {
        if (this.state.c_projectId) {
            this.refresh();
            this.setState({
                disabled: true,
                message: "",
            })
        } else {
            this.setUrl("/")
        }
    }

    save(project) {
        this.setState({
            message: "",
            loading: true,
        })
        if (this.state.project.id) {
            ProjectService.update(this.state.project.id, project).then(
                () => this.refresh()
                ,
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
            ProjectService.save(project).then(
                response => {
                    this.setState({
                        url: "/project/" + response.data.id,
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
        this.setState({
            showModal: false,
            documentIdForDelete: "",
        })
    }

    handleShowModalForProjectDelete(projectId) {
        this.setState({
            showModal: true,
        })
    }

    handleShowModalForDocumentDelete(documentId) {
        this.setState({
            showModal: true,
            documentIdForDelete: documentId,
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
                                 objectId={this.state.documentForDelete}/> : null}
            </div>
            <div>
                {this.state.showComments && this.state.c_projectId ?
                    <CommentSidebar show={this.state.showComments}
                                    onHide={this.handleHideComments}
                                    projectId={this.state.c_projectId}/> : null}
            </div>
            <div className="mt-2">
                <BreadcrumbsCustom project={this.state.project}/>
            </div>
            <h1>{this.state.project.name}</h1>
            <div className="row g-3 custom-height">
                <div className="col-md-6">
                    <ButtonsPanel
                        hidden={!this.state.c_projectId}
                        editable={this.state.editable}
                        assembleButtonClick={this.assemble}
                        reassemblyRequired={this.state.project.reassemblyRequired}
                        newDocButtonClick={this.newDoc}
                        downloadButtonClick={this.download}
                        historyButtonClick={this.history}
                        editButtonClick={this.edit}
                        commentButtonClick={this.handleShowComments}
                        deleteButtonClick={this.handleShowModalForProjectDelete}
                    />
                    <ProjectForm disabled={this.state.disabled}
                                 project={this.state.project}
                                 editable={this.state.editable}
                                 cancelButtonClick={this.cancel}
                                 saveButtonClick={this.save}
                                 loading={this.state.loading}
                                 message={this.state.message}
                                 companies={this.state.companies}
                                 users={this.state.users}
                                 stages={this.state.stages}
                    />
                </div>
                <div className="col-md-6">
                    {this.state.c_projectId ?
                        <PdfPreview pdfFile={this.state.pdfFile}/> : null}
                </div>
            </div>
            <DocumentList projectId={this.state.c_projectId}
                          documents={this.state.docList}
                          editable={this.state.editable}
                          refreshProject={this.refresh}
                          project={this.state.project}
                          onDelete={this.handleShowModalForDocumentDelete}
            />
        </div>
    }
}

export default ProjectPage;