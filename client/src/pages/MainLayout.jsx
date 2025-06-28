import Navbar from '@/components/Navbar'
import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from './Footer.jsx'
import Testimonial from './Testimonial.jsx'
import ReportIssue from './user/ReportIssue.jsx'
import { useLoadUserQuery } from '@/features/api/authApi.js'

const MainLayout = () => {
  useLoadUserQuery();
  return (
    <div className='flex flex-col min-h-screen'>
        <Navbar/>
        <div className='flex-1 mt-16'>
            <Outlet/>
        </div>
        <Testimonial/>
        <Footer/>
    </div>
  )
}

export default MainLayout;