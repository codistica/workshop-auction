import React from "react";
import {shortenAddress, useEthers, useLookupAddress} from "@usedapp/core";
import Button from '@mui/material/Button';
import Typography from "@mui/material/Typography";

export default function WalletButton() {

    const { ens } = useLookupAddress();
    const { account, activateBrowserWallet, deactivate, error } = useEthers();

    let rendered;
    if (ens) {
        rendered = ens;
    } else if (account) {
        rendered = shortenAddress(account);
    } else {
        rendered = "";
    }

    return (
        <Button
            variant="contained"
            onClick={() => {
                if (!account) {
                    activateBrowserWallet();
                } else {
                    deactivate();
                }
            }}
        >
            <Typography textAlign="center">
                {rendered === "" ? "Connect Wallet" : rendered}
            </Typography>
        </Button>
);
}
