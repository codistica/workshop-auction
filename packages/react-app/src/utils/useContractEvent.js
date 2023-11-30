import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useEthers } from '@usedapp/core';

export const useContractEvent = (contractAddress, contractABI, eventName, provider) => {
    const [events, setEvents] = useState([]);
    const { library } = useEthers();

    useEffect(() => {
        if (library) {
            const contract = new ethers.Contract(contractAddress, contractABI, library.getSigner());
            contract.on(eventName, (...args) => {
                setEvents(currentEvents => [...currentEvents, args]);
            });

            return () => {
                contract.removeAllListeners(eventName);
            };
        }
    }, [contractAddress, contractABI, eventName, library]);

    return events;
};
