"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Modal, Image, TextInput } from "react-native"
import { COLORS } from "../../styles/theme"
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../api/api"
import CartScreen from "./CartScreen"

export default function ProductsScreen({ onBack, isAdminMode = false }) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const [formData, setFormData] = useState({
    name: "",
    category: "ga-tuoi",
    price: "",
    description: "",
    imageUrl: "",
    inStock: true,
    quantity: "",
    rating: "5",
  })

  const categories = [
    { id: "all", label: "Tất Cả" },
    { id: "ga-tuoi", label: "Gà Tươi" },
    { id: "ga-kho", label: "Gà Khô" },
    { id: "trung", label: "Trứng Gà" },
    { id: "pho-ga", label: "Phở Gà" },
    { id: "com-ga", label: "Cơm Gà" },
    { id: "ga-luoc", label: "Gà Luộc" },
    { id: "khac", label: "Khác" },
  ]

  const [showAddToCartModal, setShowAddToCartModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedExtras, setSelectedExtras] = useState([])
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [showCart, setShowCart] = useState(false)

  const [availableExtras, setAvailableExtras] = useState([])

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await getProducts()
      setProducts(data)
      setAvailableExtras(data.filter((p) => p.inStock))
    } catch (error) {
      console.error("Error loading products:", error)
      window.alert("Lỗi khi tải sản phẩm: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts =
    selectedCategory === "all" ? products : products.filter((p) => p.category === selectedCategory)

  const formatCurrency = (value) => {
    if (!value) return ""
    const numStr = value.toString().replace(/\D/g, "")
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  const parseCurrency = (value) => {
    return Number.parseInt(value.replace(/\./g, ""), 10) || 0
  }

  const openModal = (product = null) => {
    console.log("[v0] Opening modal with product:", product)
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        category: product.category,
        price: formatCurrency(product.price),
        description: product.description,
        imageUrl: product.imageUrl || "",
        inStock: product.inStock,
        quantity: product.quantity.toString(),
        rating: product.rating?.toString() || "5",
      })
    } else {
      setEditingProduct(null)
      setFormData({
        name: "",
        category: "ga-tuoi",
        price: "",
        description: "",
        imageUrl: "",
        inStock: true,
        quantity: "",
        rating: "5",
      })
    }
    setShowModal(true)
    console.log("[v0] Modal state set to true")
  }

  const handleSubmit = async () => {
    console.log("[v0] Submitting form with data:", formData)

    if (!formData.name || !formData.price || !formData.description) {
      window.alert("Vui lòng điền đầy đủ thông tin bắt buộc (Tên, Giá, Mô tả)")
      return
    }

    const payload = {
      ...formData,
      price: parseCurrency(formData.price),
      quantity: Number.parseInt(formData.quantity) || 0,
      rating: Number.parseFloat(formData.rating) || 5,
    }

    console.log("[v0] Payload to send:", payload)

    try {
      if (editingProduct) {
        console.log("[v0] Updating product:", editingProduct._id)
        await updateProduct(editingProduct._id, payload)
        window.alert("Cập nhật sản phẩm thành công!")
      } else {
        console.log("[v0] Creating new product")
        await createProduct(payload)
        window.alert("Tạo sản phẩm thành công!")
      }
      setShowModal(false)
      loadProducts()
    } catch (error) {
      console.error("[v0] Error submitting:", error)
      window.alert("Lỗi: " + error.message)
    }
  }

  const handleDelete = async (productId) => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa sản phẩm này?")
    if (!confirmed) return

    try {
      await deleteProduct(productId)
      window.alert("Xóa sản phẩm thành công!")
      loadProducts()
    } catch (error) {
      window.alert("Lỗi khi xóa: " + error.message)
    }
  }

  const handleAddToCart = (product) => {
    console.log("[v0] Opening add to cart modal for product:", product.name)
    setSelectedProduct(product)
    setSelectedExtras([])
    setShowAddToCartModal(true)
  }

  const handleConfirmAddToCart = () => {
    console.log("[v0] Confirming add to cart")
    console.log("[v0] Selected product:", selectedProduct)
    console.log("[v0] Selected extras IDs:", selectedExtras)

    if (!selectedProduct) {
      console.log("[v0] Error: No product selected")
      return
    }

    const selectedExtrasData = selectedExtras
      .map((id) => {
        const extra = availableExtras.find((e) => e._id === id)
        return extra
      })
      .filter(Boolean)

    console.log("[v0] Selected extras data:", selectedExtrasData)

    const totalExtrasPrice = selectedExtrasData.reduce((sum, extra) => sum + extra.price, 0)
    const totalPrice = selectedProduct.price + totalExtrasPrice

    const cartItem = {
      _id: selectedProduct._id + "_" + Date.now(), // Unique ID for cart item
      productId: selectedProduct._id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      imageUrl: selectedProduct.imageUrl,
      extras: selectedExtrasData.map((e) => ({
        _id: e._id,
        name: e.name,
        price: e.price,
      })),
      totalPrice: totalPrice,
      quantity: 1,
    }

    console.log("[v0] Adding cart item:", cartItem)

    setCartItems([...cartItems, cartItem])
    setShowAddToCartModal(false)
    setShowSuccessToast(true)
    setTimeout(() => setShowSuccessToast(false), 3000)
  }

  const handleToggleExtra = (extraId) => {
    if (selectedExtras.includes(extraId)) {
      setSelectedExtras(selectedExtras.filter((id) => id !== extraId))
    } else {
      setSelectedExtras([extraId])
    }
  }

  const handleViewCart = () => {
    setShowCart(true)
  }

  const handleUpdateCart = (newItems) => {
    setCartItems(newItems)
  }

  const handleCheckout = (orderData) => {
    window.alert("Đặt hàng thành công! Cảm ơn bạn đã mua hàng.")
    setCartItems([])
    setShowCart(false)
  }

  if (showCart) {
    return (
      <CartScreen
        onBack={() => setShowCart(false)}
        cartItems={cartItems}
        onUpdateCart={handleUpdateCart}
        onClearCart={() => setCartItems([])}
        onCheckout={handleCheckout}
      />
    )
  }

  const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating || 0)
    return (
      <View style={styles.starContainer}>
        {[...Array(5)].map((_, i) => (
          <Text key={i} style={styles.star}>
            {i < fullStars ? "★" : "☆"}
          </Text>
        ))}
      </View>
    )
  }

  const renderProductCard = ({ item }) => {
    if (isAdminMode) {
      // Admin view: with edit and delete buttons
      return (
        <View style={styles.productCard}>
          <View style={[styles.productImageContainer, { backgroundColor: item.inStock ? "#e8f5e9" : "#ffebee" }]}>
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.productImageReal} resizeMode="cover" />
            ) : (
              <Text style={styles.productImagePlaceholder}>📷</Text>
            )}
            <View style={styles.priceBadge}>
              <Text style={styles.priceBadgeIcon}>💰</Text>
              <Text style={styles.priceBadgeText}>{item.price.toLocaleString("vi-VN")}₫</Text>
            </View>
            {!item.inStock && (
              <View style={styles.outOfStockBadge}>
                <Text style={styles.outOfStockText}>Hết hàng</Text>
              </View>
            )}
          </View>

          <View style={styles.productContent}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productDesc}>{item.description}</Text>
            <Text style={styles.quantityText}>Số lượng: {item.quantity}</Text>

            <View style={styles.adminActions}>
              <TouchableOpacity style={styles.editBtn} onPress={() => openModal(item)}>
                <Text style={styles.editBtnText}>✏️ Sửa</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item._id)}>
                <Text style={styles.deleteBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    } else {
      // Customer view: with rating and add to cart button
      return (
        <View style={styles.productCard}>
          <View style={[styles.productImageContainer, { backgroundColor: item.inStock ? "#e8f5e9" : "#ffebee" }]}>
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.productImageReal} resizeMode="cover" />
            ) : (
              <Text style={styles.productImagePlaceholder}>📷</Text>
            )}
            <View style={styles.priceBadge}>
              <Text style={styles.priceBadgeIcon}>💰</Text>
              <Text style={styles.priceBadgeText}>{item.price.toLocaleString("vi-VN")}₫</Text>
            </View>
            {!item.inStock && (
              <View style={styles.outOfStockBadge}>
                <Text style={styles.outOfStockText}>Hết hàng</Text>
              </View>
            )}
          </View>

          <View style={styles.productContent}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productDesc} numberOfLines={2}>
              {item.description}
            </Text>

            <View style={styles.ratingRow}>
              <StarRating rating={item.rating || 5} />
              <Text style={styles.quantityText}>Còn: {item.quantity}</Text>
            </View>

            {item.inStock ? (
              <TouchableOpacity style={styles.addToCartBtn} onPress={() => handleAddToCart(item)}>
                <Text style={styles.addToCartBtnText}>🛒 Thêm vào giỏ</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.outOfStockBtn}>
                <Text style={styles.outOfStockBtnText}>Tạm hết hàng</Text>
              </View>
            )}
          </View>
        </View>
      )
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← Quay lại Hub</Text>
          </TouchableOpacity>
        )}
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Sản Phẩm</Text>
            <Text style={styles.headerSubtitle}>
              {isAdminMode ? "Quản lý sản phẩm bán hàng" : "Chọn sản phẩm yêu thích"}
            </Text>
          </View>
          {isAdminMode && (
            <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
              <Text style={styles.addButtonText}>+ Thêm</Text>
            </TouchableOpacity>
          )}
          {!isAdminMode && cartItems.length > 0 && (
            <TouchableOpacity style={styles.cartButton} onPress={handleViewCart}>
              <Text style={styles.cartIcon}>🛒</Text>
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[styles.categoryButton, selectedCategory === category.id && styles.categoryButtonActive]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text
              style={[styles.categoryButtonText, selectedCategory === category.id && styles.categoryButtonTextActive]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Đang tải...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item._id}
          renderItem={renderProductCard}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Chưa có sản phẩm nào</Text>
            </View>
          }
        />
      )}

      {isAdminMode && (
        <Modal visible={showModal} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContentContainer}>
              <ScrollView style={styles.modalContent}>
                <Text style={styles.modalTitle}>{editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</Text>

                <Text style={styles.label}>Tên sản phẩm *</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  placeholder="Nhập tên sản phẩm"
                />

                <Text style={styles.label}>Danh mục</Text>
                <View style={styles.pickerContainer}>
                  {categories
                    .filter((c) => c.id !== "all")
                    .map((cat) => (
                      <TouchableOpacity
                        key={cat.id}
                        style={[styles.pickerOption, formData.category === cat.id && styles.pickerOptionActive]}
                        onPress={() => setFormData({ ...formData, category: cat.id })}
                      >
                        <Text
                          style={[
                            styles.pickerOptionText,
                            formData.category === cat.id && styles.pickerOptionTextActive,
                          ]}
                        >
                          {cat.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.label}>Giá (VNĐ) *</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.price}
                  onChangeText={(text) => {
                    const formatted = formatCurrency(text)
                    setFormData({ ...formData, price: formatted })
                  }}
                  placeholder="Nhập giá"
                  keyboardType="numeric"
                />

                <Text style={styles.label}>Mô tả *</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  placeholder="Nhập mô tả sản phẩm"
                  multiline
                  numberOfLines={4}
                />

                <Text style={styles.label}>URL hình ảnh</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.imageUrl}
                  onChangeText={(text) => setFormData({ ...formData, imageUrl: text })}
                  placeholder="https://example.com/image.jpg"
                />
                {formData.imageUrl && (
                  <View style={styles.imagePreviewContainer}>
                    <Image source={{ uri: formData.imageUrl }} style={styles.imagePreview} resizeMode="cover" />
                  </View>
                )}

                <Text style={styles.label}>Số lượng</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.quantity}
                  onChangeText={(text) => setFormData({ ...formData, quantity: text })}
                  placeholder="Nhập số lượng"
                  keyboardType="numeric"
                />

                <Text style={styles.label}>Đánh giá (1-5)</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.rating}
                  onChangeText={(text) => setFormData({ ...formData, rating: text })}
                  placeholder="5.0"
                  keyboardType="decimal-pad"
                />

                <View style={styles.checkboxContainer}>
                  <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => setFormData({ ...formData, inStock: !formData.inStock })}
                  >
                    <Text style={styles.checkboxIcon}>{formData.inStock ? "✓" : "○"}</Text>
                    <Text style={styles.checkboxLabel}>Còn hàng</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowModal(false)}>
                    <Text style={styles.cancelBtnText}>Hủy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                    <Text style={styles.submitBtnText}>{editingProduct ? "Cập nhật" : "Tạo mới"}</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {!isAdminMode && (
        <Modal visible={showAddToCartModal} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.addToCartModal}>
              <View style={styles.addToCartHeader}>
                <Text style={styles.addToCartTitle}>Thêm món mới</Text>
                <TouchableOpacity onPress={() => setShowAddToCartModal(false)}>
                  <Text style={styles.closeModalText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.addToCartContent}>
                {selectedProduct && (
                  <View style={styles.selectedProductInfo}>
                    <Text style={styles.selectedProductName}>{selectedProduct.name}</Text>
                    <Text style={styles.selectedProductPrice}>{selectedProduct.price.toLocaleString("vi-VN")}₫</Text>
                  </View>
                )}

                <Text style={styles.extrasLabel}>MÓN KÈM (TÙY CHỌN)</Text>
                <Text style={styles.extrasSubLabel}>CHỌN 1</Text>

                {availableExtras.map((extra) => (
                  <TouchableOpacity
                    key={extra._id}
                    style={styles.extraOption}
                    onPress={() => handleToggleExtra(extra._id)}
                  >
                    <View style={styles.extraInfo}>
                      <Text style={styles.extraName}>{extra.name}</Text>
                      <Text style={styles.extraPrice}>+{extra.price.toLocaleString("vi-VN")}₫</Text>
                    </View>
                    <View style={[styles.extraRadio, selectedExtras.includes(extra._id) && styles.extraRadioSelected]}>
                      {selectedExtras.includes(extra._id) && <View style={styles.extraRadioDot} />}
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity style={styles.addToCartConfirmBtn} onPress={handleConfirmAddToCart}>
                <Text style={styles.addToCartConfirmText}>
                  {(() => {
                    const extrasPrice = selectedExtras.reduce((sum, id) => {
                      const extra = availableExtras.find((e) => e._id === id)
                      return sum + (extra?.price || 0)
                    }, 0)
                    const total = (selectedProduct?.price || 0) + extrasPrice
                    return `${total.toLocaleString("vi-VN")}₫ - Thêm vào giỏ hàng`
                  })()}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {showSuccessToast && (
        <View style={styles.successToast}>
          <Text style={styles.successToastIcon}>✓</Text>
          <Text style={styles.successToastText}>Đã cập nhật giỏ hàng</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafbfc",
  },

  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingTop: 12,
  },
  backButton: {
    paddingVertical: 8,
    marginBottom: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  addButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 14,
  },

  categoriesScroll: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  categoriesContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  categoryButtonTextActive: {
    color: "#fff",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },

  listContent: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 4,
  },

  productCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  productImageContainer: {
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  productImageReal: {
    width: "100%",
    height: "100%",
  },
  productImagePlaceholder: {
    fontSize: 56,
  },
  priceBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  priceBadgeIcon: {
    fontSize: 12,
  },
  priceBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  outOfStockBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#f44336",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  outOfStockText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },

  productContent: {
    padding: 14,
  },
  productName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    marginBottom: 6,
  },
  productDesc: {
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
    marginBottom: 6,
  },
  quantityText: {
    fontSize: 11,
    color: "#999",
  },

  ratingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  addToCartBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  addToCartBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  outOfStockBtn: {
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#f44336",
  },
  outOfStockBtnText: {
    color: "#999",
    fontSize: 13,
    fontWeight: "600",
  },

  adminActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  editBtn: {
    flex: 1,
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  editBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  deleteBtn: {
    backgroundColor: "#ffebee",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#f44336",
  },
  deleteBtnText: {
    color: "#f44336",
    fontSize: 16,
    fontWeight: "700",
  },

  starContainer: {
    flexDirection: "row",
    gap: 2,
  },
  star: {
    fontSize: 12,
    color: "#FFB800",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContentContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    maxHeight: "90%",
    width: "100%",
    maxWidth: 500,
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 12,
    color: "#333",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  imagePreviewContainer: {
    marginTop: 8,
    alignItems: "center",
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  pickerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pickerOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  pickerOptionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pickerOptionText: {
    fontSize: 12,
    color: "#666",
  },
  pickerOptionTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  checkboxContainer: {
    marginTop: 12,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkboxIcon: {
    fontSize: 20,
    color: COLORS.primary,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#333",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
    marginBottom: 12,
  },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  submitBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },

  cartButton: {
    position: "relative",
    padding: 8,
  },
  cartIcon: {
    fontSize: 24,
  },
  cartBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#ff6b6b",
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },

  addToCartModal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "70%",
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  addToCartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  addToCartTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  closeModalText: {
    fontSize: 24,
    color: "#999",
  },
  addToCartContent: {
    padding: 16,
    maxHeight: 350,
  },
  selectedProductInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  selectedProductName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  selectedProductPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.primary,
  },
  extrasLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#999",
    marginBottom: 4,
  },
  extrasSubLabel: {
    fontSize: 11,
    color: "#666",
    marginBottom: 12,
  },
  extraOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  extraInfo: {
    flex: 1,
  },
  extraName: {
    fontSize: 14,
    color: "#333",
    marginBottom: 2,
  },
  extraPrice: {
    fontSize: 12,
    color: "#666",
  },
  extraRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  extraRadioSelected: {
    borderColor: COLORS.primary,
  },
  extraRadioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  addToCartConfirmBtn: {
    backgroundColor: COLORS.primary,
    padding: 14,
    margin: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  addToCartConfirmText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  successToast: {
    position: "absolute",
    top: 80,
    left: 20,
    right: 20,
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    gap: 12,
  },
  successToastIcon: {
    fontSize: 20,
    color: "#fff",
  },
  successToastText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
})
