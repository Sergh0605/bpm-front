import api from "./api";
import {downloadFile, formData} from "../utils/common-utils";

class DocumentService {
    assemble(projectId, documentId) {
        return api.post("/project/" + projectId + "/document/" + documentId + "/assemble", {});
    }

    delete(projectId, documentId) {
        return api.post("/project/" + projectId + "/document/" + documentId + "/disable", {});
    }

    getPdf(projectId, documentId) {
        return api.get("/project/" + projectId + "/document/" + documentId + "/download", {responseType: 'blob'});
    }

    getPdfForDownload(projectId, documentId) {
        return this.getPdf(projectId, documentId)
            .then(response => {
                downloadFile(response);
            });
    }

    getById(projectId, documentId) {
        return api.get("/project/" + projectId + "/document/" + documentId);
    }

    update(projectId, documentId, document, file) {
        let bodyFormData = formData(document, file, 'document');
        return api.put("/project/" + projectId + "/document/" + documentId, bodyFormData, {headers: {"Content-Type" : "multipart/form-data"}});
    }

    save(projectId, document, file) {
        let bodyFormData = formData(document, file, 'document');
        return api.post("/project/" + projectId + "/document", bodyFormData, {headers: {"Content-Type" : "multipart/form-data"}});
    }
}
export default new DocumentService();