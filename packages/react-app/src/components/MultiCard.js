import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Typography,
    CardMedia,
    CardContent,
    Card,
    TextField,
    CardActions,
    CardActionArea,
    Button,
    Alert
} from '@mui/material';
import {useCall, useContractFunction} from "@usedapp/core";
import { Contract } from "@ethersproject/contracts";
import { abis, addresses } from "@my-app/contracts";
import { ethers } from 'ethers';

export default function MultiCard({ nftId }) {
    const [nftData, setNftData] = useState({ image: '', title: 'Loading...', description: 'Loading...' });
    const [bidAmount, setBidAmount] = useState('');

    const auctionNFTContract = new Contract(addresses.ceaAuctionNFT, abis.auctionNFT);
    const auctionContract = new Contract(addresses.ceaAuction, abis.auction);

    const { state, send } = useContractFunction(auctionContract, 'bid', { transactionName: 'Bid' });

    const { value: tokenURI } = useCall({
        contract: auctionNFTContract,
        method: 'tokenURI',
        args: [nftId ? nftId[0]._hex : ''],
    }) ?? {};

    useEffect(() => {
        if (tokenURI) {
            axios.get(tokenURI)
                .then(response => {
                    const { image, title, description } = response.data;
                    setNftData({ image, title, description });
                })
                .catch(error => console.error('Error fetching NFT data:', error));
        }
    }, [tokenURI]);

    const handleBid = () => {
        const bidValue = ethers.utils.parseEther(bidAmount || '0');
        try{
            send({ value: bidValue });

        }catch (e) {

        }

    };

    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    image={nftData.image || 'https://via.placeholder.com/140'}
                    alt={nftData.title}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {nftData.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {nftData.description}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <TextField
                    label="Bid Amount (Ether)"
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    variant="outlined"
                    size="small"
                />
                <Button size="small" color="primary" onClick={handleBid}>Bid</Button>

            </CardActions>
            {state && state.errorMessage && <Alert key={alert.id} severity="warning">
                {state.errorMessage}
            </Alert>}
        </Card>
    );
}
