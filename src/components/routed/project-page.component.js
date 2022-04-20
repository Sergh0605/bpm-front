import React from "react";
import ProjectService from "../../services/project.service";
import ProjectForm from "../project-form.component";
import AuthService from "../../services/auth.service";
import DocumentList from "../documents-list.component";
import ButtonsPanel from "../button-panel.component";
import {Navigate} from "react-router";
import PdfPreview from "../pdf-preview.component";

function blobToBase64(blob) {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

class ProjectPage extends React.Component {
    constructor(props) {
        super(props);
        this.getPdfPreview = this.getPdfPreview.bind(this);
        this.getPdfUrl = this.getPdfUrl.bind(this);
        this.assemble = this.assemble.bind(this);
        this.newDoc = this.newDoc.bind(this);
        this.download = this.download.bind(this);
        this.history = this.history.bind(this);
        this.edit = this.edit.bind(this);
        this.comment = this.comment.bind(this);
        this.delete = this.delete.bind(this);
        this.setUrl = this.setUrl.bind(this);
        this.navigateToUrl = this.navigateToUrl.bind(this);
        this.refresh = this.refresh.bind(this);
        this.cancel = this.cancel.bind(this);
        this.save = this.save.bind(this);
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
        if (this.state.c_projectId) {
            this.refresh();
        }
    }

    refresh() {
        ProjectService.getById(this.state.c_projectId).then(
            response => {
                this.setState({
                    project: response.data
                });
                this.getPdfUrl();
            }
        );
    }

    getPdfUrl() {
        ProjectService.getPdf(this.state.c_projectId).then(
            response => {
                console.log(response.data)
                let blob = new Blob([response.data], {type: 'application/pdf'});
                const url = URL.createObjectURL(blob);
                blobToBase64(blob).then(
                    result => {
                        this.setState({
                            pdfDataUrl: result,
                        })
                    }
                )
                this.setState({
                    pdfUrl: url,
                })
            }
        )
    }

    getPdfPreview() {
        if (this.state.pdfDataUrl) {
            return <div className="mt-5 align-items-center" align="center">
                {/*                <PDFViewer
                    document={{
                        url: this.state.pdfDataUrl,
                    }}
                    scale={0.7}
                    navbarOnTop={true}
                    hideRotation={true}
                    hideZoom={true}
                    canvasCss={"pdf-viewer"}
                />*/}
            </div>
        }
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

    comment(id) {
        let a = 1 + 2 //TODO add comment component
    }

    delete(id) {
        ProjectService.delete(this.state.project.id).then(() => {
            this.setUrl("/")
        });
    }

    cancel() {
        if (this.state.c_projectId) {
            this.refresh();
            this.setState({
                disabled: true,
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
                response => {
                    this.setState({
                        project: response.data,
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


    render() {
        const navigateToUrl = this.navigateToUrl();
        return <div className="ps-5 pe-5">
            <div>
                {navigateToUrl}
            </div>
            <h1>{this.state.project.name}</h1>
            <div className="row g-3">
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
                        commentButtonClick={this.comment}
                        deleteButtonClick={this.delete}
                    />
                    <ProjectForm disabled={this.state.disabled}
                                 project={this.state.project}
                                 editable={this.state.editable}
                                 cancelButtonClick={this.cancel}
                                 saveButtonClick={this.save}
                                 loading={this.state.loading}
                                 message={this.state.message}
                    />
                </div>
                <div className="col-md-6">
                    <PdfPreview projectId={this.state.c_projectId}/>
                </div>
            </div>
            <DocumentList projectId={this.state.c_projectId}
                          editable={this.state.editable}
                          refreshProject={this.refresh}
            />
        </div>
    }
}

export default ProjectPage;