import React, { useState } from "react";
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function SignUp() {
    let navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password == confirmPassword) {
            createUserWithEmailAndPassword(auth, email, password).then((user) => {
                console.log(user);
                navigate('/');
                location.reload();
                alert("Signed up successfully! Please Sign In to continue");
            }).catch((error) => {
                console.log("ERROR SIGNUP: ", error);
                alert(error);
            })
        }
        else {
            alert("Passwords do not match");
        }
    }
    return (
        <div>
            <h1> Sign Up </h1>
            <p>Already have an account? <a href="/signin">Sign In</a></p>
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

                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                />

                <br />
                <hr />

                <button type="submit" onClick={handleSubmit}> Sign Up </button>
            </form>
        </div>
    );
}

export default SignUp;