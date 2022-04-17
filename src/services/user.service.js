import api from "./api";
import authHeader from './auth-header';
const API_URL = 'http://localhost:8080/api/user/';
class UserService {
    getAll() {
        return api.get("/user");
    }
    getUser(id) {
        return api.get("/user/" + id);
    }
}
export default new UserService();