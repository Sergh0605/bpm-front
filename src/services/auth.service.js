import axios from "axios";
import api from "./api";
import TokenService from "./token.service";
const API_URL = "http://localhost:8090/api/user";

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
            .post(API_URL + "/auth", {
                login,
                password
            })
            .then(response => {
                if (response.data.accessToken) {
                    TokenService.setTokens(response.data);
                }
                return response.data;
            });
    }

    logout() {
        return api
            .post("/user/logout", {}).then(() => {
                TokenService.removeTokens();
                window.location.assign("/login");
            })

    }

    getCurrentUser() {
        const tokens = TokenService.getTokens();
        if (tokens) {
            const accessToken = TokenService.getLocalAccessToken();
            const refreshToken = TokenService.getLocalRefreshToken();
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
}


export default new AuthService();