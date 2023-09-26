
import MobileSidebar from "./components/mobile-sidebar"
import Navbar from "./components/navbar"
import Sidebar from "./components/sidebar"

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="h-full">
            <Navbar />
            <div className="flex w-full items-start ">
                <div className="hidden lg:flex">
                    <Sidebar />
                </div>
                <main className="pl-10 w-full">
                    {children}
                </main>
            </div>

        </div>
    )
}

export default RootLayout