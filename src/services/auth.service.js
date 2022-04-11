import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8090/api/user/";

const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

class AuthService {
    login(login, password) {
        return axios
            .post(API_URL + "auth", {
                login,
                password
            })
            .then(response => {
                if (response.data.accessToken) {
                    localStorage.setItem("tokens", JSON.stringify(response.data));
                }
                return response.data;
            });
    }

    logout() {
        const token = this.getValidToken();
        localStorage.removeItem("tokens")
        return axios
            .post(API_URL + "logout", {}, {headers: {Authorization: 'Bearer ' + token}})
            .then(() => {
            });
    }

    refresh() {
        const token = JSON.parse(localStorage.getItem('tokens')).refreshToken;
        return axios
            .post(API_URL + "refresh_token_auth", {
                token,
            })
            .then(response => {
                if (response.data.accessToken) {
                    localStorage.setItem("tokens", JSON.stringify(response.data));
                }
                return response.data;
            });
    }

    getCurrentUser() {
        const tokens = localStorage.getItem('tokens');
        if (tokens) {
            const accessToken = JSON.parse(tokens).accessToken;
            const refreshToken = JSON.parse(tokens).refreshToken;
            const decodedAccessJwt = parseJwt(accessToken);
            const decodedRefreshJwt = parseJwt(refreshToken);
            return {
                login: decodedAccessJwt.sub,
                roles: decodedAccessJwt.UserRoles,
                accessExpDate: decodedAccessJwt.exp,
                refreshExpDate: decodedRefreshJwt.exp,
                accessToken: accessToken,
            }
        }
    }

    getValidToken() {
        const user = this.getCurrentUser();
        if (user) {
            if (user.accessExpDate && user.accessExpDate * 1000 > Date.now()) {
                return user.accessToken;
            } else {
                if (user.refreshExpDate && user.refreshExpDate * 1000 > Date.now()) {
                    this.refresh();
                    return this.getCurrentUser().accessToken;
                }
            }
        }
        return undefined
    }

}

export default new AuthService();