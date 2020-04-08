const { gql } = require('apollo-server-express');
const { mergeTypes } = require('merge-graphql-schemas');

const root = require('./root');
const user = require('./user');
const adress = require('./adress');
const product = require('./product');

const schemaArray = gql`${mergeTypes([root, user, adress, product])}`;

module.exports = schemaArray;