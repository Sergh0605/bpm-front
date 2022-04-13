import React from 'react';
import {FormattedMessage} from "react-intl";
import ProjectService from "../../services/project.service";
import AssembleButton from "../assemble-button.component";

class ProjectList extends React.Component {
    // eslint-disable-next-line no-useless-constructor
    constructor(props) {
        super(props);
        this.refresh = this.refresh.bind(this);
        this.state = {
            data: ""
        };
    }

    componentDidMount() {
        this.refresh();
    }

    refresh() {
        ProjectService.getAll().then(
            response => {
                this.setState({
                    data: response.data
                });
            },
            error => {
                // add navigate to error page
            }
        );
    }

    getTable() {
        if (this.state.data && this.state.data.content) {
            let projects = this.state.data.content
            return <div className="ps-5 pe-5">
                <table className="table table-hover">
                    <thead>
                    <tr>
                        <th scope="col">
                            <FormattedMessage id="project-list_col-code"/>
                        </th>
                        <th scope="col">
                            <FormattedMessage id="project-list_col-name"/>
                        </th>
                        <th scope="col">
                            <FormattedMessage id="project-list_col-stage"/>
                        </th>
                        <th scope="col">
                            <FormattedMessage id="project-list_col-company"/>
                        </th>
                        <th scope="col">
                            <FormattedMessage id="project-list_col-editTime"/>
                        </th>
                        <th scope="col"></th>
                        <th scope="col"></th>
                        <th scope="col"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {projects.map((project) => (
                        <tr key={project.id}>
                            <th scope="row">{project.code}</th>
                            <td>{project.name}</td>
                            <td>{project.stage.name}</td>
                            <td>{project.company.name}</td>
                            <td>{project.editTime}</td>
                            <td><AssembleButton projectId={project.id} assembled={!project.reassemblyRequired} refresh={this.refresh}/></td>
                            <td></td>
                            <td></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        }
    }

    render() {
        return (this.getTable())
    }
}

class TableRow extends React.Component {
    render() {
        return (
            <h1>
                assemble
            </h1>
        )
    }
}

export default ProjectList;