import React, {Component} from "react";
import AuthService from "../../services/auth.service";
import {Navigate} from "react-router";

export default class UserAuthCheck extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor(props) {
        super(props);
    }

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
                //TODO move to not enough rights page
            }
        }

    }
}