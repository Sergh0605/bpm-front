import React, {Component} from "react";
import AuthService from "../../services/auth.service";
import {Navigate} from "react-router";

export default class UserAuthCheck extends Component {

    render() {
        let user = AuthService.getCurrentUser();
        if (!user) {
            return (
                <Navigate to="/login"/>
            )
        } else {
            let checkPassed = false;
            this.props.roles.forEach(role => {
                if (user.roles.includes(role)) {
                    checkPassed = true;
                }
            });
            if (checkPassed) {
                return (this.props.comp);
            } else {
                return (
                    <Navigate to="/error/403"/>
                )
            }
        }

    }
}