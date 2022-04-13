import axios from 'axios';
import authHeader from './auth-header';
const API_URL = 'http://localhost:8090/api/project';
class ProjectService {
    getAll() {
        return axios.get(API_URL, { headers: authHeader() });
    }
    assemble(id) {
        return axios.post(API_URL + "/" + id + "/assemble", {},{ headers: authHeader() });
    }
}
export default new ProjectService();