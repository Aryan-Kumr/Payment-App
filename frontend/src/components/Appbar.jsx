export const Appbar = () => {
    return <div className="shadow h-14 flex justify-between">
        <div className="flex flex-col font-bold text-xl justify-center h-full ml-4">
            Payment App
        </div>
        <div className="flex">
            <div className="flex flex-col justify-center h-full mr-4">
                Hello {localStorage.getItem("firstname")} {localStorage.getItem("lastname")}
            </div>
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                {localStorage.getItem("firstName")[0]} {localStorage.getItem("lastName")[0]}
                </div>
            </div>
        </div>
    </div>
}