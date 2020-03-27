import React from 'react';

const ErrorService = ({ service }) => {
    return (
      <p style={{ color: "red" }}>
        <i>Service {service} down</i>
      </p>
    )
}

export default ErrorService;