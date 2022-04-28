import api from "./api";
import {downloadFile} from "../utils/common-utils";
class ProjectService {

    getPage(pageNumber, filter) {
        return api.get("/project?page=" + pageNumber + "&size=5&search=" + filter)
    }

    getHistoryPage(projectId, pageNumber) {
        return api.get("/project/" + projectId + "/assemble_history?page=" + pageNumber + "&size=10")
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

    getPdfForDownload(id) {
        return this.getPdf(id)
            .then(response => {
                downloadFile(response);
            });
    }

    getHistoryPdfForDownload(projectId, id) {
        return api.get("/project/" + projectId + "/assemble_history/" + id + "/download", {responseType: 'blob'})
            .then(response => {
                downloadFile(response);
            });
    }

    getById(id) {
        return api.get("/project/" + id);
    }

    update(id, project) {
        return api.put("/project/" + id, {...project});
    }

    save(project) {
        return api.post("/project", {...project});
    }

    getDocListById(id) {
        return api.get("/project/" + id + "/document");
    }
}
export default new ProjectService();