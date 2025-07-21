'use client'

import Image from 'next/image';
import '../../Styles/index.css';
import { useEffect, useState } from 'react'
import supabase from '../../supabaseClient'

interface MsUser {
    iduser: number;
    username: string;
    userrole: number;
    msprofile :{
        description : string;
        profilePict : string;
    };
}

interface MsExperience{
    idexperience : number;
    titlename : string;
    image : string;
}

export default function Dashboard() {
    const [profile, setProfile] = useState<MsUser | null>(null);
    const [experience, setExp] = useState<MsExperience[]>([]);

    useEffect(() => {
        async function fetchProfile() {
            const { data, error } = await supabase
                .from('msuser')
                .select('*, msprofile!fk_msuser(*)');

            if (error) {
                console.error('Error fetching profile:', error);
            } else {
                setProfile(data?.[0]);
            }
        }

        async function getExperience() {
            const { data, error } = await supabase
                .from("MsExperience")
                .select('*');

            if(error){
                console.error(error);
            }else{
                setExp(data);
            }
        }

        getExperience();
        fetchProfile();
    }, []);

    return (
        <div>
            <div className="container flex w-2/3 m-auto mt-30 gap-50">
                <div className="wrapperProfile">
                    {profile ? (
                        <>
                            <div className="fullName mb-20">
                                <h1 className='text-5xl'>{profile.username}</h1>
                            </div>
                            <div className="desc">
                                <p className='text-justify'>
                                    {profile.msprofile.description ?? 'No description available.'}
                                </p>
                            </div>
                        </>
                    ) : (
                        <p>Loading profile...</p>
                    )}
                </div>

                <div className="profilePhoto mt-15">
                    <Image src={profile?.msprofile.profilePict as string} alt="Logo" width={700} height={700} className='rounded-full' />
                </div>
            </div>

            <div className="wrapper w-4/5 m-auto mt-30">
                <div className="title">
                    <h2>Trail of knowledge</h2>
                </div>
                <div className="content flex flex-wrap gap-10 text-sm">
                    {experience.map((edu) => {
                        const isTarki = edu.image.includes("tarki");
                        return(
                            <div key={edu.idexperience} className='list flex gap-5 rounded-2xl p-3 w-full sm:w-1/2 md:w-5/12'>
                                <Image
                                    src={edu.image as string}
                                    alt='logo'
                                    width={isTarki ? 100 : 200}
                                    height={1}
                                    className='object-contain'
                                />
                                <p className="m-auto text-lg">{edu.titlename}</p>
                        </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
