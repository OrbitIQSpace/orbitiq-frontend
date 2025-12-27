import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Predictions = () => {
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/predictions/25544')
      .then(response => setPredictions(response.data))
      .catch(error => console.error('Error fetching predictions:', error));
  }, []);

  return (
    <div>
      <h2>Predictions for ISS (NORAD ID: 25544)</h2>
      <ul>
        {predictions.map(data => (
          <li key={data.id}>
            Estimated Lifespan: {data.estimated_lifespan.toFixed(2)} days, 
            Action: {data.suggested_action}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Predictions;