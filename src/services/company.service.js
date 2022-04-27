import api from "./api";

const formData = (object, file) => {
    let bodyFormData = new FormData();
    const json = JSON.stringify(object);
    const blob = new Blob([json], {type: 'application/json'})
    bodyFormData.append('company', blob);
    bodyFormData.append('file', file);
    return bodyFormData;
}

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
        let bodyFormData = formData(company, file);
        return api.put("/company/" + companyId, bodyFormData, {headers: {"Content-Type" : "multipart/form-data"}});
    }

    save(company, file) {
        let bodyFormData = formData(company, file);
        return api.post("/company", bodyFormData, {headers: {"Content-Type" : "multipart/form-data"}});
    }
}
export default new CompanyService();