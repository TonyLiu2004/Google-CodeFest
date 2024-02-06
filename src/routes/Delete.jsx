import React, { useState } from 'react';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, deleteUser } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

function DeleteAccount() {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const auth = getAuth();

    const reauthenticate = (currentPassword) => {
        const user = auth.currentUser;
        const cred = EmailAuthProvider.credential(user.email, currentPassword);
        return reauthenticateWithCredential(user, cred);
    };

    const handleDeleteAccount = () => {
        reauthenticate(password).then(() => {
            const user = auth.currentUser;
            deleteUser(user).then(() => {
                //console.log("Account deleted");
                sessionStorage.removeItem("accessToken");
                navigate('/');
                location.reload();
                alert("Account deleted successfully!")
            }).catch(() => {
                console.error("Error deleting account");
            });
        }).catch(() => {
            console.error("Reauthentication failed");
        });
    };

    return (
        <div>
            <h2>Please enter your password to confirm account deletion:</h2>

            <input
                placeholder="Enter Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <br />
            <hr />
            <button onClick={handleDeleteAccount}>Delete My Account</button>
        </div>
    );
}

export default DeleteAccount;
