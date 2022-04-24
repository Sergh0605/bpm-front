import axios from "axios";
import TokenService from "./token.service";
import AuthService from "./auth.service";
import {API_URL} from "../properties/properties";

const instance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});
instance.interceptors.request.use(
    (config) => {
        const token = TokenService.getLocalAccessToken();
        if (token) {
            config.headers["Authorization"] = 'Bearer ' + token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
instance.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        const originalConfig = err.config;
        if (originalConfig.url !== "/user/auth" && err.response) {
            // Access Token was expired
            console.log("token expired " + originalConfig.url)
            if (err.response.status === 401 && !originalConfig._retry) {
                originalConfig._retry = true;
                try {
                    let currentUser = AuthService.getCurrentUser();
                    if (currentUser.refreshExpDate && currentUser.refreshExpDate * 1000 > Date.now()) {
                        return  axios.post(API_URL + "/user/refresh_token_auth", {
                            token: TokenService.getLocalRefreshToken(),
                        }).then(response => {
                            console.log("tokens refreshed " + originalConfig.url)
                            const tokens = response.data;
                            TokenService.setTokens(tokens);
                            originalConfig.headers["Authorization"] = 'Bearer ' + tokens.accessToken;
                            return instance(originalConfig);
                        }, error => {
                            console.log("tokens refresh error " + originalConfig.url)
                            TokenService.removeTokens();
                            window.location.assign("/login");
                        });
                    } else {
                        // Refresh Token was expired or disabled
                        console.log("refresh token expired " + originalConfig.url)
                        TokenService.removeTokens();
                        window.location.assign("/login");
                    }
                } catch (_error) {
                    return Promise.reject(_error);
                }
            } else {
                return Promise.reject(err);
            }
        } else {
            return Promise.reject(err);
        }
    }
);
export default instance;