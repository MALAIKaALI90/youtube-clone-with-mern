import React from 'react'
import Sidebar from '../components/SideNavbar'
import HomePage from '../components/HomePage'



const Home = ({SidebarNav}) => {

  return (
    <div>
  <Sidebar Sidebar={SidebarNav} />
  <HomePage  Sidebar={SidebarNav}/>

    </div>
  )
}

export default Home
