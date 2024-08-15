'use client';
import { createContext, useContext, useState } from 'react';

const AppContext = createContext({
    sessionToken: '',
    setSessionToken: (sessionToken) => {},
});

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

export default function AppProvider({ children, inititalToken = '' }) {
    const [sessionToken, setSessionToken] = useState(inititalToken);
    return (
        <AppContext.Provider value={{ sessionToken, setSessionToken }}>
            {children}
        </AppContext.Provider>
    );
}
