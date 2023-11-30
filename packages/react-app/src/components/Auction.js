import React, { useState, useEffect } from 'react';
import {useCalls, useContractFunction} from '@usedapp/core';
import {Typography, Container, Button, Box, Alert} from '@mui/material';
import MultiCard from './MultiCard';

import { ethers } from 'ethers';
import BidNotifications from "./Bids";
import {Contract} from "@ethersproject/contracts";
import {abis, addresses} from "@my-app/contracts";

/**
 * Converts a token balance to a human-readable format (Ether or Wei).
 * Assumes that if the balance has more than 15 digits, it's in Wei.
 * @param {ethers.BigNumber} tokenBalance - The token balance in Wei.
 * @return {string} - The formatted balance.
 */
function formatTokenBalance(tokenBalance) {
    console.log(tokenBalance)
    if (!tokenBalance) {
        return 'Loading...';
    }

    const balanceString = tokenBalance.toString();
    const isWei = balanceString.length > 15; // More than 1 quadrillion (1e15) is likely in Wei

    if (isWei) {
        return `${ethers.utils.formatEther(tokenBalance[0])} Ether`;
    } else {
        return `${balanceString} Wei`; // Assuming it's already in a readable format
    }
}

export default function ActionAreaCard() {
    // STATE
    const [timer, setTimer] = useState('');
    const [auctionLive, setAuctionLive] = useState(false);

    // CONTRACT

    const contract = new Contract(addresses.ceaAuction, abis.auction);
    const { state, send } = useContractFunction(contract, 'end', { transactionName: 'End' });


    // CALLS TO CONTRACT
    // Use useCalls to merge the calls
    const results = useCalls([
        { contract, method: 'started', args: [] },
        { contract, method: 'highestBid', args: [] },
        { contract, method: 'nftId', args: [] },
        { contract, method: 'endAt', args: [] }
    ]) ?? [];

    // Destructure the results
    const [startedResult, highestBidResult, nftIdResult, endAtResult] = results;

    // Extract values and errors
    const { error: startedError, value: started } = startedResult ?? {};
    const { error: highestBidError, value: highestBid } = highestBidResult ?? {};
    const { error: nftIdError, value: nftId } = nftIdResult ?? {};
    const { error: endAtError, value: endAt } = endAtResult ?? {};

    // METHODS
    const checkStarted = (started) => {
        return started && started[0];
    }
    const endBid = () => {
        send();
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (endAt && checkStarted(started)) {
                const now = new Date().getTime();
                const countDownDate = new Date(endAt[0] * 1000).getTime();
                const distance = countDownDate - now;

                if (distance < 0) {
                    clearInterval(interval);
                    setTimer('Auction ended');
                    setAuctionLive(false);
                } else {
                    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    setTimer(`${hours}h ${minutes}m ${seconds}s`);
                    setAuctionLive(true);
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [endAt, started]);

    return (
        <Container style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Typography variant="h2" color="text.secondary" align="center">
                {checkStarted(started) ? "Active Auction" : "No Active Auction"}
                <Typography variant="h4" color="text.secondary" align="center">
                    {timer}
                </Typography>
            </Typography>


            <Typography variant="h5" color="text.secondary" align="center">
                {checkStarted(started) ? "Submit Your Bids Now!" : "As soon as an auction is active it will appear here"}
            </Typography>
            {checkStarted(started) && <Typography variant="h5" color="text.secondary" align="center">
                Current Bid: {highestBid ? `${formatTokenBalance(highestBid)}` : 'Loading...'}
                {startedError && <p>Error: {startedError.message}</p>}
            </Typography>}
            {auctionLive ?
                checkStarted(started) && <MultiCard nftId={nftId}/> :
                checkStarted(started) && <Button variant="contained"  color="secondary" onClick={endBid}>End</Button>
            }
            {state && state.errorMessage && <Alert key={alert.id} severity="warning">
                {state.errorMessage}
            </Alert>}
        </Container>
    );
}
