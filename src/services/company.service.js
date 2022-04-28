import api from "./api";
import {formData} from "../utils/common-utils";

class CompanyService {
    getAll(filter) {
        return api.get("/company?search=" + filter);
    }

    getUsersById(id) {
        return api.get("/company/" + id + "/users", {});
    }

    getById(id) {
        return api.get("/company/" + id);
    }

    update(companyId, company, file) {
        let bodyFormData = formData(company, file, 'company');
        return api.put("/company/" + companyId, bodyFormData, {headers: {"Content-Type" : "multipart/form-data"}});
    }

    save(company, file) {
        let bodyFormData = formData(company, file, 'company');
        return api.post("/company", bodyFormData, {headers: {"Content-Type" : "multipart/form-data"}});
    }
}
export default new CompanyService();