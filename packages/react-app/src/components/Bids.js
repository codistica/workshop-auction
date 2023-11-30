import React, { useState, useEffect } from 'react';
import { abis, addresses } from '@my-app/contracts';
import { Alert } from '@mui/material';
import { ethers } from 'ethers';
import { useContractEvent } from "../utils/useContractEvent";

export default function BidNotifications() {
    const bidEvents = useContractEvent(addresses.ceaAuction, abis.auction, 'Bid');
    const [activeAlerts, setActiveAlerts] = useState([]);

    // Function to format address
    const formatAddress = (address) => `${address.slice(0, 6)}...${address.slice(-4)}`;

    // Function to format BigNumber
    const formatBidAmount = (bigNumber) => ethers.utils.formatEther(bigNumber);

    useEffect(() => {
        if (bidEvents) {
            // Add new bids to the active alerts
            const newAlerts = bidEvents.map((bid, index) => ({
                id: Date.now() + index, // Unique id for each alert
                address: bid[0],
                amount: bid[1]
            }));
            setActiveAlerts(prev => [...prev, ...newAlerts]);

            // Set a timeout to remove each alert after 5 seconds
            newAlerts.forEach(alert => {
                setTimeout(() => {
                    setActiveAlerts(prev => prev.filter(a => a.id !== alert.id));
                }, 5000);
            });
        }
    }, [bidEvents]);

    return (
        <>
            {activeAlerts.map((alert) => (
                <Alert key={alert.id} severity="info">
                    Bid from {formatAddress(alert.address)} of {formatBidAmount(alert.amount)} ETH
                </Alert>
            ))}
        </>
    );
}
