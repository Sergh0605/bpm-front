import api from "./api";
class ProjectService {
    assemble(projectId, documentId) {
        return api.post("/project/" + projectId + "/document/" + documentId, {});
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
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'project.pdf'); //TODO customize name
                document.body.appendChild(link);
                link.click();
            });
    }

    getById(projectId, documentId) {
        return api.get("/project/" + projectId + "/document/" + documentId);
    }

    update(projectId, documentId, document) {
        return api.put("/project/" + projectId + "/document/" + documentId, {...document});
    }

    save(projectId, document) {
        return api.post("/project/" + projectId + "/document", {...document});
    }
}
export default new ProjectService();