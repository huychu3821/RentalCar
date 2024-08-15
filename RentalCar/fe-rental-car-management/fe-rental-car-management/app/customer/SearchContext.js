import React, { createContext, useState } from 'react';

const LocationContext = createContext();

const LocationProvider = ({ children }) => {
    const [locationState, setLocationState] = useState({
        pickUpLocation: '', 
        pickUpDate: '', 
        dropOffDate: '', 
        pickUpTime: '', 
        dropOffTime: ''
    });

    return (
        <LocationContext.Provider value={{ locationState, setLocationState }}>
            {children}
        </LocationContext.Provider>
    );
};

export { LocationContext, LocationProvider };