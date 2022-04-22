import api from "./api";
class DocumentTypeService {
    getAll() {
        return api.get("/project/document-type");
    }
}
export default new DocumentTypeService();