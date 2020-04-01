import React, { useState } from "react";
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import StripeCheckout from 'react-stripe-checkout';
import { Mutation, Query } from 'react-apollo';
import { Link } from 'react-router-dom';

const GET_COURSE_AND_USER_INFO = gql`
    query {
        getCourse(id: "5e53973e1c9d440000c08d9b") {
            title
            mimos {
                id
                title
                description
                price
            }
        }
        me {
            email
            products {
                mimoId
                price
            }
        }
    }
`;

const GET_USER_PRODUCT = gql`
    query {
        me {
            email
            products
        }
    }
`;

const BUY_MIMO = gql`
    mutation BuyMimo($mimoId: ID!, $token: String) {
        buyMimo(mimoId: $mimoId, token: $token)
    }
`;

const BuyMimo = () => {
    return(
        <Mutation 
            mutation={BUY_MIMO}
        >
        {(mutate, {data}) => (
            <StripeCheckout 
                token={async token => {
                    const lol = await mutate({ variables: { mimoId: "5e820c041c9d440000b4684c", token: token.id } })
                    console.log({data})
                        console.log({lol});
                        // setStripeToken(token)} 
                }}
                stripeKey={process.env.REACT_APP_STRIPE_PUB_KEY}
            />
        )}
        </Mutation>
    )
}


const Course = () => {
    // const stripe = useStripe();
    // const elements = useElements();
    const [showCard, setCard] = useState(false);
    // const [autorizedMimo, setAuthorizedMimo] = useState({});
    const [stripeToken, setStripeToken] = useState("");

    const handleStripe = () => {
        setCard(true);
    };

    return(
        <Query query={GET_COURSE_AND_USER_INFO}>
            {({ data, loading}) => {
                if(loading) return <p>loading...</p>
                const { getCourse, me } = data;
                const productsId = me.products.map( o => o.mimoId );
                console.log({me})
                return (
                    <div>
                        <h1>Cours : {getCourse.title}</h1>
                        {getCourse.mimos.map((mimo, index) => {
                            console.log(mimo)
                            return (<div key={mimo.id} style={{ margin: 20, border: "solid 2px grey" }}>
                                    {(index === 0 || productsId.includes(mimo.id))
                                        ? <Link to="#">{mimo.title}</Link>
                                        : mimo.title}
                                    <br/>
                                    {mimo.description}<br/>
                                    {mimo.price}
                                    {/* <button disabled={index === 0 ? false : autorized ? false : true}>
                                        {mimo.title}
                                    </button> */}
                                </div>
                            )
                        })}
                    <BuyMimo />
                    </div>
                )
            }}
        </Query>
    )
}

export default Course;