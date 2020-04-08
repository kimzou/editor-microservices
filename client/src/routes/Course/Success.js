import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { useParams, useHistory } from 'react-router-dom';

const BUY_MIMO = gql`
    query BuyMimo($sessionId: String!) {
        buyMimo(sessionId: $sessionId)
    }
`;

const Success = () => {
    let { session_id } = useParams();
    const history = useHistory();
    session_id = session_id.replace("session_id=", "");
    return(
        <Query 
            query={BUY_MIMO} 
            variables = {{ sessionId: session_id }}
        >
            {({ data, error }) => {
                if (error) return `Error! ${error.message}`;
                return (
                    <>
                        <h1>Achat du mimo {data && data.buyMimo}</h1>
                        <button onClick={() => history.push("/course")}>
                            Retourner aux cours
                        </button>
                    </>
                )
            }}
        </Query>
    );
}

export default Success ;