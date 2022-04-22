import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/src/dropdown.js';
import 'bootstrap/js/src/carousel.js';
import 'bootstrap/js/src/modal.js';
import Header from "./components/Header";
import React from "react";
import {Route} from "react-router-dom";
import LoginComponent from "./components/routed/login.component";
import ProjectList from "./components/routed/ProjectList";
import {Routes, useParams} from "react-router";
import AuthService from "./services/auth.service";
import UserAuthCheck from "./components/routed/user-auth-check.component";
import ProjectPage from "./components/routed/project-page.component";
import DocumentPage from "./components/routed/document-page.component";

class App extends React.Component {
    constructor(props) {
        super(props);
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

    isEditable() {
        return this.state.currentUserRoles.includes("EDITOR");
    }

    render() {
        const ProjectWrapper = (props) => {
            const params = useParams();
            return <ProjectPage disabled={true} {...{...props, match: {params}} } />
        }

        const DocumentWrapper = (props) => {
            const params = useParams();
            return <DocumentPage disabled={props.disabledForm} {...{...props, match: {params}} } />
        }

        return (
            <div>
                <Header userData={this.state}/>
                <Routes>
                    <Route path="/login"
                           element={<LoginComponent/>}/>
                    <Route path="/"
                           element={<UserAuthCheck roles={["EDITOR", "ADMIN", "VIEWER"]} comp={<ProjectList editable={this.isEditable()}/>}/>}/>
                    <Route path="/project/new"
                           element={<UserAuthCheck roles={["EDITOR"]} comp={<ProjectPage disabled={false}/>}/>}/>
                    <Route path="/project/:projectId"
                           element={<UserAuthCheck roles={["EDITOR", "ADMIN", "VIEWER"]} comp={<ProjectWrapper/>}/>}/>
                    <Route path="/project/:projectId/document/new"
                           element={<UserAuthCheck roles={["EDITOR", "ADMIN", "VIEWER"]} comp={<DocumentWrapper disabledForm={false}/>}/>}/>
                    <Route path="/project/:projectId/document/:documentId"
                           element={<UserAuthCheck roles={["EDITOR", "ADMIN", "VIEWER"]} comp={<DocumentWrapper disabledForm={true}/>}/>}/>
                </Routes>
            </div>
        );
    }
}

export default App;