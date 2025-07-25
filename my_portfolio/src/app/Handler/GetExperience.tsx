import supabase from "../supabaseClient";

export default async function getExperience() {
    const { data } = await supabase
        .from("MsExperience")
        .select('*');
        
    return data;
};