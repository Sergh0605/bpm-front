import api from "./api";
class CompanyService {
    getAll() {
        return api.get("/company");
    }
    getUsersById(id) {
        return api.get("/company/" + id + "/users", {});
    }
}
export default new CompanyService();