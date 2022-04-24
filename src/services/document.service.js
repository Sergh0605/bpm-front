import api from "./api";

const formData = (document, file) => {
    let bodyFormData = new FormData();
    const json = JSON.stringify(document);
    const blob = new Blob([json], {type: 'application/json'})
    bodyFormData.append('document', blob);
    bodyFormData.append('file', file);
    return bodyFormData;
}

class ProjectService {
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

    update(projectId, documentId, document, file) {
        let bodyFormData = formData(document, file);
        return api.put("/project/" + projectId + "/document/" + documentId, bodyFormData, {headers: {"Content-Type" : "multipart/form-data"}});
    }

    save(projectId, document, file) {
        let bodyFormData = formData(document, file);
        return api.post("/project/" + projectId + "/document", bodyFormData, {headers: {"Content-Type" : "multipart/form-data"}});
    }
}
export default new ProjectService();