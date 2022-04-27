import React from 'react';
import {Breadcrumb} from "react-bootstrap";
import {FormattedMessage} from "react-intl";

class BreadcrumbsCustom extends React.Component {

    render() {
        return (
            <Breadcrumb>
                <Breadcrumb.Item href="/">
                    <FormattedMessage id="breadcrumbs_project-list"/>
                </Breadcrumb.Item>
                {this.props.project ?
                    <Breadcrumb.Item active={!this.props.document && !this.props.history} href={"/project/" + this.props.project.id}>
                        {this.props.project.name}
                    </Breadcrumb.Item> : null
                }
                {this.props.project && this.props.document ?
                    <Breadcrumb.Item active href={"/project/" + this.props.project.id + "/document/" + this.props.document.id}>
                        {this.props.document.name}
                    </Breadcrumb.Item> : null
                }
                {this.props.project && this.props.history ?
                    <Breadcrumb.Item active href={"/project/" + this.props.project.id + "/history"}>
                        <FormattedMessage id="breadcrumb_assemble-history"/>
                    </Breadcrumb.Item> : null
                }
                {this.props.companyList ?
                    <Breadcrumb.Item active={!this.props.company} href="/company">
                        <FormattedMessage id="breadcrumbs_company-list"/>
                    </Breadcrumb.Item> : null}
                {this.props.companyList && this.props.company ?
                    <Breadcrumb.Item active href={"/company/" + this.props.company.id}>
                        {this.props.company.name}
                    </Breadcrumb.Item> : null}
                {this.props.userList ?
                    <Breadcrumb.Item active={!this.props.user || !this.props.userListActive} href="/user">
                        <FormattedMessage id="breadcrumbs_user-list"/>
                    </Breadcrumb.Item> : null}
                {this.props.userList && this.props.user ?
                    <Breadcrumb.Item active href={"/user/" + this.props.user.id}>
                        {this.props.user.login}
                    </Breadcrumb.Item> : null}
                {this.props.activityLog ?
                    <Breadcrumb.Item active={true} href="/log">
                        <FormattedMessage id="breadcrumbs_activity-log"/>
                    </Breadcrumb.Item> : null}
            </Breadcrumb>
        )
    }
}

export default BreadcrumbsCustom;