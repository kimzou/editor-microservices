const { gql } = require('apollo-server-express');
const { mergeTypes } = require('merge-graphql-schemas');

const mimo = require('./mimo');
const course = require('./course');

const schemaArray = gql`${mergeTypes([mimo, course])}`;

module.exports = schemaArray;