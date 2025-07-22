import supabase  from "../../supabaseClient"

interface Project {
    projectid: number;
    projecttitle: string;
    projectdesc: string;
    projectperiod: string;
    projecttype: string;
}

export default async function RecentWork() {
    const { data, error } = await supabase
        .from("MsProject")
        .select("*") as unknown as { data: Project[]; error : string};

    if (error) return <p>Error Loading Project</p>

    const grouped = data.reduce((acc, item) => {
        if(!acc[item.projecttype]) acc[item.projecttype] = []
        acc[item.projecttype].push(item)
        return acc
    }, {} as Record<string, typeof data>)


    return (
        <div className="p-4 space-y-10 w-2/3 m-auto mt-30 gap-50">
            {Object.entries(grouped).map(([projecttype, items]) => (
                <div key={projecttype}>
                    <h2 className="text-2xl font-bold mb-2">{projecttype}</h2>
                    <div className="space-y-4">
                        {items.map((exp) => (
                            <div key={exp.projectid}>
                                <h3 className="text-xl">{exp.projecttitle}</h3>
                                <p className="text-sm text-green-300">{exp.projectperiod}</p>
                                <p className="whitespace-pre-line text-justify">| {exp.projectdesc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
