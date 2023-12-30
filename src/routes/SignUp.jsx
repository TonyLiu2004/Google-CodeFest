import React, { useState } from "react";
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function SignUp() {
    let navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password).then((user) => {
            console.log(user); //signed up successfully
            navigate('/');
            location.reload();
            alert("Signed up successfully! Please Sign In to continue");
        }).catch((error) => {
            console.log("ERROR SIGNUP: ", error);
            alert(error);
        })
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
                <button type="submit" onClick={handleSubmit}> Submit </button>
            </form>
        </div>
    );
}

export default SignUp;