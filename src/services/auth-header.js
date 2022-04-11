import AuthService from "./auth.service";

export default function authHeader() {
    const accessToken = AuthService.getValidToken();
    if (accessToken) {
        return {Authorization: 'Bearer ' + accessToken};
    } else {
        return {};
    }

}