import React, { useState } from "react";
import { db, auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';

function SignUp() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div>
            <h1> Sign Up </h1>
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
            </form>
        </div>
    );
}

export default SignUp;