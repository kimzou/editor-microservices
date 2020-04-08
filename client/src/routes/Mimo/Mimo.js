import React from "react";
import gql from "graphql-tag";
import { useParams } from "react-router-dom";
import { Query } from "react-apollo";

const LOAD_MIMO = gql`
    query GetMimo($id: ID!) {
        getMimo(id: $id) {
            title
            description
        }
    }
`;

const Mimo = () => {
    const { id } = useParams();
    return (
        <Query 
            query={LOAD_MIMO} 
            variables={{ id: id }}
        >
            {({ data, error }) => {
                if (error) return `Error! ${error.message}`;
                return(
                    <>
                        <h1>{data && data.getMimo.title}</h1>
                        <br/>
                        <p>{data && data.getMimo.description}</p>
                    </>
                )
            }}
        </Query>
    )
}

export default Mimo;