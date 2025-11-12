"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from "react-native"

export default function CartScreen({ onBack, cartItems, onUpdateCart, onClearCart, onCheckout }) {
  const [deliveryMethod, setDeliveryMethod] = useState("grab")
  const [discountCode, setDiscountCode] = useState("")
  const [appliedDiscount, setAppliedDiscount] = useState(0)
  const [showPhoneLogin, setShowPhoneLogin] = useState(false)
  const [showOTP, setShowOTP] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [countdown, setCountdown] = useState(119)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    address: "",
  })

  useEffect(() => {
    let timer
    if (showOTP && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [showOTP, countdown])

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal()
    return Math.floor(subtotal * (appliedDiscount / 100))
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const discount = calculateDiscount()
    const deliveryFee = deliveryMethod === "grab" ? 23000 : 15000
    return subtotal - discount + deliveryFee
  }

  const handleApplyDiscount = () => {
    if (discountCode === "FREESHIP18K") {
      setAppliedDiscount(20)
      window.alert("Đã áp dụng mã giảm giá 20%!")
    } else {
      window.alert("Mã giảm giá không hợp lệ")
    }
  }

  const handleUpdateQuantity = (productId, change) => {
    const newItems = cartItems.map((item) => {
      if (item._id === productId) {
        const newQty = Math.max(0, item.quantity + change)
        return { ...item, quantity: newQty }
      }
      return item
    })
    onUpdateCart(newItems.filter((item) => item.quantity > 0))
  }

  const handlePhoneLogin = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      window.alert("Vui lòng nhập số điện thoại hợp lệ")
      return
    }
    setShowPhoneLogin(false)
    setShowOTP(true)
    setCountdown(119)
  }

  const handleVerifyOTP = () => {
    if (otpCode.length !== 6) {
      window.alert("Vui lòng nhập mã OTP 6 số")
      return
    }
    setIsLoggedIn(true)
    setCustomerInfo({ ...customerInfo })
    setShowOTP(false)
    window.alert("Đăng nhập thành công!")
  }

  const handlePlaceOrder = () => {
    if (!customerInfo.name || !customerInfo.address) {
      window.alert("Vui lòng nhập đầy đủ thông tin người nhận")
      return
    }
    if (!isLoggedIn) {
      window.alert("Vui lòng đăng nhập để đặt hàng")
      return
    }
    onCheckout({
      items: cartItems,
      customerInfo: { ...customerInfo, phone: phoneNumber },
      deliveryMethod,
      discountCode,
      total: calculateTotal(),
    })
  }

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack}>
            <Text style={styles.backButton}>← Quay lại</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Giỏ hàng</Text>
        </View>
        <View style={styles.emptyCart}>
          <Text style={styles.emptyCartIcon}>🛒</Text>
          <Text style={styles.emptyCartText}>Giỏ hàng trống</Text>
          <TouchableOpacity style={styles.shopNowBtn} onPress={onBack}>
            <Text style={styles.shopNowText}>Mua sắm ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Xác nhận đơn hàng</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Delivery Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚗 Giao hàng</Text>
          <View style={styles.deliveryOption}>
            <View style={styles.deliveryLogo}>
              <Text style={styles.deliveryLogoText}>Grab</Text>
            </View>
            <Text style={styles.deliveryText}>Grab Express</Text>
          </View>
          <View style={styles.addressBox}>
            <Text style={styles.addressLabel}>Quận 9</Text>
            <Text style={styles.addressDetail}>26/5 Tú Xương, Hiệp Phú, Quận 9, Hồ Chí Minh</Text>
          </View>
          <View style={styles.timeBox}>
            <Text style={styles.timeLabel}>Nhận lúc</Text>
            <Text style={styles.timeDetail}>Dự kiến: 15:55 - 16:05</Text>
            <Text style={styles.timeSubDetail}>Giao từ: 03-Lê Văn Việt</Text>
            <Text style={styles.timeSubDetail}>31 Lê Văn Việt, P. Hiệp Phú, Q9, TP. Thủ Đức, TP. Hồ Chí Minh</Text>
            <Text style={styles.timeSubDetail}>Khoảng cách 1.05 km</Text>
          </View>
        </View>

        {/* Recipient Info */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>👤 Thông tin người nhận</Text>
            {!isLoggedIn && (
              <TouchableOpacity style={styles.loginButton} onPress={() => setShowPhoneLogin(true)}>
                <Text style={styles.loginButtonText}>Đăng nhập</Text>
              </TouchableOpacity>
            )}
          </View>

          {isLoggedIn ? (
            <View style={styles.customerInfoDisplay}>
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>📱</Text>
                <Text style={styles.customerInfoText}>{phoneNumber}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>👤</Text>
                <Text style={styles.customerInfoText}>{customerInfo.name || "Chưa nhập"}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>📍</Text>
                <Text style={styles.customerInfoText}>{customerInfo.address || "Chưa nhập"}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.loginPrompt}>
              <Text style={styles.loginPromptText}>Vui lòng đăng nhập để nhập thông tin người nhận</Text>
            </View>
          )}

          {isLoggedIn && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Nhập tên người nhận"
                value={customerInfo.name}
                onChangeText={(text) => setCustomerInfo({ ...customerInfo, name: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Nhập địa chỉ người nhận"
                value={customerInfo.address}
                onChangeText={(text) => setCustomerInfo({ ...customerInfo, address: text })}
                multiline
              />
            </>
          )}
        </View>

        {/* Selected Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🍗 Các món đã chọn</Text>
          {cartItems.map((item) => (
            <View key={item._id} style={styles.cartItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                {item.extras && item.extras.length > 0 && (
                  <Text style={styles.itemExtras}>+ {item.extras.join(", ")}</Text>
                )}
              </View>
              <View style={styles.itemActions}>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => handleUpdateQuantity(item._id, -1)}>
                  <Text style={styles.qtyBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => handleUpdateQuantity(item._id, 1)}>
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.itemPrice}>{(item.price * item.quantity).toLocaleString("vi-VN")}đ</Text>
            </View>
          ))}

          <TouchableOpacity style={styles.addMoreBtn} onPress={onBack}>
            <Text style={styles.addMoreText}>+ Thêm món</Text>
          </TouchableOpacity>
        </View>

        {/* Discount Code */}
        <View style={styles.section}>
          <View style={styles.discountInputRow}>
            <TextInput
              style={styles.discountInput}
              placeholder="Nhập mã giảm giá"
              value={discountCode}
              onChangeText={setDiscountCode}
            />
            <TouchableOpacity style={styles.applyBtn} onPress={handleApplyDiscount}>
              <Text style={styles.applyBtnText}>Áp dụng</Text>
            </TouchableOpacity>
          </View>

          {appliedDiscount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>🎉 FREESHIP</Text>
              <Text style={styles.discountBadgeDetail}>Giảm 18k cho đơn từ 100k</Text>
              <Text style={styles.discountBadgeExpiry}>HSD: 31/12/2025</Text>
            </View>
          )}
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💰 Tổng cộng</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Thanh toán</Text>
            <Text style={styles.summaryValue}>{calculateSubtotal().toLocaleString("vi-VN")}đ</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Giá gốc</Text>
            <Text style={styles.summaryValue}>{calculateSubtotal().toLocaleString("vi-VN")}đ</Text>
          </View>
          {appliedDiscount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Giảm giá {appliedDiscount}%</Text>
              <Text style={[styles.summaryValue, styles.discountValue]}>
                -{calculateDiscount().toLocaleString("vi-VN")}đ
              </Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tạm tính</Text>
            <Text style={styles.summaryValue}>
              {(calculateSubtotal() - calculateDiscount()).toLocaleString("vi-VN")}đ
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Thuế VAT</Text>
            <Text style={styles.summaryValue}>0đ</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Phí giao hàng <Text style={styles.grabText}>Grab</Text>
            </Text>
            <Text style={styles.summaryValue}>{deliveryMethod === "grab" ? "23,000" : "15,000"}đ</Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💳 Phương thức thanh toán</Text>
          <TouchableOpacity style={styles.paymentOption}>
            <View style={styles.paymentRadio}>
              <View style={styles.radioSelected} />
            </View>
            <Text style={styles.paymentIcon}>💵</Text>
            <Text style={styles.paymentText}>Tiền mặt</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.paymentOption}>
            <View style={styles.paymentRadio} />
            <Text style={styles.paymentIcon}>💳</Text>
            <Text style={styles.paymentText}>Momo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Thành tiền</Text>
          <Text style={styles.totalAmount}>{calculateTotal().toLocaleString("vi-VN")}đ</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn} onPress={handlePlaceOrder}>
          <Text style={styles.checkoutBtnText}>Đặt hàng</Text>
        </TouchableOpacity>
      </View>

      {/* Phone Login Modal */}
      <Modal visible={showPhoneLogin} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Đăng nhập</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Nhập số điện thoại"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowPhoneLogin(false)}>
                <Text style={styles.modalCancelText}>Bỏ qua</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmBtn} onPress={handlePhoneLogin}>
                <Text style={styles.modalConfirmText}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* OTP Modal */}
      <Modal visible={showOTP} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Xác nhận mã OTP</Text>
            <Text style={styles.otpDescription}>
              Một mã xác thực gồm 6 số đã được gửi đến{"\n"}Số điện thoại {phoneNumber}
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Nhập mã để tiếp tục"
              value={otpCode}
              onChangeText={setOtpCode}
              keyboardType="number-pad"
              maxLength={6}
            />
            <TouchableOpacity disabled={countdown > 0}>
              <Text style={[styles.resendText, countdown > 0 && styles.resendTextDisabled]}>
                Gửi lại ({countdown}s)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalConfirmBtn} onPress={handleVerifyOTP}>
              <Text style={styles.modalConfirmText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f7f4",
  },
  header: {
    backgroundColor: "#2d6a4f",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 12,
  },
  backButton: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1b4332",
    marginBottom: 12,
  },
  deliveryOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  deliveryLogo: {
    backgroundColor: "#00b14f",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  deliveryLogoText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  deliveryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1b4332",
  },
  addressBox: {
    backgroundColor: "#d8f3dc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1b4332",
    marginBottom: 4,
  },
  addressDetail: {
    fontSize: 13,
    color: "#2d6a4f",
  },
  timeBox: {
    backgroundColor: "#f9fdf9",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#52b788",
  },
  timeLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1b4332",
    marginBottom: 4,
  },
  timeDetail: {
    fontSize: 13,
    color: "#2d6a4f",
    marginBottom: 8,
  },
  timeSubDetail: {
    fontSize: 12,
    color: "#74c69d",
    marginBottom: 2,
  },
  loginButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#52b788",
  },
  loginButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2d6a4f",
  },
  loginPrompt: {
    backgroundColor: "#d8f3dc",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  loginPromptText: {
    fontSize: 13,
    color: "#2d6a4f",
    textAlign: "center",
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#b7e4c7",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  customerInfoDisplay: {
    gap: 12,
    backgroundColor: "#f9fdf9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoIcon: {
    fontSize: 16,
  },
  customerInfoText: {
    fontSize: 14,
    color: "#1b4332",
    flex: 1,
  },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#d8f3dc",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1b4332",
    marginBottom: 4,
  },
  itemExtras: {
    fontSize: 12,
    color: "#74c69d",
  },
  itemActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginRight: 16,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#d8f3dc",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2d6a4f",
  },
  qtyText: {
    fontSize: 14,
    fontWeight: "600",
    minWidth: 20,
    textAlign: "center",
    color: "#1b4332",
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2d6a4f",
  },
  addMoreBtn: {
    paddingVertical: 12,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#d8f3dc",
    marginTop: 8,
  },
  addMoreText: {
    fontSize: 14,
    color: "#52b788",
    fontWeight: "600",
  },
  discountInputRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  discountInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#b7e4c7",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  applyBtn: {
    backgroundColor: "#52b788",
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: "center",
  },
  applyBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  discountBadge: {
    backgroundColor: "#d8f3dc",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#52b788",
  },
  discountBadgeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1b4332",
    marginBottom: 4,
  },
  discountBadgeDetail: {
    fontSize: 12,
    color: "#2d6a4f",
    marginBottom: 2,
  },
  discountBadgeExpiry: {
    fontSize: 11,
    color: "#74c69d",
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#d8f3dc",
  },
  paymentRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#b7e4c7",
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#52b788",
  },
  paymentIcon: {
    fontSize: 18,
  },
  paymentText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1b4332",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#2d6a4f",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1b4332",
  },
  discountValue: {
    color: "#52b788",
  },
  grabText: {
    color: "#00b14f",
    fontWeight: "600",
  },
  bottomBar: {
    backgroundColor: "#2d6a4f",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  totalSection: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  checkoutBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  checkoutBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2d6a4f",
  },
  emptyCart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyCartIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyCartText: {
    fontSize: 18,
    color: "#74c69d",
    marginBottom: 24,
  },
  shopNowBtn: {
    backgroundColor: "#52b788",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopNowText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    color: "#1b4332",
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1.5,
    borderColor: "#b7e4c7",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  modalConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#2d6a4f",
    alignItems: "center",
  },
  modalConfirmText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  otpDescription: {
    fontSize: 13,
    color: "#74c69d",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
  resendText: {
    fontSize: 13,
    color: "#52b788",
    textAlign: "center",
    marginBottom: 16,
  },
  resendTextDisabled: {
    color: "#999",
  },
})
