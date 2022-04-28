import api from "./api";
import {formData} from "../utils/common-utils";

class UserService {
    getUser(id) {
        return api.get("/user/" + id);
    }

    update(userId, user, file) {
        let bodyFormData = formData(user, file, 'user');
        return api.put("/user/" + userId, bodyFormData, {headers: {"Content-Type" : "multipart/form-data"}});
    }

    updateRoles(userId, roles) {
        return api.put("/user/" + userId + "/edit_roles", {roles});
    }

    getPage(pageNumber, filter) {
        return api.get("/user?page=" + pageNumber + "&size=10&search=" + filter)
    }

    save(user, file) {
        let bodyFormData = formData(user, file, 'user');
        return api.post("/user/", bodyFormData, {headers: {"Content-Type" : "multipart/form-data"}});
    }

}
export default new UserService();