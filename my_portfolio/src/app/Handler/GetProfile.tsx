import supabase from "../supabaseClient";

export default async function getProfile() {
    const { data } = await supabase
        .from('msprofile')
        .select('*, fk_profile_user(iduser, username, userrole)')
        .single();

    return {
        description: data.description,
        profilePict: data.profilePict,
        MsUser: {
            iduser: data.fk_profile_user.iduser,
            username: data.fk_profile_user.username,
            userrole: data.fk_profile_user.userrole,
        }
    };
};
