'use client'
import React from 'react'
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function AboutUs() {
  return (
    <>
            <Navbar />
            <div className="flex flex-col items-start px-6 md:px-16 lg:px-32 bg-orange-50">
                <div className="flex flex-col items-end pt-12">
                    <p className="text-2xl font-medium">About Us</p>
                    <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
                </div>
            </div>
            <Footer />
    </>
  )
}

export default AboutUs