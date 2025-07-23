'use client'

import Dashboard from './Views/Dashboard/page';
import { useEffect, useState } from 'react';
import supabase from './supabaseClient';
import Cookies from 'js-cookie';

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      const { data: existingUser } = await supabase
                .from('msuser')
                .select('*')
                .eq('email', session?.user.email)
                .single();

      if (!existingUser) {
          await supabase
            .from('msuser')
            .insert({
              username: session?.user.user_metadata.full_name?.toString(),
              email: (session?.user.email)?.toString(),
              password: null,
              userrole: 1,
          });

          const newData = await supabase
            .from('msuser')
            .select('*')
            .eq('email', session?.user.email)
            .single()
          
          Cookies.set("userId", newData.data.iduser);
      }else{
        Cookies.set('userId', existingUser.iduser);
      }
    };

    getSession();
  }, []);
  return <Dashboard />
}