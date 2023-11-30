import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Box, Backdrop, CircularProgress } from '@mui/material';
import pinJsonToIPFS from "../utils/uploadToIPFS";


export default function JsonUploadComponent() {
    const [imageURL, setImageURL] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);
    const [ipfsUrl, setIpfsUrl] = useState('');

    const handleImageURLChange = (event) => setImageURL(event.target.value);
    const handleTitleChange = (event) => setTitle(event.target.value);
    const handleDescriptionChange = (event) => setDescription(event.target.value);

    const handleSubmit = async () => {
        const jsonData = {
            image: imageURL,
            title: title,
            description: description
        };
        setUploading(true);
        try {
            const response = await pinJsonToIPFS(jsonData);
            const url = `https://gateway.pinata.cloud/ipfs/${response.IpfsHash}`;
            setIpfsUrl(url);
        } catch (error) {
            console.error('Error uploading JSON to IPFS:', error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h6" gutterBottom>
                Upload Data to IPFS via Pinata
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
                <TextField label="Image URL" variant="outlined" value={imageURL} onChange={handleImageURLChange} />
                <TextField label="Title" variant="outlined" value={title} onChange={handleTitleChange} />
                <TextField label="Description" variant="outlined" multiline rows={4} value={description} onChange={handleDescriptionChange} />
                <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
                {ipfsUrl && (
                    <Typography variant="body1" color="text.secondary">
                        IPFS URL: <a href={ipfsUrl} target="_blank" rel="noopener noreferrer">{ipfsUrl}</a>
                    </Typography>
                )}
            </Box>
            <Backdrop open={uploading} style={{ zIndex: 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Container>
    );
}
