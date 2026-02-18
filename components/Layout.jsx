import Navbar from "./Navbar"
import Sidebar from "./Sidebar"

function Layout({children}){
    return(
        <div className="site-container min-h-screen bg-slate-900 text-white flex flex-col">
            <Navbar />
            <div className="site-main flex flex-1 w-full">
                <Sidebar />
                <main className="site-content flex-1 overflow-auto bg-gradient-to-b from-transparent to-slate-900">
                    {children}
                </main>
            </div>
        </div>
    )
}
export default Layout