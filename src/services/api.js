import axios from "axios";
import TokenService from "./token.service";
import AuthService from "./auth.service";
const API_URL = "http://localhost:8090/api";

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
            if (err.response.status === 401 && !originalConfig._retry) {
                originalConfig._retry = true;
                try {
                    let currentUser = AuthService.getCurrentUser();
                    if (currentUser.refreshExpDate && currentUser.refreshExpDate * 1000 > Date.now()) {
                        axios.post(API_URL + "/user/refresh_token_auth", {
                            token: TokenService.getLocalRefreshToken(),
                        }).then(response => {
                            const tokens = response.data;
                            TokenService.setTokens(tokens);
                            return instance(originalConfig);
                        }, error => {
                            TokenService.removeTokens();
                            window.location.assign("/login");
                        });
                    }
                    // Refresh Token was expired or disabled
                    TokenService.removeTokens();
                    window.location.assign("/login");

                } catch (_error) {
                    return Promise.reject(_error);
                }
            }
        }
        return Promise.reject(err);
    }
);
export default instance;