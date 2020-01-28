const User = require('./models/user');

module.exports = {
    Query: {
        allUsers: async () => {
            try {
                return await User.find();
                
            } catch (error) {
                console.error(error)
            }
        },
        userId: async (_, { id }) => {
            try {
                return await User.findById(id);
            } catch (error) {
                console.error(error)
            }
        }
    },
    User: {
        // create fetchUserById function
        async __resolveReference(user, { fetchUserById }) {
            console.log({user})
            return fetchUserById(user.id);
        }
    }
}