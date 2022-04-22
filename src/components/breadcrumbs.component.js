import React from 'react';
import {Breadcrumb} from "react-bootstrap";

class BreadcrumbsCustom extends React.Component {

    render() {
        return (
            <Breadcrumb>
                <Breadcrumb.Item href="/">Список документов</Breadcrumb.Item>
                {this.props.object.project ?
                    <Breadcrumb.Item href={"/project/" + this.props.object.project.id}>
                        {this.props.object.project.name}
                    </Breadcrumb.Item> :
                    <Breadcrumb.Item active href={"/project/" + this.props.object.id}>
                        {this.props.object.name}
                    </Breadcrumb.Item>}
                {this.props.object.project ?
                    <Breadcrumb.Item active href={"/project/" + this.props.object.project.id + "/document/" + this.props.object.id}>
                        {this.props.object.name}
                    </Breadcrumb.Item> :
                    null
                }
            </Breadcrumb>
        )
    }
}

export default BreadcrumbsCustom;