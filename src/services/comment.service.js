import api from "./api";
class CommentService {
    getByProjectId(projectId) {
        return api.get("/project/" + projectId + "/comment")
    }

    getByProjectIdPage(projectId, number, size) {
        return api.get("/project/" + projectId + "/comment?page=" + number + "&size=" + size)
    }

    getByDocumentId(projectId, documentId) {
        return api.get("/project/" + projectId + "/document/" + documentId + "/comment")
    }

    getByDocumentIdPage(projectId, documentId, number, size) {
        return api.get("/project/" + projectId + "/document/" + documentId + "/comment?page=" + number + "&size=" + size)
    }

    addCommentForProject(projectId, comment) {
        return api.post("/project/" + projectId + "/comment", {...comment})
    }

    addCommentForDocument(projectId, documentId, comment) {
        return api.post("/project/" + projectId + "/document/" + documentId + "/comment", {...comment})
    }
}
export default new CommentService();