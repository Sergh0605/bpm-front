import React from "react";
import ProjectService from "../services/project.service";


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
    this.state = {
        pdfDataUrl: "",
        pdfUrl: "",
    }
}

    componentDidMount() {
        ProjectService.getPdf(this.props.projectId).then(
            response => {

                console.log(response.data)
                const blob = new Blob([response.data], {type: 'application/pdf'});
                const pdfUrl = window.URL.createObjectURL(blob);
                console.log(pdfUrl);
                blobToBase64(blob).then(
                    result => {
                        this.setState({
                            pdfDataUrl: result,
                            pdfUrl: pdfUrl,
                        })
                    }
                )
            }
        )
    }

    render() {
        return (
            <div className="mt-5 align-items-center" align="center">

            </div>
        )
    }
}

export default PdfPreview;
