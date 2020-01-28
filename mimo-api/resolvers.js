const Mimo = require('./models');

const resolvers = {
    Query: {
        getMimos: async (_, { id }) => await Mimo.findById(id),
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
    }
};

module.exports = resolvers;