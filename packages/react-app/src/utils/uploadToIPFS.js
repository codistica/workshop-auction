import axios from 'axios';

const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5MmYwYWMyNi1kZTRlLTRiODEtOGY3Mi01OGZkZWQ1MTE4MTQiLCJlbWFpbCI6ImRhdmlkLnZpdHRvcmlAY29kaXN0aWNhLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIwYjM0ZmE5Njg4OWE2ZWRhZjRhOSIsInNjb3BlZEtleVNlY3JldCI6ImYyZDU3YjRhNjUyMjdiMjhkYjFiMzEzZWZiZjQzMjk4Yjc1ZDU4NWY1YjQxYjFjMWU4MjAzMmFlNzI0OTZkZGEiLCJpYXQiOjE3MDEyNjkwMjZ9.dYu1TlFBaTOY73AHy67bw-G4ruyCSuxzll6FCll2Mbg"; // Replace with your JWT token

const pinJsonToIPFS = async (jsonData) => {
    try {
        const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", jsonData, {
            headers: {
                'Authorization': `Bearer ${JWT}`
            }
        });
        console.log(res.data);
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export default pinJsonToIPFS;
