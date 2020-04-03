import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import * as validator from 'validator';
require('dotenv').config();
import { v4 as uuid } from 'uuid';
const User = require('./models/user');
import {
    MissingDataError,
    ResetTokenExpiredError,
    InvalidEmailError,
    UserNotFoundError,
    UserEmailExistsError,
    InvalidEmailConfirmToken,
    UserEmailUnconfirmedError,
    EmailAlreadyVerified
  } from './errors';

const secret = process.env.API_SECRET;

const transporter = nodemailer.createTransport({ 
    host: process.env.MAILER_SERVICE_PROVIDER,
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAILER_EMAIL_ID,
        pass: process.env.MAILER_PASSWORD
    }
});

function generateToken(user) {
    return jwt.sign({ email: user.email }, process.env.API_SECRET);
}

function getHashedPassword(password) {
    return bcrypt.hash(password, 10);
}

module.exports = {
    Query: {
        users: async () => {
            try {
                return await User.find();
            } catch (error) {
                console.error(error);
            }
        },
        user: async (_, { id }) => {
            try {
                return await User.findOne({ _id: id });
            } catch (error) {
                console.error(error);
            }
        },
        // root to retrive info from the connected user to send it to Global Exam
        globalExam: (_, { token }) => {
            try {
                const tokenDecoded = jwt.verify(token, secret);
                const {firstname, lastname, email} = tokenDecoded;
                return { email, firstname, lastname };
            } catch (error) {
                console.log(error);
            }
        },
    },
    Mutation: {
        // Returns a token if credentials match the user, otherwise it returns an error
        login: async (_, { email, password }) => {
            try {
                const user = await User.findOne({ email: email });
                if (!user) { throw new UserNotFoundError() };
                if (!user.verifiedAccount) { throw new UserEmailUnconfirmedError(); }

                const passwordOk = await bcrypt.compare(password, res.password);
                if (!passwordOk) { throw new UserNotFoundError(); };
                
                return { token: generateToken(user) };
            } catch (error) {
                console.error(error);
            }
        },
        // Search if the email is already in the database, if not, create a new user
        register: async (_, { email, password }) => {
            try {
                if (!email) throw new MissingDataError();
                const user = await User.findOne({ email: email });
                if (user) throw new UserEmailExistsError();

                // Save new User in database
                let newUser = new User();
                newUser.email = email;
                newUser.password = await getHashedPassword(password);
                await newUser.save();

                // Send verification email
                jwt.sign({ email: email}, secret, { expiresIn: '1h' }, (err, emailToken) => {
                    newUser.emailConfirmToken = emailToken;
                    newUser.save();
                    const url = 'http://localhost:4001/verify/' + emailToken + '';
                    
                    let data = {
                        from: 'no-reply@ionisx.com',
                        to: newUser.email, 
                        subject: 'Vérification de compte',
                        text: 'Vérifier votre compte en cliquant sur ce lien: ' + url
                    };
                    
                    transporter.sendMail(data, (error) => {
                        if (err) { console.log(error) };
                        console.log('Email envoyé');
                    })
                })
                
                return { token: generateToken(newUser) };

            } catch (error) {
                console.error(error);
            } 
            
        },
        // Confirm user account when clicking on verification link
        confirmMail: async (_, { emailToken, email }) => {
            try {
                if (!emailToken || !email) {
                    throw new MissingDataError();
                }
                // Check if user has already registered with email
                const user = await User.findOne({ email: email });
                if (!user) throw new UserNotFoundError();
                if (user.emailConfirmToken !== emailToken) {
                    throw new InvalidEmailConfirmToken();
                }
                if (user.verifiedAccount) { throw new EmailAlreadyVerified() };
                // Update User verifiedAccount field in database
                const updatedUser = await User.findOneAndUpdate( { email: email }, { emailConfirmToken: '', verifiedAccount: true }, (err) => {
                    if (err) {
                        console.log(err);
                    } else {console.log("User successfully verified");}
                });
                
                return {user: updatedUser};

            } catch (error) {
                console.error(error);
            }
        },
        // Send password reset email
        triggerPasswordReset: async (_, { email }) => {
            try {
                if (!validator.isEmail(email)) {
                    throw new InvalidEmailError();
                }
                // Check if user exists in database
                const user = await User.findOne({ email: email });
                if (!user) throw new UserNotFoundError();

                const resetToken = uuid();
                const now = new Date();
                // Set token expiration to 2 hours
                const resetExpires = new Date(now.getTime() + 7200000).toISOString();

                await User.updateOne( { email: email}, { passwordResetToken: resetToken, passwordResetExpires: resetExpires});
                
                const url = 'http://localhost:4001/passwordreset/' + resetToken + '';
                let data = {
                    from: 'no-reply@ionisx.com',
                    to: user.email,
                    subject: 'Mot de passe oublié',
                    text: 'Modifiez votre mot de passe en cliquant sur ce lien: ' + url
                };
                
                transporter.sendMail(data, (error) => {
                    if (err) { console.log(error) };
                    console.log('Email envoyé');
                })

                return true;
            }
            catch (error) {
                console.error(error);
            }
        },
        passwordReset: async (_, { email, resetToken, password }) => {
            try {
                if (!resetToken || !password) {
                    throw new MissingDataError();
                }
                // Check if user exists and if token is valid
                const user = await User.findOne({ email: email });
                if (!user || !user.passwordResetExpires || user.passwordResetToken !== resetToken) {
                    throw new UserNotFoundError();
                }
                // Check token expiration
                if (new Date() > new Date(user.passwordResetExpires)) {
                    throw new ResetTokenExpiredError();
                }

                const hashedPassword = await getHashedPassword(password);
                await User.updateOne( { email: email}, { passwordResetToken: '', passwordResetExpires: undefined});
                await User.updateOne( { email: email}, { password: hashedPassword});

                return {
                    id: user.id
                };
            } catch (error) {
                console.error(error);
            }
        }
    }
}