const resolvers = {
    Query: {
        user: (_, { token }, { dataSources }) => {
            console.log("query user", { token })
            return dataSources.globalExamAPI.getUser({ token });
        },
    }
}

export default resolvers;