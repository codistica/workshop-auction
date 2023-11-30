import React from 'react';
import { useEthers, useEtherBalance } from '@usedapp/core';
import { Typography } from '@mui/material';
import { formatEther } from 'ethers/lib/utils';

const BalanceComponent = () => {
    const { account } = useEthers();
    const balance = useEtherBalance(account);

    // Format balance to two decimal places
    const formattedBalance = balance ? parseFloat(formatEther(balance)).toFixed(2) : '...';

    return (
        <Typography variant="body1">
            {account && `Balance: ${formattedBalance} ETH`}
        </Typography>
    );
};

export default BalanceComponent;
