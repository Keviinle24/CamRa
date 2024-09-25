import React from 'react';
import axios from 'axios';
interface UserData {
    email: string;
    password: string;
}


function Logout() {
    const onSubmit = async () => {
        try {
            const response = await axios.get('/api/logout');
            if (response.status === 200) {
                console.log("good")
            }
        } catch (error) {
            console.log(error);
        }
    }
    const onSubmitDelete = async () => {
        try {
            const response = await axios.delete('/api/deleteAccount');
            if (response.status === 200) {
                console.log("good")
            }
        } catch (error) {
            console.log(error);
        }
    }

    return <>
        <button onClick={onSubmit}>Logout</button>
        <button onClick={onSubmitDelete}>Delete</button>
    </>
}

export default Logout;
