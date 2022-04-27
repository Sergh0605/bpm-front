import axios from "axios";
import api from "./api";
import TokenService from "./token.service";
import {API_URL} from "../properties/properties";

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
            .post(API_URL + "/user/auth", {
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
        api.post("/user/logout", {})
        TokenService.removeTokens();
        window.location.assign("/login");
    }

    getCurrentUser() {
        const tokens = TokenService.getTokens();
        if (tokens) {
            const accessToken = TokenService.getLocalAccessToken();
            const refreshToken = TokenService.getLocalRefreshToken();
            const decodedAccessJwt = parseJwt(accessToken);
            const decodedRefreshJwt = parseJwt(refreshToken);
            return {
                id: decodedAccessJwt.userId,
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