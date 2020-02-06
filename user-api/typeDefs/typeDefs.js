const { gql } = require('apollo-server');
const { mergeTypes } = require('merge-graphql-schemas');
const root = require('./root');
const user = require('./user');

const schemaArray = gql`${mergeTypes([root, user])}`;

module.exports = schemaArray;