"use client"
import React, { useState, useRef, useEffect } from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon } from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";

const Navbar = () => {

  const { isSeller, router, user, products } = useAppContext();
  const { openSignIn } = useClerk();

  // Search state
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef(null)
  const mobileSearchRef = useRef(null)

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target) &&
        mobileSearchRef.current && !mobileSearchRef.current.contains(e.target)) {
        setShowSearch(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter products
  const filteredProducts = searchQuery.trim()
    ? products.filter(p => {
      const q = searchQuery.toLowerCase()
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      )
    }).slice(0, 6)
    : []

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/all-products?search=${encodeURIComponent(searchQuery.trim())}`)
      setShowSearch(false)
      setSearchQuery('')
    }
  }

  const goToProduct = (productId) => {
    router.push(`/product/${productId}`)
    setShowSearch(false)
    setSearchQuery('')
    scrollTo(0, 0)
  }

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-white bg-red-900 relative">
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => router.push('/')}
        src={assets.logo}
        alt="logo"
      />
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">
          Home
        </Link>
        <Link href="/all-products" className="hover:text-gray-900 transition">
          Shop
        </Link>
        <Link href="/about-us" className="hover:text-gray-900 transition">
          About Us
        </Link>
        <Link href="/contact-us" className="hover:text-gray-900 transition">
          Contact
        </Link>

        {isSeller && <button onClick={() => router.push('/seller')} className="text-xs border px-4 py-1.5 rounded-full hover:text-gray-900">Seller Dashboard</button>}

      </div>

      <ul className="hidden md:flex items-center gap-4 ">
        {/* Desktop search */}
        <div ref={searchRef} className="relative">
          <button onClick={() => { setShowSearch(!showSearch) }}>
            <Image className="w-4 h-4 invert brightness-0" src={assets.search_icon} alt="search icon" />
          </button>

          {showSearch && (
            <div className="absolute right-0 top-10 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 overflow-hidden">
              <form onSubmit={handleSearchSubmit} className="flex items-center border-b border-gray-200">
                <Image className="w-4 h-4 ml-3 opacity-40" src={assets.search_icon} alt="" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full py-3 px-3 text-sm text-gray-800 outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery('')} className="pr-3 text-gray-400 hover:text-gray-600 text-lg">&times;</button>
                )}
              </form>

              {filteredProducts.length > 0 && (
                <div className="max-h-80 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <button
                      key={product._id}
                      onClick={() => goToProduct(product._id)}
                      className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-orange-50 transition text-left"
                    >
                      <div className="w-10 h-10 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
                        <Image src={product.image[0]} alt={product.name} className="w-full h-full object-cover" width={40} height={40} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 font-medium truncate">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.category}</p>
                      </div>
                      <p className="text-sm font-medium text-orange-600 flex-shrink-0">₹{product.offerPrice}</p>
                    </button>
                  ))}
                  <button
                    onClick={handleSearchSubmit}
                    className="w-full py-2.5 text-center text-xs text-orange-600 hover:bg-orange-50 transition border-t border-gray-100 font-medium"
                  >
                    View all results →
                  </button>
                </div>
              )}

              {searchQuery.trim() && filteredProducts.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-6">No products found</p>
              )}
            </div>
          )}
        </div>

        {user ?
          <>
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action label="Home" labelIcon={<HomeIcon />} onClick={() => router.push('/')} />
              </UserButton.MenuItems>
              <UserButton.MenuItems>
                <UserButton.Action label="Products" labelIcon={<BoxIcon />} onClick={() => router.push('/all-products')} />
              </UserButton.MenuItems>
              <UserButton.MenuItems>
                <UserButton.Action label="Cart" labelIcon={<CartIcon />} onClick={() => router.push('/cart')} />
              </UserButton.MenuItems>
              <UserButton.MenuItems>
                <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={() => router.push('/my-orders')} />
              </UserButton.MenuItems>
            </UserButton>
          </>
          :
          <button onClick={openSignIn} className="flex items-center gap-2 hover:text-gray-900 transition">
            <Image className="invert brightness-0" src={assets.user_icon} alt="user icon" />
            Account
          </button>}
      </ul>

      <div className="flex items-center md:hidden gap-3">
        {/* Mobile search button */}
        <button onClick={() => setShowSearch(!showSearch)}>
          <Image className="w-4 h-4 invert brightness-0" src={assets.search_icon} alt="search icon" />
        </button>

        {isSeller && <button onClick={() => router.push('/seller')} className="text-xs border px-4 py-1.5 rounded-full">Seller Dashboard</button>}
        {user ?
          <>
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action label="Home" labelIcon={<HomeIcon />} onClick={() => router.push('/')} />
              </UserButton.MenuItems>
              <UserButton.MenuItems>
                <UserButton.Action label="Products" labelIcon={<BoxIcon />} onClick={() => router.push('/all-products')} />
              </UserButton.MenuItems>
              <UserButton.MenuItems>
                <UserButton.Action label="Cart" labelIcon={<CartIcon />} onClick={() => router.push('/cart')} />
              </UserButton.MenuItems>
              <UserButton.MenuItems>
                <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={() => router.push('/my-orders')} />
              </UserButton.MenuItems>
            </UserButton>
          </>
          :
          <button onClick={openSignIn} className="flex items-center gap-2 hover:text-gray-900 transition">
            <Image className="invert brightness-0" src={assets.user_icon} alt="user icon" />
            Account
          </button>}
      </div>

      {/* Mobile search bar - full width below navbar */}
      {showSearch && (
        <div ref={mobileSearchRef} className="absolute md:hidden left-0 right-0 top-full bg-white shadow-lg z-50">
          <form onSubmit={handleSearchSubmit} className="flex items-center border-b border-gray-200">
            <Image className="w-4 h-4 ml-4 opacity-40" src={assets.search_icon} alt="" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full py-3 px-3 text-sm text-gray-800 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} className="pr-3 text-gray-400 hover:text-gray-600 text-lg">&times;</button>
            )}
            <button type="button" onClick={() => { setShowSearch(false); setSearchQuery('') }} className="pr-4 text-gray-400 hover:text-gray-600 text-sm">
              Close
            </button>
          </form>

          {filteredProducts.length > 0 && (
            <div className="max-h-64 overflow-y-auto">
              {filteredProducts.map((product) => (
                <button
                  key={product._id}
                  onClick={() => goToProduct(product._id)}
                  className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-orange-50 transition text-left"
                >
                  <div className="w-10 h-10 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
                    <Image src={product.image[0]} alt={product.name} className="w-full h-full object-cover" width={40} height={40} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 font-medium truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.category}</p>
                  </div>
                  <p className="text-sm font-medium text-orange-600 flex-shrink-0">₹{product.offerPrice}</p>
                </button>
              ))}
            </div>
          )}

          {searchQuery.trim() && filteredProducts.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-6">No products found</p>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;