class TokenService {
    getLocalRefreshToken() {
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        return tokens?.refreshToken;
    }
    getLocalAccessToken() {
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        return tokens?.accessToken;
    }
    getTokens() {
        return JSON.parse(localStorage.getItem("tokens"));
    }
    setTokens(tokens) {
        localStorage.setItem("tokens", JSON.stringify(tokens));
    }
    removeTokens() {
        localStorage.removeItem("tokens");
    }
}
export default new TokenService();