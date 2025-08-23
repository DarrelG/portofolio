'use client'

import Image from 'next/image';
import '../../Styles/index.css';
import { useEffect, useState } from 'react'
import MsProfile from '@/app/Models/MsProfile';
import MsExperience from '@/app/Models/MsExperience';
import getProfile from '@/app/Handler/GetProfile';
import getExperience from '@/app/Handler/GetExperience';

const Dashboard = () => {
    const [profile, setProfile] = useState<MsProfile | null>(null);
    const [experience, setExp] = useState<MsExperience[]| null>(null);

    useEffect(() => {
        const getData = async () => {
            const profile = await getProfile();
            setProfile(profile);
        };
        
        const getExp = async () => {
            const experience = await getExperience();
            setExp(experience);
        };

        getExp();
        getData();
    }, []);

    return (
        <div>
            <div className="container flex w-2/3 m-auto mt-30 gap-50">
                <div className="wrapperProfile">
                    {profile ? (
                        <>
                            <div className="fullName mb-20">
                                <h1 className='text-5xl'>{profile.MsUser?.username}</h1>
                            </div>
                            <div className="desc">
                                <p className='text-justify'>
                                    {profile.description ?? 'No description available.'}
                                </p>
                            </div>
                        </>
                    ) : (
                        <p>Loading profile...</p>
                    )}
                </div>

                <div className="profilePhoto mt-15">
                    <Image src={profile?.profilePict as string} alt="Logo" width={1000} height={1000} className='rounded-full' />
                </div>
            </div>

            <div className="wrapper w-4/5 m-auto mt-30">
                <div className="title">
                    <h2>Trail of knowledge</h2>
                </div>
                <div className="content flex flex-wrap gap-10 text-sm">
                    {experience?.map((edu) => {
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

export default Dashboard;