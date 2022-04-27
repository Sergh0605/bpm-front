import api from "./api";
const API_URL = 'http://localhost:8080/api/user/';
class RoleService {
    getAll() {
        return api.get("/role");
    }

}
export default new RoleService();