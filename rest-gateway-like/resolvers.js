const resolvers = {
    Query: {
        user: (_, { token }, { dataSources }) => {
            return dataSources.globalExamAPI.getUser({ token });
        },
    },
}

export default resolvers;