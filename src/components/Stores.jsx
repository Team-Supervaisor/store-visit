import React from 'react'
import logo from '../assets/logo.png'
export default function Stores() {
  return (
    <>
    <div className="flex items-center space-x-2">
    <img src={logo} className="w-[50px] h-[50px]" alt="Logo" />
    <span className="text-xl font-semibold text-black">Store Visit Tracking</span>
  </div>
  </>
  )
}
