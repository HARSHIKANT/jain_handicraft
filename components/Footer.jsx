import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 text-gray-500">
        <div className="w-4/5">
          <Image className="w-28 md:w-32" src={assets.logo} alt="logo" />
          <p className="mt-6 text-sm">
          Established in the year <strong>1970</strong>, we <strong>"Jain Handicraft Emporium"</strong> are the leading Manufacturer of a wide range of Decorative diya, Brass Bowl Spoong Tray Set, etc.
          We are a leading Manufacturer of Brass 4 Bowls 4 Spoon Tray Set, Golden Brass Bowl Spoon Tray Set, Silver Plated Bowl Spoon Tray Set, Lotus Brass Bowl Spoon Set and Golden Silver Bowl Spoon Tray Brass Set from Moradabad, India.
          </p>
        </div>

        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Jain Handicraft Emporium</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a className="hover:underline transition" href="#">Home</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">About us</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">Contact us</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">Privacy policy</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p><span style={{color: "black",fontWeight: "bold", fontSize: "22px"}}>✆</span> 8043855635</p>
              <p>contact @ Jain Handicraft Emporium</p>
              <p><span style={{color: "black",fontWeight: "bold", fontSize: "22px"}}>📍</span> Shri Ram Vihar Colony, Court Compound, Civil Lines, Moradabad-244001, Uttar Pradesh, India</p>
            </div>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm">
        Copyright 2025 © Jain Handicraft Emporium All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;