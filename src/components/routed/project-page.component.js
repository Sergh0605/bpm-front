import React from "react";
import {FormattedMessage} from "react-intl";

class ProjectPage extends React.Component {
    constructor(props) {
        super(props);
        this.getPage = this.getPage.bind(this);
        this.state = {
            data: "",
            formLabelClass: "form-label default-color fw-bold",
            inputClass: "",
            buttonClass: ""
        };
    }

    componentDidMount() {
        this.setState({
            editable: this.props.editable,
            new: this.props.new,
        })
    }

    getPage() {
        return <div className="ps-5 pe-5">
            <div className="half">
                <fieldset disabled={this.state.editable}>
                    <form className="row g-3">
                        <div className="col-12">
                            <label htmlFor="projectName" className={this.state.formLabelClass}>
                                <FormattedMessage id="project-page_name"/> *
                            </label>
                            <input type="text" className="form-control" id="projectName"/>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="projectCode" className={this.state.formLabelClass}>
                                <FormattedMessage id="project-page_code"/> *
                            </label>
                            <input type="text" className="form-control" id="projectCode"/>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="releaseDate" className={this.state.formLabelClass}>
                                <FormattedMessage id="project-page_date"/> *
                            </label>
                            <input type="date" className="form-control" id="releaseDate"/>
                        </div>
                    </form>
                </fieldset>
            </div>
            <h1>ProjectPage</h1>
        </div>
    }

    render() {
        return (this.getPage())
    }

}

export default ProjectPage;