'use client'
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const ProductList = () => {

  const { router, getToken, user } = useAppContext()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteProduct, setDeleteProduct] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [editPrice, setEditPrice] = useState('')
  const [editOfferPrice, setEditOfferPrice] = useState('')
  const [editExistingImages, setEditExistingImages] = useState([])
  const [editNewFiles, setEditNewFiles] = useState([])
  const [updating, setUpdating] = useState(false)

  const fetchSellerProduct = async () => {
    try {
      console.log("fetchSellerProduct called, user:", !!user);
      const token = await getToken()
      console.log("Got token:", !!token);
      const { data } = await axios.get('/api/product/seller-list', { headers: { Authorization: `Bearer ${token}` } })
      if (data.success) {
        setProducts(data.products)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error("fetchSellerProduct error:", error.message);
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log("product-list useEffect, user:", !!user);
    if (user) {
      fetchSellerProduct();
    }
  }, [user])

  // ── Delete handlers ──

  const openDeleteModal = (product) => {
    setDeleteProduct(product)
    setShowDeleteModal(true)
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
    setDeleteProduct(null)
  }

  const handleDelete = async () => {
    if (!deleteProduct) return
    setDeleting(true)
    try {
      const token = await getToken()
      const { data } = await axios.delete('/api/product/delete', {
        headers: { Authorization: `Bearer ${token}` },
        data: { productId: deleteProduct._id }
      })
      if (data.success) {
        toast.success(data.message)
        setProducts(prev => prev.filter(p => p._id !== deleteProduct._id))
        closeDeleteModal()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setDeleting(false)
    }
  }

  // ── Edit handlers ──

  const openEditModal = (product) => {
    setEditProduct(product)
    setEditName(product.name)
    setEditDescription(product.description)
    setEditCategory(product.category)
    setEditPrice(product.price)
    setEditOfferPrice(product.offerPrice)
    setEditExistingImages(product.image || [])
    setEditNewFiles([])
    setShowEditModal(true)
  }

  const closeEditModal = () => {
    setShowEditModal(false)
    setEditProduct(null)
    setEditNewFiles([])
  }

  const removeExistingImage = (index) => {
    setEditExistingImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    if (!editProduct) return
    setUpdating(true)
    const toastId = toast.loading("Updating product...")

    const formData = new FormData()
    formData.append('productId', editProduct._id)
    formData.append('name', editName)
    formData.append('description', editDescription)
    formData.append('category', editCategory)
    formData.append('price', editPrice)
    formData.append('offerPrice', editOfferPrice)
    formData.append('existingImages', JSON.stringify(editExistingImages))

    editNewFiles.forEach(file => {
      if (file) formData.append('images', file)
    })

    try {
      const token = await getToken()
      const { data } = await axios.put('/api/product/edit', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        toast.success(data.message, { id: toastId })
        setProducts(prev => prev.map(p => p._id === editProduct._id ? data.product : p))
        closeEditModal()
      } else {
        toast.error(data.message, { id: toastId })
      }
    } catch (error) {
      toast.error(error.message, { id: toastId })
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      {loading ? <Loading /> : <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">All Product</h2>
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className=" table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 text-sm text-left">
              <tr>
                <th className="w-2/3 md:w-2/5 px-4 py-3 font-medium truncate">Product</th>
                <th className="px-4 py-3 font-medium truncate max-sm:hidden">Category</th>
                <th className="px-4 py-3 font-medium truncate">
                  Price
                </th>
                <th className="px-4 py-3 font-medium truncate">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {products.map((product, index) => (
                <tr key={index} className="border-t border-gray-500/20">
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                    <div className="bg-gray-500/10 rounded p-2">
                      <Image
                        src={product.image[0]}
                        alt="product Image"
                        className="w-16"
                        width={1280}
                        height={720}
                      />
                    </div>
                    <span className="truncate w-full">
                      {product.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-sm:hidden">{product.category}</td>
                  <td className="px-4 py-3">₹{product.offerPrice}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Visit button */}
                      <button
                        onClick={() => router.push(`/product/${product._id}`)}
                        className="flex items-center gap-1 px-1.5 md:px-3 py-2 bg-orange-600 text-white rounded-md text-xs"
                        title="View"
                      >
                        <span className="hidden md:block">Visit</span>
                        <Image
                          className="h-3.5 w-auto"
                          src={assets.redirect_icon}
                          alt="redirect_icon"
                        />
                      </button>
                      {/* Edit button */}
                      <button
                        onClick={() => openEditModal(product)}
                        className="flex items-center gap-1 px-1.5 md:px-3 py-2 bg-blue-600 text-white rounded-md text-xs"
                        title="Edit"
                      >
                        <span className="hidden md:block">Edit</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      {/* Delete button */}
                      <button
                        onClick={() => openDeleteModal(product)}
                        className="flex items-center gap-1 px-1.5 md:px-3 py-2 bg-red-600 text-white rounded-md text-xs"
                        title="Delete"
                      >
                        <span className="hidden md:block">Delete</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>}

      {/* ── Delete Confirmation Modal ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl p-6 mx-4 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Product</h3>
            <p className="text-gray-600 mb-1">Are you sure you want to delete</p>
            <p className="text-gray-900 font-medium mb-4">&quot;{deleteProduct?.name}&quot;?</p>
            <p className="text-sm text-red-500 mb-6">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                disabled={deleting}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Product Modal ── */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto py-10">
          <div className="bg-white rounded-lg shadow-xl p-6 mx-4 max-w-lg w-full my-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Product</h3>
              <button onClick={closeEditModal} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleEdit} className="space-y-5">
              {/* Images */}
              <div>
                <p className="text-base font-medium">Product Images</p>
                {/* Existing images */}
                {editExistingImages.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-2">
                    {editExistingImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <Image
                          src={img}
                          alt={`Product image ${idx + 1}`}
                          className="max-w-24 rounded border border-gray-200"
                          width={100}
                          height={100}
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs leading-none opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {/* New image uploads */}
                <p className="text-sm text-gray-500 mt-3 mb-1">Add new images</p>
                <div className="flex flex-wrap items-center gap-3">
                  {[...Array(4)].map((_, index) => (
                    <label key={index} htmlFor={`edit-image${index}`}>
                      <input
                        onChange={(e) => {
                          const updatedFiles = [...editNewFiles];
                          updatedFiles[index] = e.target.files[0];
                          setEditNewFiles(updatedFiles);
                        }}
                        type="file"
                        id={`edit-image${index}`}
                        hidden
                      />
                      <Image
                        className="max-w-24 cursor-pointer"
                        src={editNewFiles[index] ? URL.createObjectURL(editNewFiles[index]) : assets.upload_area}
                        alt=""
                        width={100}
                        height={100}
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div className="flex flex-col gap-1">
                <label className="text-base font-medium" htmlFor="edit-product-name">Product Name</label>
                <input
                  id="edit-product-name"
                  type="text"
                  placeholder="Type here"
                  className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                  onChange={(e) => setEditName(e.target.value)}
                  value={editName}
                  required
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <label className="text-base font-medium" htmlFor="edit-product-description">Product Description</label>
                <textarea
                  id="edit-product-description"
                  rows={4}
                  className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
                  placeholder="Type here"
                  onChange={(e) => setEditDescription(e.target.value)}
                  value={editDescription}
                  required
                ></textarea>
              </div>

              {/* Category / Price / Offer Price */}
              <div className="flex items-center gap-5 flex-wrap">
                <div className="flex flex-col gap-1 w-32">
                  <label className="text-base font-medium" htmlFor="edit-category">Category</label>
                  <select
                    id="edit-category"
                    className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                    onChange={(e) => setEditCategory(e.target.value)}
                    value={editCategory}
                  >
                    <option value="Brass Idols &amp; Statues">Brass Idols &amp; Statues</option>
                    <option value="Pooja Thalis &amp; Sets">Pooja Thalis &amp; Sets</option>
                    <option value="Diyas, Lamps &amp; Aarti Stands">Diyas, Lamps &amp; Aarti Stands</option>
                    <option value="Decorative Showpieces">Decorative Showpieces</option>
                    <option value="Plates, Bowls &amp; Glasses">Plates, Bowls &amp; Glasses</option>
                    <option value="Brass Bells">Brass Bells</option>
                    <option value="Incense Holders">Incense Holders</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1 w-32">
                  <label className="text-base font-medium" htmlFor="edit-product-price">Product Price</label>
                  <input
                    id="edit-product-price"
                    type="number"
                    placeholder="0"
                    className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                    onChange={(e) => setEditPrice(e.target.value)}
                    value={editPrice}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1 w-32">
                  <label className="text-base font-medium" htmlFor="edit-offer-price">Offer Price</label>
                  <input
                    id="edit-offer-price"
                    type="number"
                    placeholder="0"
                    className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                    onChange={(e) => setEditOfferPrice(e.target.value)}
                    value={editOfferPrice}
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={updating}
                  className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded shadow-md hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductList;