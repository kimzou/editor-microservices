const jwt = require('jsonwebtoken');
const User = require('./models/user');
const Product = require('./models/product')
const Bcrypt = require('bcrypt');
require('dotenv').config();
const stripe = require("./stripe");

module.exports = {
    Query: {
        // get the actual connected user
        me: async (_, __, { user, loginas } ) => {
            // console.log("me user", {user})
            // console.log("me logonas", {loginas})
            try {
                //TODO: check roles
                if (!user) return new Error('You must be authentificated !');
                // const contextUser = await User.findById(user.id);
                // const loginAsUser = await User.findById(loginAs.id);
                // return loginAs ? { contextUser, loginAsUser } : contextUser;
                let loginAsDecode;
                if (loginas !== undefined) loginAsDecode = jwt.verify(loginas, process.env.JWT_SECRET);
                const userLogged = await User.findById(loginAsDecode ? loginAsDecode.id : user.id);
                // console.log("me userLogged", userLogged);
                return userLogged;
                // return loginAs ? await User.findById(loginAs.id) : await User.findById(user.id);
            } catch (error) {
                console.error(error);
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
        buyMimo: async (_, { sessionId }, { user }) => {
            console.log("buy mimo");
            try {
                if(!user) throw new Error("You must be connected");
                const foundUser = await User.findById(user.id);

                const session = await stripe.checkout.sessions.retrieve(sessionId);
                const amount = session.display_items[session.display_items.length - 1].amount;
                let name = session.display_items[session.display_items.length - 1].custom.name.toString();
                console.log(session.display_items)

                foundUser.products.push({ mimoId: name, price: amount });
                await foundUser.save();
                return name;
                
                // let customer;
                // if(!foundUser.stripeId || foundUser.stripeId === "") {
                //     console.log("if")
                //     customer = await stripe.customers.create({
                //         email: user.email,
                //         source: token,
                //         metadata: {
                //             userId: user.id,
                //         },
                //     })
                //     console.log({customer})
                //     // await User.findOneAndUpdate({_id: user.id}, { stripeId: customer.id}, { new: true });
                //     foundUser.stripeId = customer.id;
                // }
                // console.log("not if")
                // const charge = await stripe.charges.create({
                //       amount: amount * 100,
                //       currency: "EUR",
                //       source: token,
                //     //   customer: customer ? customer.id : foundUser.stripeId,
                //       description: `Purchase of mimo number ${mimoId}`
                // });
                // console.log({charge});

                // if(!charge.status === "succeeded") return "Failed";
                // foundUser.products.push({ mimoId: mimoId, price: amount });
                // await foundUser.save();
                // return "Success";
            } catch (error) {
                console.error(error);
            }
        },
    },
    Mutation: {
        // Returns a token if credentials match the user, otherwise it returns the error
        login: async (_, { email, password }) => {
            try {
                const res = await User.findOne({ email: email });
                if (!res) return { error: "User not found" };
                // console.log({res})
                const passwordOk = await Bcrypt.compare(password, res.password);
                if (!passwordOk) return { error: "Wrong password" };
                // console.log(res._id)
                const token = jwt.sign(
                    { id: res._id, email: res.email, role: res.role,},
                    process.env.JWT_SECRET,
                    { expiresIn: '24h' }
                );
                // console.log("login token", token)
                // console.log("login res role", res.role )
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
                    process.env.JWT_SECRET,
                    { expiresIn: '24h' }
                );
                return { token: token };
            } catch (error) {
                console.error(error);
            }
        },
        // return a token of the user we want to connect at portal
        loginAs: async (_, { email }, { user }) => {
            // console.log("login as");
            try {
                if(user.role !== "ADMIN") throw new Error("You must be admin");
                const res = await User.findOne({ email: email });
                if(!res) throw new Error("User with this email not found");
                const token = jwt.sign(
                    { id: res._id, email: res.email },
                    process.env.JWT_SECRET,
                    { expiresIn: '24h' }
                );
                // console.log("login as token", token)
                return { token };
                // console.log("user loginas id ", user._id)
                // return user._id;
            } catch (error) {
                console.error(error)
            }
        }, 
        // buyMimo: async (_, { sessionId }, { user }) => {
        //     console.log("buy mimo");
        //     try {
        //         if(!user) throw new Error("You must be connected");
        //         console.log({user})
        //         console.log({sessionId})
        //         const foundUser = await User.findById(user.id);

        //         const session = await stripe.checkout.sessions.retrieve(sessionId);
        //         console.log({session})
        //         // foundUser.products.push({ mimoId: mimoId, price: amount });
        //         await foundUser.save();
        //         return "Success";
                
        //         // let customer;
        //         // if(!foundUser.stripeId || foundUser.stripeId === "") {
        //         //     console.log("if")
        //         //     customer = await stripe.customers.create({
        //         //         email: user.email,
        //         //         source: token,
        //         //         metadata: {
        //         //             userId: user.id,
        //         //         },
        //         //     })
        //         //     console.log({customer})
        //         //     // await User.findOneAndUpdate({_id: user.id}, { stripeId: customer.id}, { new: true });
        //         //     foundUser.stripeId = customer.id;
        //         // }
        //         // console.log("not if")
        //         // const charge = await stripe.charges.create({
        //         //       amount: amount * 100,
        //         //       currency: "EUR",
        //         //       source: token,
        //         //     //   customer: customer ? customer.id : foundUser.stripeId,
        //         //       description: `Purchase of mimo number ${mimoId}`
        //         // });
        //         // console.log({charge});

        //         // if(!charge.status === "succeeded") return "Failed";
        //         // foundUser.products.push({ mimoId: mimoId, price: amount });
        //         // await foundUser.save();
        //         // return "Success";
        //     } catch (error) {
        //         console.error(error);
        //     }
        // },
        checkoutSession: async (_, { userId, email, name, description, amount, successUrl, cancelUrl }) => {
            console.log('checkout session')
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
            console.log({session});
            return session.id;
        },
    },
}