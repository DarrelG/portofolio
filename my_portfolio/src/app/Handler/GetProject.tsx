import supabase from "../supabaseClient";
import MsProject from "../Models/MsProject";

type GroupedProject = Record<string, MsProject[]>;

export default async function getProject(): Promise<GroupedProject> {
    const { data, error } = await supabase
        .from("MsProject")
        .select("*");

    if (error || !data) {
        console.error("Error fetching project:", error?.message);
        return {};
    }

    const grouped: GroupedProject = data.reduce((acc, item) => {
        if (!acc[item.projecttype]) {
            acc[item.projecttype] = [];
        }
        acc[item.projecttype].push(item);
        return acc;
    }, {} as GroupedProject);

    return grouped;
}