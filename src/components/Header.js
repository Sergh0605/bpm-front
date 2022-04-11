import logo from '../images/logo.png';
import React from 'react';
import AuthService from "../services/auth.service";
import {Link} from "react-router-dom";

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {login: props.userData.currentUserLogin, roles: props.userData.currentUserRoles};
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
            return('');
        } else {
            return ('invisible')
        }
    }

    handleLogout(){
        AuthService.logout();
        window.location.assign("/");
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
                    <div className={"collapse navbar-collapse position-fixed end-0 me-4 " + this.getVisible()} id="navbarNavDropdown">
                        <ul className="navbar-nav">
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle fw-bold" href="src/components/Header#" id="navbarDropdownMenuLink"
                                   role="button"
                                   data-bs-toggle="dropdown" aria-expanded="false">
                                    {this.state.login}
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
                                    <li><a className="dropdown-item" href="src/components/Header#">Профиль</a></li>
                                    <li><a className={"dropdown-item " + this.getDropdownClassName()} href="src/components/Header#">Сотрудники</a></li>
                                    <li><a className={"dropdown-item " + this.getDropdownClassName()} href="src/components/Header#">Компании</a></li>
                                    <li><a className={"dropdown-item " + this.getDropdownClassName()} href="">Журнал</a></li>
                                    <li>
                                        <hr className="dropdown-divider"/>
                                    </li>
                                    <li><a className="dropdown-item fw-bold default-color" onClick={this.handleLogout} href="">Выход</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}

export default Header;