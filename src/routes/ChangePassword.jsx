import React, { useState } from 'react';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";

function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const auth = getAuth();
    const user = auth.currentUser;

    const handlePasswordChange = (event) => {
        event.preventDefault();

        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        reauthenticateWithCredential(user, credential).then(() => {
            updatePassword(user, newPassword).then(() => {
                alert('Password updated successfully!');
            }).catch((error) => {
                console.log("Error updating password");
            });
        }).catch((error) => {
            console.log("Error reauthenticating");
        });
    };

    return (
        <div>
            <h2>Change Password</h2>
            <form onSubmit={handlePasswordChange}>
                <div>
                    <label>Current Password:</label>
                    <br />
                    <input
                        placeholder="Enter Current Password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </div>

                <hr />

                <div>
                    <label>New Password:</label>
                    <br />
                    <input
                        placeholder="Enter New Password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>

                <hr />
                <button type="submit">Change Password</button>
            </form>
        </div>
    );
}

export default ChangePassword;
