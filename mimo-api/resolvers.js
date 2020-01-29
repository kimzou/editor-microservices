const Mimo = require('./models');

const resolvers = {
    Query: {
        getMimos: async () => {
            try {
                return await Mimo.find()
            } catch (error) {
                console.error(error)
            }
        }
    },
    Mutation: {
        addMimo: async (_, args) => {
            try {
                let response = await Mimo.create(args);
                return response;
            } catch(e) {
                return e.message;
            }
        }
    },
};

module.exports = resolvers;