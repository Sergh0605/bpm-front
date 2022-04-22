import React from "react";
import ProjectService from "../services/project.service";
import DocumentService from "../services/document.service";

const PDFJS = require("pdfjs-dist/webpack");

const convertPdfToImages = async (data) => {
    const images = [];
    const pdf = await PDFJS.getDocument(data).promise;
    const canvas = document.createElement("canvas");
    for (let i = 0; i < pdf.numPages; i++) {
        const page = await pdf.getPage(i + 1);
        const viewport = page.getViewport({scale: 3});
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({canvasContext: context, viewport: viewport}).promise;
        images.push(canvas.toDataURL());
    }
    canvas.remove();
    return images;
}

function blobToBase64(blob) {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

class PdfPreview extends React.Component {
    constructor(props) {
        super(props);
        this.refresh = this.refresh.bind(this);
        this.state = {
            pdfDataUrl: "",
            pdfUrl: "",
            imgArray: [],
            loading: false,
        }
    }

    componentDidMount() {
        this.refresh()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.object !== prevProps.object) {
            this.refresh();
        }
    }

    refresh() {
        this.setState({
            loading: true,
        })
        if (this.props.object.project) {
            if (this.props.objectId) {
                DocumentService.getPdf(this.props.object.project.id ,this.props.objectId).then(
                    response => {
                        const blob = new Blob([response.data], {type: 'application/pdf'});
                        blobToBase64(blob).then(
                            result => {
                                convertPdfToImages(result).then(
                                    images => {
                                        this.setState({
                                            imgArray: images,
                                            loading: false,
                                        })
                                    }
                                )
                            })
                    }
                )
            }
        } else {
            ProjectService.getPdf(this.props.objectId).then(
                response => {
                    const blob = new Blob([response.data], {type: 'application/pdf'});
                    blobToBase64(blob).then(
                        result => {
                            convertPdfToImages(result).then(
                                images => {
                                    this.setState({
                                        imgArray: images,
                                        loading: false,
                                    })
                                }
                            )
                        })
                }
            )
        }
    }


    render() {
        if (this.state.imgArray) {
            return (
                <div className="mt-5 align-items-center" align="center">
                    <div
                        id="carouselExampleControls"
                        className="carousel carousel-dark slide"
                        data-bs-ride="carousel"
                        data-bs-interval="false">
                        {this.state.loading && (
                            <span className="spinner-border spinner-border-sm"></span>
                        )}
                        <div className="carousel-indicators" hidden={true}>
                            {this.state.imgArray.map((image, index) => {
                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        data-bs-target="#carouselExampleIndicators"
                                        data-bs-slide-to={index}
                                        className="active"
                                        aria-current="true"
                                        aria-label={`Slide ${index + 1}`}
                                    ></button>
                                );
                            })}
                        </div>
                        <div className="carousel-inner">
                            {this.state.imgArray.map((image, index) => (
                                <div key={index} className={index === 0 ? "carousel-item active" : "carousel-item"}>
                                    <img src={image} className="d-block custom-width border border-dark" alt="..."/>
                                </div>
                            ))}
                        </div>
                        <button className="carousel-control-prev" type="button"
                                data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button"
                                data-bs-target="#carouselExampleControls" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
            )
        } else {
            return (
                <div></div>
            )
        }
    }
}

export default PdfPreview;
