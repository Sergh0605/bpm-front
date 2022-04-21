import api from "./api";
class CommentService {
    getByProjectId(projectId) {
        return api.get("/project/" + projectId + "/comment")
    }

    getByProjectIdPage(projectId, number) {
        return api.get("/project/" + projectId + "/comment?page=" + number + "&size=5")
    }

    getByDocumentId(projectId, documentId) {
        return api.get("/project/" + projectId + "/document/" + documentId + "/comment")
    }

    getByDocumentIdPage(projectId, documentId, number) {
        return api.get("/project/" + projectId + "/document/" + documentId + "/comment?page=" + number + "&size=5")
    }

    addCommentForProject(projectId, comment) {
        return api.post("/project/" + projectId + "/comment", {...comment})
    }

    addCommentForDocument(projectId, documentId, comment) {
        return api.post("/project/" + projectId + "/document/" + documentId + "/comment", {...comment})
    }
}
export default new CommentService();