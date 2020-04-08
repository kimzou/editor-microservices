import React from "react";
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

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
            id
            email
            products {
                mimoId
                price
            }
        }
    }
`;

const CREATE_CHECKOUT_SESSION = gql`
    mutation CheckoutSession($userId: String $email: String, $name: String!, $description: String, $amount: Int!, $successUrl: String!, $cancelUrl: String!) {
        checkoutSession(userId: $userId, email: $email, name: $name, description: $description, amount: $amount, successUrl: $successUrl, cancelUrl: $cancelUrl)
    }
`;

const BuyMimo =  ({ userId, price, email, name, description }) => {
    const [checkoutSession, { data }] = useMutation(CREATE_CHECKOUT_SESSION, {
        onError(error) { console.error(error) },
        async onCompleted({ checkoutSession }) {
            const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUB_KEY);
            const { error } = await stripe.redirectToCheckout({ 
                sessionId: checkoutSession,
            });
            if(error) console.error(error);          
        }
    })

    const buying = () => {
        checkoutSession({
            variables: { 
                userId: userId,
                email: email,
                name: name,
                description: description, 
                amount: price, 
                successUrl: "http://localhost:3000/course/success", 
                cancelUrl: "http://localhost:3000" 
            } 
        })
    }

    return (
        <button onClick={buying}>
            Acheter pour {price} euro
        </button>
    )
}

const Course = () => {
    return(
        <Query query={GET_COURSE_AND_USER_INFO}>
            {({ data, loading, error }) => {
                if(loading) return <p>loading...</p>
                if(error) return `Error! ${error.message}`
                const { getCourse, me } = data;
                const productsId = me.products.map( o => o.mimoId );
                return (
                    <div>
                        <h1>Cours : {getCourse.title}</h1>
                        {getCourse.mimos.map((mimo, index) => {
                            return (
                                <div key={mimo.id} style={{ margin: 20, border: "solid 2px grey" }}>
                                    {(index === 0 || productsId.includes(mimo.id))
                                        ? <Link to={`/mimo/${mimo.id}`}>{mimo.title}</Link>
                                        : mimo.title
                                    }
                                    <br/>
                                    {mimo.description}<br/>
                                    {mimo.price}<br/>
                                    {!productsId.includes(mimo.id) && index !== 0 && 
                                        <BuyMimo 
                                            price={mimo.price} 
                                            email={me.email} 
                                            userId= {me.id}
                                            name={mimo.id} 
                                            description={mimo.description}
                                        />
                                    }
                                </div>
                            )
                        })}
                    </div>
                )
            }}
        </Query>
    )
}

export default Course;