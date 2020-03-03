import { RESTDataSource } from 'apollo-datasource-rest';

export default class GlobalExamAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = "http://localhost:4004"
    }

    async getUser({ token }) {
        try {
            const user = await this.get("user", { token });
            console.log("user", user)
            return {id: user._id, username: user.username };
        } catch (error) {
            console.error("error in getUser", error);
        }
    }
}