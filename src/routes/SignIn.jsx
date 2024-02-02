import React, { useState } from "react";
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password).then((user) => {
            console.log(user);
            sessionStorage.setItem("accessToken", user.user.auth.lastNotifiedUid);
            navigate('/');
            location.reload();
            alert("Signed In successfully!");
        }).catch((error) => {
            console.log("ERROR SIGNIN: ", error);
            alert(error);
        })
    }

    return (
        <div>
            <h1> Sign In </h1>
            <form>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <br />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <br />
                <button type="submit" onClick={handleSubmit}> Submit </button>
            </form>
        </div>
    );
}

export default SignIn;