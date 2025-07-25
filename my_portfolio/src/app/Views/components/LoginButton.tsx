"use client";

import supabase from "@/app/supabaseClient";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Cookies from "js-cookie";
import bcrypt from "bcryptjs";

export default function LoginButton() {
    const { data: session } = useSession();
    const [dataInput, setDataInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");

    if(session){
        window.location.assign("/Views/GetInTouch");
    }

    const handleLogin = async () => {
        const { data, error } = await supabase
                .from('msuser')
                .select(`*`)
                .or(`username.eq.${dataInput},email.eq.${dataInput}`)
                .single();
        
        if(await bcrypt.compare(passwordInput, data.password)){
            Cookies.set('userId', data.iduser, { expires: 1 });
            Cookies.set('username', data.username, { expires: 1 });
            window.location.assign("/Views/GetInTouch");
        }else{
            console.log(error);
        }
    }

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `https://kqpgdwowjsvnsnehqqui.supabase.co/auth/v1/callback`
            }
        })

        if (error) {
            console.error('Google login failed:', error.message);
        } else {
            console.log('Redirecting to Google login...');
        }
    }

    return (
        <div className="inline-block w-3/4 bg-gray-400/30 p-10 rounded-xl">
                <div className="float-left">
                    <div>
                        <p className="text-4xl mb-20">Welcome To my Portfolio</p>
                    </div>
                    <div className="flex text-xl">
                        <p>Do not have account? Sign in</p> &nbsp; <a href="/Views/SignIn" className="underline">Here</a> &nbsp; or
                    </div>
                    <button onClick={handleGoogleLogin} className="text-xl cursor-pointer underline">Login with Google</button>
                </div>
                <div className="float-right text-right w-2/4">
                    <p className="text-5xl">Login</p>
                    <br />
                    <p className="text-xl">Username or Email</p>
                    <input
                        className="bg-gray-600 resize-none h-15 w-full rounded mt-5 content-center pl-5 overflow-hidden"
                        placeholder="Username or Email"
                        value={dataInput}
                        onChange={(e) => setDataInput(e.target.value)}
                    />
                    <br />
                    <br />
                    <p className="text-xl">Password</p>
                    <input
                        className="bg-gray-600 resize-none h-15 w-full rounded mt-5 content-center pl-5 overflow-hidden"
                        placeholder="Password"
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                    />
                    <br /><br />

                    <button onClick={handleLogin} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 cursor-pointer">Login</button>
                </div>
            </div>
    );
}