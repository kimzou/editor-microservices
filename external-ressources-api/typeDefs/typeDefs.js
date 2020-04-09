const { gql } = require('apollo-server-express');
const { mergeTypes } = require('merge-graphql-schemas');

const lead = require("./lead");

const schemaArray = gql`${mergeTypes([lead])}`;

module.exports = schemaArray;
