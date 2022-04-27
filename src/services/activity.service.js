import api from "./api";

class ActivityService {

    getPage(pageNumber, filter) {
        return api.get("/activity?page=" + pageNumber + "&size=15&search=" + filter)
    }

}
export default new ActivityService();