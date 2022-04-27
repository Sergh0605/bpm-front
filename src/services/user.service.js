import api from "./api";

const formData = (object, file) => {
    let bodyFormData = new FormData();
    const json = JSON.stringify(object);
    const blob = new Blob([json], {type: 'application/json'})
    bodyFormData.append('user', blob);
    bodyFormData.append('file', file);
    return bodyFormData;
}

class UserService {
    getAll() {
        return api.get("/user");
    }
    getUser(id) {
        return api.get("/user/" + id);
    }

    update(userId, user, file) {
        let bodyFormData = formData(user, file);
        return api.put("/user/" + userId, bodyFormData, {headers: {"Content-Type" : "multipart/form-data"}});
    }

    updateRoles(userId, roles) {
        return api.put("/user/" + userId + "/edit_roles", {roles});
    }

    getPage(pageNumber, filter) {
        return api.get("/user?page=" + pageNumber + "&size=10&search=" + filter)
    }

    save(user, file) {
        let bodyFormData = formData(user, file);
        return api.post("/user/", bodyFormData, {headers: {"Content-Type" : "multipart/form-data"}});
    }

}
export default new UserService();