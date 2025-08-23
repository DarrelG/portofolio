import getProject from "@/app/Handler/GetProject";
import MsProject from "@/app/Models/MsProject";

const RecentWork = async () => {
    const grouped = await getProject();

    return (
        <div className="p-4 space-y-10 w-2/3 m-auto mt-30 gap-50">
            {Object.entries(grouped).map(([projecttype, items]) => (
                <div key={projecttype}>
                    <h2 className="text-2xl font-bold mb-2">{projecttype}</h2>
                    <div className="space-y-4">
                        {items.map((exp: MsProject) => (
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
}; 

export default RecentWork;