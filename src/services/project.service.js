import api from "./api";
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
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'project.pdf'); //TODO customize name
                document.body.appendChild(link);
                link.click();
            });
    }

    getHistoryPdfForDownload(projectId, id) {
        return api.get("/project/" + projectId + "/assemble_history/" + id + "/download", {responseType: 'blob'})
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'project.pdf'); //TODO customize name
                document.body.appendChild(link);
                link.click();
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