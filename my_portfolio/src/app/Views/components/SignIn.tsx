"use client";

import supabase from "@/app/supabaseClient";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Cookies from "js-cookie";
import bcrypt from "bcryptjs";

export default function Signin() {
    const { data: session } = useSession();
    const [unameInput, setunameInput] = useState("");
    const [emailInput, setemailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [showError, setShowError] = useState(false);

    if(session){
        window.location.assign("/Views/GetInTouch");
    }

    const handleSignIn = async () => {
        const usernameRegex = /^[A-Za-z0-9]{8,}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const isValidUsername = usernameRegex.test(unameInput);
        const isValidEmail = emailRegex.test(emailInput);

        if(isValidEmail && isValidUsername){
            const salt = await bcrypt.genSalt(10);
            const hashedPass = await bcrypt.hash(passwordInput, salt);

            await supabase
                .from('msuser')
                .insert({
                    username: unameInput,
                    email: emailInput,
                    password: hashedPass
                });

            const { data, error } = await supabase
                .from('msuser')
                .select(`*`)
                .or(`username.eq.${unameInput},email.eq.${emailInput}`)
                .single();

            Cookies.set('userId', data.iduser, { expires: 1 });
            Cookies.set('username', data.username, { expires: 1 });

            if (error) {
                console.log(error);
            } else {
                window.location.assign("/Views/GetInTouch");
            }
        }else{
            setShowError(true);
        }
    }

    return (
        <div className="inline-block w-3/4 bg-gray-400/30 p-10 rounded-xl">
            <div>
                <p className="text-5xl">SignIn</p>
                <br />
                <p className="text-xl">Username</p>
                <input
                    className="bg-gray-600 resize-none h-15 w-full rounded mt-5 content-center pl-5 overflow-hidden"
                    placeholder="Username or Email"
                    value={unameInput}
                    onChange={(e) => setunameInput(e.target.value)}
                />
                <br />
                <br />
                <p className="text-xl">Email</p>
                <input
                    className="bg-gray-600 resize-none h-15 w-full rounded mt-5 content-center pl-5 overflow-hidden"
                    placeholder="Username or Email"
                    value={emailInput}
                    onChange={(e) => setemailInput(e.target.value)}
                />
                <br />
                <br />
                <p className="text-xl">Password</p>
                <input
                    className="bg-gray-600 resize-none h-15 w-full rounded mt-5 content-center pl-5 overflow-hidden"
                    placeholder="Password (Password will be hased)"
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                />
                <br /><br />

                {showError && (
                    <div className="mt-4 text-red-600 font-semibold">
                        Min 8 letter for Username, Email had to contain &apos;@&apos; and &apos;.&apos;.
                    </div>
                )}

                <button onClick={handleSignIn} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 cursor-pointer">SignIn</button>
            </div>
        </div>
    );
}
