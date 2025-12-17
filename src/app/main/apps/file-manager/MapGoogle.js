import React from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';

const MapComponent = ({ google }) => {
  const mapStyles = {
    width: '100%',
    height: '300px',
  };

  return (
    <Map
      google={google}
      mapTypeId="satellite"
      zoom={100}
      style={mapStyles}
      initialCenter={{
        lat: 37.7749,
        lng: -122.4194,
      }}
    />
  );
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBtmA2MsfljS60NA3c_ljiVXC5gvv8TIFg',
})(MapComponent);
