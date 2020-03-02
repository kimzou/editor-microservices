import { RESTDataSource } from 'apollo-datasource-rest';

export default class GlobalExamAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = "http://localhost:4004"
    }

    async getUser({ token }) {
        try {
            console.log("getUser", { token })
            const user = await this.get("user", { token });
            console.log("user", user)
            console.log("user[0]", user._id)
            return user[0];
        } catch (error) {
            console.error("error in getUser", error);
        }
    }
}