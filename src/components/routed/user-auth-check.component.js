import React, { Component } from "react";
import AuthService from "../../services/auth.service";
import {Navigate} from "react-router";
export default class UserAuthCheck extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comp: props.comp
        };
    }
    render() {
        if (!AuthService.getValidToken()) {
            return (
                <Navigate to="/login"/>
            )
        } else
        return (this.state.comp);
    }
}