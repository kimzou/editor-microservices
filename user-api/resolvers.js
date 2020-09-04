const jwt = require('jsonwebtoken');
const User = require('./models/user');
const Bcrypt = require('bcrypt');
require('dotenv').config();
const stripe = require("./stripe");

module.exports = {
    Query: {
        // get the actual connected user
        me: async (_, __, { user } ) => {
            console.log("me context")
            // console.log("me user", {user})
            // console.log("me logonas", {loginas})
            try {
                //TODO: display when the user is connected or not
                console.log("in me", {user})
                if (!user) return null; // in client, redirect to login page
                console.log("in me iffff")
                // return await User.findById(user._id);
                // if (!user) return new Error('You must be authentificated !');
                // const contextUser = await User.findById(user.id);
                // const loginAsUser = await User.findById(loginAs.id);
                // return loginAs ? { contextUser, loginAsUser } : contextUser;
                // let loginAsDecode;
                // if (loginas !== undefined) loginAsDecode = jwt.verify(loginas, process.env.JWT_SECRET);
                // const userLogged = await User.findById(loginAsDecode ? loginAsDecode.id : user.id);
                // console.log("me userLogged", userLogged);

                return await user;
                // return loginAs ? await User.findById(loginAs.id) : await User.findById(user.id);
            } catch (error) {
                console.error("jhfjkj", error);
            }
        },
        // get all users
        users: async () => {
            try {
                return await User.find();
            } catch (error) {
                console.error(error);
            }
        },
        // get one user by hes id
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
                const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
                const { email, firstname, lastname } = tokenDecoded;
                return { email, firstname, lastname };
            } catch (error) {
                console.log(error);
            }
        },
        // retrive checkout session and add purchased item to user's products
        buyMimo: async (_, { sessionId }, { user }) => {

            try {
                if(!user) throw new Error("You must be connected");

                const foundUser = await User.findById(user.id);

                const session = await stripe.checkout.sessions.retrieve(sessionId);
                const amount = session.display_items[session.display_items.length - 1].amount;
                let name = session.display_items[session.display_items.length - 1].custom.name.toString();

                foundUser.products.push({ mimoId: name, price: amount });
                await foundUser.save();

                return name;
            } catch (error) {
                console.error(error);
            }
        },
    },
    Mutation: {
        // Returns a token if credentials match the user, otherwise it returns the error
        login: async (_, { email, password }, context ) => {
            console.log('!!!!!!! in login')
            // console.log("===== in login", {res});
            try {
                const result = await User.findOne({ email: email });
                if (!result) return { error: "User not found" };

                const passwordOk = await Bcrypt.compare(password, result.password);
                if (!passwordOk) return { error: "Wrong password" };

                const token = jwt.sign(
                    { id: result._id, email: result.email, role: result.role,},
                    process.env.JWT_SECRET,
                    //TODO: set expires to 15 minutes
                    { expiresIn: '1min' }
                );

                const refreshToken = jwt.sign(
                    { id: result._id },
                    process.env.JWT_REFRESH_SECRET,
                    { expiresIn: '7d' }
                );

                console.log('login', {token, refreshToken})

                return {
                    token,
                    refreshToken,
                };
            } catch (error) {
                console.error(error);
                // return false;
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
                    process.env.JWT_SECRET,
                    { expiresIn: '7d' }
                );
                return { token: token };
            } catch (error) {
                console.error(error);
            }
        },
        // return a token of the user we want to connect at portal
        loginAs: async (_, { email }, { user }) => {
            try {
                if(user.role !== "ADMIN") throw new Error("You must be admin");
                const res = await User.findOne({ email: email });
                if(!res) throw new Error("User with this email not found");
                const token = jwt.sign(
                    { id: res._id, email: res.email },
                    process.env.JWT_SECRET,
                    { expiresIn: '24h' }
                );

                return { token };
            } catch (error) {
                console.error(error)
            }
        },
        // create Stripe checkout session
        checkoutSession: async (_, { userId, email, name, description, amount, successUrl, cancelUrl }) => {

            const session = await stripe.checkout.sessions.create({
                customer_email : email,
                client_reference_id: userId,
                payment_method_types: ['card'],
                line_items: [{
                  name: name,
                  description: description,
                  amount: amount * 100,
                  currency: 'eur',
                  quantity: 1,
                }],
                metadata: {
                    user: userId,
                },
                success_url: `${successUrl}/session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: cancelUrl,
            });

            return session.id;
        },
    },
}