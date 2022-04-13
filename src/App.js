import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/src/dropdown.js';
import Header from "./components/Header";
import React from "react";
import {
    Route,
    Link,
    Navigate
} from "react-router-dom";
import LoginComponent from "./components/routed/login.component";
import ProjectList from "./components/routed/ProjectList";
import {Routes} from "react-router";
import AuthService from "./services/auth.service";
import UserAuthCheck from "./components/routed/user-auth-check.component";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this);
        const user = AuthService.getCurrentUser();
        if (user) {
            this.state = {
                currentUserLogin: user.login,
                currentUserRoles: user.roles
            };
        } else {
            this.state = {
                currentUserLogin: undefined,
                currentUserRoles: []
            };
        }
    }

    logOut() {
        AuthService.logout();
    }

    render() {
        return (
            <div>
                <Header userData={this.state}/>
                <Routes>
                    <Route path="/login" element={<LoginComponent/>}/>
                    <Route path="/" element={<UserAuthCheck comp={<ProjectList/>}/>}/>
                </Routes>
            </div>
        )
            ;
    }
}

export default App;