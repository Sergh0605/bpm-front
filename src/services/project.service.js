import api from "./api";
class ProjectService {
    getAll() {
        return api.get("/project");
    }
    assemble(id) {
        return api.post("/project/" + id + "/assemble", {});
    }

    delete(id) {
        return api.post("/project/" + id + "/disable", {});
    }

    getPdf(id) {
        return api.get("/project/" + id + "/download", {responseType: 'blob'});
    }
}
export default new ProjectService();