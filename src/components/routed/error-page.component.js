import React from "react";
import PageNotFound from "../../images/404.jpg"
import Forbidden from "../../images/403.jpg"
import InternalServerError from "../../images/500.jpg"
import {Link} from "react-router-dom";

class ErrorPage extends React.Component {
    constructor(props) {
        super(props);
        let code;
        if (this.props.match && this.props.match.params) {
            code = this.props.match.params.errorCode;
        } else {
            code = this.props.code
        }
        this.state = {
            code: code,
        };
    }

    notFoundPage() {
        return(
            <div align="center">
                <img className="errorImageSize" src={PageNotFound}  />
                <p style={{textAlign:"center"}}>
                    <Link className="btn btn-primary mb-3 fw-bold" to="/">
                        <h1>Go to Home</h1>
                    </Link>
                </p>
            </div>
        )}

    forbiddenPage() {
        return(
            <div align="center">
                <img className="errorImageSize" src={Forbidden}  />
                <p style={{textAlign:"center"}}>
                    <Link className="btn btn-primary mb-3 fw-bold" to="/">
                        <h1>Go to Home</h1>
                    </Link>
                </p>
            </div>
        )}

    internalServerErrorPage() {
        return(
            <div align="center">
                <img className="errorImageSize" src={InternalServerError}  />
                <p style={{textAlign:"center"}}>
                    <Link className="btn btn-primary mb-3 fw-bold" to="/">
                        <h1>Go to Home</h1>
                    </Link>
                </p>
            </div>
        )}

    render() {
        if (this.state.code === "404") {
            return this.notFoundPage()
        }
        if (this.state.code === "403") {
            return this.forbiddenPage()
        }
        if (this.state.code === "500") {
            return this.internalServerErrorPage()
        }
    }
}

export default ErrorPage;