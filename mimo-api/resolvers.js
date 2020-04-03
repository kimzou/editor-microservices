const { Mimo, Course} = require('./models');
require("dotenv").config();

const resolvers = {
    Query: {
        getMimos: async () => {
            try {
                return await Mimo.find()
            } catch (error) {
                console.error(error)
            }
        },
        getCourses: async () => {
            try {
                return await Course.find();
            } catch (error) {
                console.error(error);
            }
        },
        getCourse: async (_, { id }) => {
            try {
                return await Course.findById(id);
            } catch (error) {
                console.error(error);
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
        },
    },
    Course: {
        // find mimos attach to the course collection
        mimos: async parent => {
             try {
                return await Mimo.find().where('_id').in(parent.mimos).exec();
             } catch (error) {
                 console.error(error);
             }
        }
    },
};

module.exports = resolvers;