import logo from '../images/logo.png';
import React from 'react';
import AuthService from "../services/auth.service";
import {Link} from "react-router-dom";
import {FormattedMessage} from "react-intl";

class HeaderComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: props.userData.currentUserLogin,
            roles: props.userData.currentUserRoles,
            id: props.userData.currentUserId,
        };
    }

    getDisabledDropdownClassName() {
        return ('disabled');
    }

    getDropdownClassName() {
        if (this.state.roles.includes("ADMIN")) {
            return ('');
        } else return (this.getDisabledDropdownClassName());
    }

    getVisible() {
        if (this.state.login) {
            return ('');
        } else {
            return ('invisible')
        }
    }

    handleLogout() {
        AuthService.logout();
    }

    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <Link className="navbar-brand ms-4 fw-bold default-color" to="/">
                        <img src={logo} alt="" width="40" height="40" className="d-inline-block"/>
                        Blueprints Manager
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className={"collapse navbar-collapse end-0 me-4 justify-content-end " + this.getVisible()}
                         id="navbarNavDropdown">
                        <ul className="navbar-nav">
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle fw-bold" href="src/components/Header#header.component.js"
                                   id="navbarDropdownMenuLink"
                                   role="button"
                                   data-bs-toggle="dropdown" aria-expanded="false">
                                    {this.state.login}
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end"
                                    aria-labelledby="navbarDropdownMenuLink">
                                    <Link className="dropdown-item" to={"/user/" + this.state.id}>
                                        <FormattedMessage id="header_profile"/>
                                    </Link>
                                    <Link className={"dropdown-item " + this.getDropdownClassName()}  to={"/user"}>
                                        <FormattedMessage id="header_users"/>
                                    </Link>
                                    <Link className={"dropdown-item " + this.getDropdownClassName()}  to={"/company"}>
                                        <FormattedMessage id="header_companies"/>
                                    </Link>
                                    <Link className={"dropdown-item " + this.getDropdownClassName()}  to={"/log"}>
                                        <FormattedMessage id="header_log"/>
                                    </Link>
                                    <li>
                                        <hr className="dropdown-divider"/>
                                    </li>
                                    <li><a className="dropdown-item fw-bold default-color" onClick={this.handleLogout}
                                           href="">
                                        <FormattedMessage id="header_logout"/>
                                    </a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}

export default HeaderComponent;