import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import InstallPWA from '../common/InstallPWA'

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0a0a0a] transition-colors duration-300 px-safe">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <InstallPWA />
    </div>
  )
}

export default MainLayout
