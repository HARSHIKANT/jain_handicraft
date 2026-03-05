'use client'
import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

// Fallback products when none are marked as featured
const fallbackProducts = [
  {
    id: 1,
    image: assets.featured,
    title: "Devotion starts here",
    description: "Experience The Devin.",
  },
  {
    id: 2,
    image: assets.featuredTwo,
    title: "Stay Connected to roots",
    description: "Cutural heritage to lighten up the space.",
  },
  {
    id: 3,
    image: assets.copperBottle,
    title: "Pure brass utitensils",
    description: "Shop the pure, live the pure.",
  },
];

const FeaturedProduct = () => {
  const { products, router } = useAppContext()

  const featuredProducts = products.filter(p => p.featured)
  const useFallback = featuredProducts.length === 0

  return (
    <div className="mt-14">
      <div className="flex flex-col items-center">
        <p className="text-3xl font-medium">Featured Products</p>
        <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 mt-12 md:px-14 px-4">
        {useFallback
          ? fallbackProducts.map(({ id, image, title, description }) => (
            <div key={id} className="relative group cursor-pointer">
              <Image
                src={image}
                alt={title}
                className="group-hover:brightness-75 transition duration-300 w-full h-auto object-cover"
              />
              <div className="group-hover:-translate-y-4 transition duration-300 absolute bottom-8 left-8 text-white space-y-2">
                <p className="font-medium text-xl lg:text-2xl">{title}</p>
                <p className="text-sm lg:text-base leading-5 max-w-60">{description}</p>
                <button className="flex items-center gap-1.5 bg-orange-600 px-4 py-2 rounded">
                  Buy now <Image className="h-3 w-3" src={assets.redirect_icon} alt="Redirect Icon" />
                </button>
              </div>
            </div>
          ))
          : featuredProducts.map((product) => (
            <div
              key={product._id}
              className="relative group cursor-pointer overflow-hidden rounded-lg"
              onClick={() => { router.push(`/product/${product._id}`); scrollTo(0, 0) }}
            >
              <div className="relative w-full h-72 sm:h-80 lg:h-96">
                <Image
                  src={product.image[0]}
                  alt={product.featuredTitle || product.name}
                  className="group-hover:brightness-75 group-hover:scale-105 transition duration-500 object-cover"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="group-hover:-translate-y-4 transition duration-300 absolute bottom-8 left-8 text-white space-y-2">
                <p className="font-medium text-xl lg:text-2xl drop-shadow-lg">
                  {product.featuredTitle || product.name}
                </p>
                <p className="text-sm lg:text-base leading-5 max-w-60 drop-shadow-lg">
                  {product.featuredDescription || product.description}
                </p>
                <button className="flex items-center gap-1.5 bg-orange-600 px-4 py-2 rounded hover:bg-orange-700 transition">
                  Buy now <Image className="h-3 w-3" src={assets.redirect_icon} alt="Redirect Icon" />
                </button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default FeaturedProduct;
