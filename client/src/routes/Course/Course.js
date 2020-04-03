import React, { useState } from "react";
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import StripeCheckout from 'react-stripe-checkout';
import { Mutation, Query } from 'react-apollo';
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

// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUB_KEY);

const BuyMimo =  ({ userId, price, email, name, description }) => {
    const [checkoutSession, { data }] = useMutation(CREATE_CHECKOUT_SESSION, {
        onError(error) { console.error(error) },
        async onCompleted({ checkoutSession }) {
            // console.log("chek", checkoutSession)
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
    
    // const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUB_KEY
    // return (
    //     <Mutation mutation={CREATE_CHECKOUT_SESSION} onCompleted={(data) => console.log("data", {data})}>
    //         {async (checkoutSession, { data }) => (
    //             <button onClick={() => {
    //                 checkoutSession({ 
    //                     variables: { 
    //                         name: name, 
    //                         description: description, 
    //                         amount: price, 
    //                         successUrl: "http://localhost:3000/success", 
    //                         cancelUrl: "http://localhost:3000" 
    //                     } 
    //                 })
    //             }}>
    //                 Acheter pour {price}
    //             </button>
                
    //         )}
    //     </Mutation>
    //)
    // const buying = async () => {
        // stripe.redirectToCheckout({
        //     customerEmail: email,
        //     items: [{
        //         sku: 'sku_H1AnMKLnLbIHia',
        //         quantity: 1
        //     }],
        //     successUrl: 'http://localhost:3000/course/success',
        //     cancelUrl: 'http://localhost:3000/course'
    //   });
    //}

    
    
    // return(
    //     <Mutation 
    //         mutation={BUY_MIMO}
    //     >
    //     {(mutate, { data }) => (
    //         <StripeCheckout 
    //             token={async token => {
    //                 const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUB_KEY);

    //                 console.log({token});
    //                 console.log(typeof price)
    //                 const stripeToken = await mutate({ variables: { mimoId: id, token: token.id, amount: price } })
    //                 console.log({stripeToken});
    //                 console.log("dtata", await data)
                    
    //             }}
    //             stripeKey={process.env.REACT_APP_STRIPE_PUB_KEY}
    //             label={`Payer ${price} euros`}
    //             email={email}
    //             amount={price * 100}
    //             currency="EUR"
    //         />
    //     )}
    //     </Mutation>
    // )
//}


const Course = () => {
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
                            console.log({mimo})
                            return (<div key={mimo.id} style={{ margin: 20, border: "solid 2px grey" }}>
                                    {(index === 0 || productsId.includes(mimo.id))
                                        ? <Link to="#">{mimo.title}</Link>
                                        : mimo.title
                                    }
                                    <br/>
                                    {mimo.description}<br/>
                                    {mimo.price}<br/>
                                    {!productsId.includes(mimo.id) && 
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