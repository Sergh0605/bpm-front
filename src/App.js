import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/src/dropdown.js';
import 'bootstrap/js/src/carousel.js';
import 'bootstrap/js/src/modal.js';
import Header from "./components/Header";
import React from "react";
import {Redirect, Route} from "react-router-dom";
import LoginComponent from "./components/routed/login.component";
import ProjectList from "./components/routed/ProjectList";
import {Routes, useParams} from "react-router";
import AuthService from "./services/auth.service";
import UserAuthCheck from "./components/routed/user-auth-check.component";
import ProjectPage from "./components/routed/project-page.component";
import DocumentPage from "./components/routed/document-page.component";
import UserPage from "./components/routed/user-page.component";
import UserList from "./components/routed/user-list.component";
import CompanyList from "./components/routed/company-list.component";
import CompanyPage from "./components/routed/company-page.component";
import ActivityList from "./components/routed/activity-list.component";
import AssemblyHistoryList from "./components/routed/assembly-history.component";
import ErrorPage from "./components/routed/error-page.component";

class App extends React.Component {
    constructor(props) {
        super(props);
        const user = AuthService.getCurrentUser();
        if (user) {
            this.state = {
                currentUserLogin: user.login,
                currentUserRoles: user.roles,
                currentUserId: user.id,
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

        const UserWrapper = (props) => {
            const params = useParams();
            return <UserPage disabled={props.disabledForm} {...{...props, match: {params}} } />
        }

        const CompanyWrapper = (props) => {
            const params = useParams();
            return <CompanyPage disabled={props.disabledForm} {...{...props, match: {params}} } />
        }

        const HistoryWrapper = (props) => {
            const params = useParams();
            return <AssemblyHistoryList {...{...props, match: {params}} } />
        }

        const ErrorWrapper = (props) => {
            const params = useParams();
            return <ErrorPage {...{...props, match: {params}} } />
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
                    <Route path="/project/:projectId/history"
                           element={<UserAuthCheck roles={["EDITOR", "ADMIN", "VIEWER"]} comp={<HistoryWrapper/>}/>}/>
                    <Route path="/project/:projectId/document/new"
                           element={<UserAuthCheck roles={["EDITOR", "ADMIN", "VIEWER"]} comp={<DocumentWrapper disabledForm={false}/>}/>}/>
                    <Route path="/project/:projectId/document/:documentId"
                           element={<UserAuthCheck roles={["EDITOR", "ADMIN", "VIEWER"]} comp={<DocumentWrapper disabledForm={true}/>}/>}/>
                    <Route path="/user/:userId"
                           element={<UserAuthCheck roles={["EDITOR", "ADMIN", "VIEWER"]} comp={<UserWrapper disabledForm={true}/>}/>}/>
                    <Route path="/user/new"
                           element={<UserAuthCheck roles={["ADMIN"]} comp={<UserPage disabled={false}/>}/>}/>
                    <Route path="/user"
                           element={<UserAuthCheck roles={["ADMIN"]} comp={<UserList />}/>}/>
                    <Route path="/company"
                           element={<UserAuthCheck roles={["ADMIN"]} comp={<CompanyList />}/>}/>
                    <Route path="/company/:companyId"
                           element={<UserAuthCheck roles={["ADMIN"]} comp={<CompanyWrapper disabledForm={true}/>}/>}/>
                    <Route path="/company/new"
                           element={<UserAuthCheck roles={["ADMIN"]} comp={<CompanyPage disabled={false}/>}/>}/>
                    <Route path="/log"
                           element={<UserAuthCheck roles={["ADMIN"]} comp={<ActivityList/>}/>}/>
                    <Route path="/error/:errorCode"
                           element={<ErrorWrapper/>}/>}/>
                    <Route path="*" element={<ErrorPage code={"404"}/>}/>
                </Routes>
            </div>
        );
    }
}

export default App;