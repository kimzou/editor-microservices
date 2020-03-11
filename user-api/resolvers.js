const jwt = require('jsonwebtoken');
const User = require('./models/user');
const Bcrypt = require('bcrypt');
require('dotenv').config();

const secret = process.env.API_SECRET;

module.exports = {
    Query: {
        me: async (_, __, { user } ) => {
            try {
                if (!user) return new Error('You must be authentificated !');
                return await User.findById(user.id);
            } catch (error) {
                console.error(error);
            }
        },
        users: async () => {
            try {
                return await User.find();
            } catch (error) {
                console.error(error);
            }
        },
        userById: async (_, { id }) => {
            try {
                return await User.findById(id);
            } catch (error) {
                console.error(error);
            }
        },
        // root to retrive info from the connected user to send it to Global Exam
        globalExam: (_, { token }) => {
            try {
                const tokenDecoded = jwt.verify(token, secret);
                const { email, firstname, lastname } = tokenDecoded;
                return { email, firstname, lastname };
            } catch (error) {
                console.log(error);
            }
        },
    },
    Mutation: {
        // Returns a token if credentials match the user, otherwise it returns the error
        login: async (_, { email, password }) => {
            try {
                const res = await User.findOne({ email: email });
                if (!res) return { error: "User not found" };

                const passwordOk = await Bcrypt.compare(password, res.password);
                if (!passwordOk) return { error: "Wrong password" };
                // console.log(res._id)
                const token = jwt.sign(
                    { id: res._id, email: res.email, role: res.role },
                    process.env.API_SECRET,
                    { expiresIn: '8h' }
                );
                return { token };
            } catch (error) {
                console.error(error);
            }
        },
        // Search if the email is already in the database, if not, create a new user
        register: async (_, { email, password }) => {
            try {
                const res = await User.findOne({ email: email });
                if (res) return { error: "The email is already used" };

                let newUser = new User();
                newUser.email = email;
                newUser.password = await Bcrypt.hash(password, 10);
                await newUser.save();
                
                const token = jwt.sign(
                    { id: newUser._id, email: email },
                    process.env.API_SECRET,
                    { expiresIn: '8h' }
                );
                return { token: token };
            } catch (error) {
                console.error(error);
            }
        },
        loginAs: async (_, { email }) => {
            console.log("login as");
            try {
                const user = await User.findOne({ email: email });
                const token = jwt.sign(
                    { email: user.email },
                    process.env.API_SECRET,
                    { expiresIn: '1h' }
                );
                console.log({token});

                return { token: token };
            } catch (error) {
                console.error(error)
            }
        }, 
    }
}