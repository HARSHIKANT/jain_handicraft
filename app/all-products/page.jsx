'use client'
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";

const AllProductsContent = () => {

    const { products } = useAppContext();
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('search') || '';

    const [searchFilter, setSearchFilter] = useState(searchQuery);

    useEffect(() => {
        setSearchFilter(searchQuery);
    }, [searchQuery]);

    const filteredProducts = searchFilter.trim()
        ? products.filter(p => {
            const q = searchFilter.toLowerCase();
            return (
                p.name.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q)
            );
        })
        : products;

    return (
        <div className="flex flex-col items-start px-6 md:px-16 lg:px-32 bg-orange-50">
            <div className="flex flex-col items-end pt-12">
                {searchFilter ? (
                    <div>
                        <p className="text-2xl font-medium">Search Results</p>
                        <p className="text-sm text-gray-500 mt-1">
                            {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for &quot;{searchFilter}&quot;
                        </p>
                    </div>
                ) : (
                    <div>
                        <p className="text-2xl font-medium">All products</p>
                        <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
                    </div>
                )}
            </div>

            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-12 pb-14 w-full">
                    {filteredProducts.map((product, index) => <ProductCard key={index} product={product} />)}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center w-full py-20">
                    <p className="text-gray-400 text-lg">No products found</p>
                    <a href="/all-products" className="mt-3 text-orange-600 hover:underline text-sm">
                        Show all products
                    </a>
                </div>
            )}
        </div>
    );
};

const AllProducts = () => {
    return (
        <>
            <Navbar />
            <Suspense fallback={<Loading />}>
                <AllProductsContent />
            </Suspense>
            <Footer />
        </>
    );
};

export default AllProducts;
