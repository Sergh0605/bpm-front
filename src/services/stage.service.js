import api from "./api";
class StageService {
    getAll() {
        return api.get("/stage");
    }
}
export default new StageService();