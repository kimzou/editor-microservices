import React from "react";
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const GET_COURSE = gql`
    query {
        getCourse(id: "5e53973e1c9d440000c08d9b") {
            title
            mimos {
                title
                description
            }
        }
    }
`;

const Course = () => {
    const { data } = useQuery(GET_COURSE, {
        // onCompleted(data) {
        //     console.log("complete", data)
        // }
    });
    // console.log(data);
    return(
        <div>
            <h1>{data && data.getCourse && data.title}</h1>
            {data && data.getCourse && data.getCourse.mimos.map(mimo => {
                return <li key={mimo.id}>{mimo.title}</li>
            })}
        </div>
    );

}

export default Course;