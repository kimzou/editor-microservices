import React from "react";

const Service = ({ name, result, query }) => {
    
    const { loading, error, data } = useQuery(query);

    if (loading) return <p>Loading...</p>;
    if (error.message.includes("server down")) {
      return <Error service={name} />
    }
  
    return (
      <>
        <h1>{name}:</h1>
        {(data && data.result) &&
          data.result.map(obj => 
            <li key={obj.id}>{obj.title} (id {obj.id})</li>
          )
        }
      </>
    )
}

export default Service;