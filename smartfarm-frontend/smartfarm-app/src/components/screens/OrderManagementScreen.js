"use client"

import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from "react-native"
import { COLORS } from "../../styles/theme"
import { getOrders, updateOrder, deleteOrder } from "../../api/api"
import { useState, useEffect } from "react"

export default function OrderManagementScreen({ onBack }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingOrder, setEditingOrder] = useState(null)
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const data = await getOrders()
      setOrders(data || [])
    } catch (error) {
      window.alert("Lỗi tải đơn hàng: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrder(orderId, { status: newStatus })
      window.alert("Cập nhật trạng thái thành công!")
      loadOrders()
    } catch (error) {
      window.alert("Lỗi cập nhật: " + error.message)
    }
  }

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Bạn có chắc muốn xóa đơn hàng này?")) {
      try {
        await deleteOrder(orderId)
        window.alert("Xóa đơn hàng thành công!")
        loadOrders()
      } catch (error) {
        window.alert("Lỗi xóa: " + error.message)
      }
    }
  }

  const getStatusLabel = (status) => {
    const labels = {
      pending: "Chờ xác nhận",
      confirmed: "Đã xác nhận",
      shipping: "Đang giao",
      delivered: "Đã giao",
      cancelled: "Đã hủy",
    }
    return labels[status] || status
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: "#ff9800",
      confirmed: "#2196f3",
      shipping: "#9c27b0",
      delivered: "#4caf50",
      cancelled: "#f44336",
    }
    return colors[status] || "#666"
  }

  const filteredOrders = filterStatus === "all" ? orders : orders.filter((order) => order.status === filterStatus)

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Quay lại Hub</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Quản Lý Đơn Hàng</Text>
          <Text style={styles.headerSubtitle}>Xem và cập nhật đơn hàng khách hàng</Text>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Lọc theo trạng thái:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <TouchableOpacity
              style={[styles.filterButton, filterStatus === "all" && styles.filterButtonActive]}
              onPress={() => setFilterStatus("all")}
            >
              <Text style={[styles.filterButtonText, filterStatus === "all" && styles.filterButtonTextActive]}>
                Tất cả
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterStatus === "pending" && styles.filterButtonActive]}
              onPress={() => setFilterStatus("pending")}
            >
              <Text style={[styles.filterButtonText, filterStatus === "pending" && styles.filterButtonTextActive]}>
                Chờ xác nhận
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterStatus === "confirmed" && styles.filterButtonActive]}
              onPress={() => setFilterStatus("confirmed")}
            >
              <Text style={[styles.filterButtonText, filterStatus === "confirmed" && styles.filterButtonTextActive]}>
                Đã xác nhận
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterStatus === "shipping" && styles.filterButtonActive]}
              onPress={() => setFilterStatus("shipping")}
            >
              <Text style={[styles.filterButtonText, filterStatus === "shipping" && styles.filterButtonTextActive]}>
                Đang giao
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterStatus === "delivered" && styles.filterButtonActive]}
              onPress={() => setFilterStatus("delivered")}
            >
              <Text style={[styles.filterButtonText, filterStatus === "delivered" && styles.filterButtonTextActive]}>
                Đã giao
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding}>
          {loading ? (
            <Text style={styles.loadingText}>Đang tải...</Text>
          ) : filteredOrders.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có đơn hàng nào</Text>
          ) : (
            filteredOrders.map((order) => (
              <View key={order._id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <View style={styles.orderHeaderLeft}>
                    <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
                    <Text style={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString("vi-VN")}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                    <Text style={styles.statusText}>{getStatusLabel(order.status)}</Text>
                  </View>
                </View>

                <View style={styles.orderBody}>
                  <View style={styles.customerInfo}>
                    <Text style={styles.customerLabel}>Khách hàng:</Text>
                    <Text style={styles.customerName}>{order.customerName}</Text>
                    <Text style={styles.customerPhone}>📞 {order.customerPhone}</Text>
                    <Text style={styles.customerAddress}>📍 {order.customerAddress}</Text>
                  </View>

                  <View style={styles.itemsSection}>
                    <Text style={styles.itemsLabel}>Sản phẩm:</Text>
                    {order.items.map((item, index) => (
                      <View key={index} style={styles.itemRow}>
                        <Text style={styles.itemName}>
                          {item.productName} x {item.quantity}
                        </Text>
                        <Text style={styles.itemPrice}>{item.subtotal.toLocaleString("vi-VN")}đ</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Tổng tiền:</Text>
                    <Text style={styles.totalValue}>{order.totalAmount.toLocaleString("vi-VN")}đ</Text>
                  </View>

                  {order.notes && (
                    <View style={styles.notesSection}>
                      <Text style={styles.notesLabel}>Ghi chú:</Text>
                      <Text style={styles.notesText}>{order.notes}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.orderActions}>
                  <View style={styles.statusButtons}>
                    {order.status === "pending" && (
                      <TouchableOpacity
                        style={[styles.statusActionButton, styles.confirmButton]}
                        onPress={() => handleStatusChange(order._id, "confirmed")}
                      >
                        <Text style={styles.statusActionButtonText}>✓ Xác nhận</Text>
                      </TouchableOpacity>
                    )}
                    {order.status === "confirmed" && (
                      <TouchableOpacity
                        style={[styles.statusActionButton, styles.shipButton]}
                        onPress={() => handleStatusChange(order._id, "shipping")}
                      >
                        <Text style={styles.statusActionButtonText}>🚚 Giao hàng</Text>
                      </TouchableOpacity>
                    )}
                    {order.status === "shipping" && (
                      <TouchableOpacity
                        style={[styles.statusActionButton, styles.deliverButton]}
                        onPress={() => handleStatusChange(order._id, "delivered")}
                      >
                        <Text style={styles.statusActionButtonText}>✓ Đã giao</Text>
                      </TouchableOpacity>
                    )}
                    {order.status !== "delivered" && order.status !== "cancelled" && (
                      <TouchableOpacity
                        style={[styles.statusActionButton, styles.cancelButton]}
                        onPress={() => handleStatusChange(order._id, "cancelled")}
                      >
                        <Text style={styles.statusActionButtonText}>✗ Hủy</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteOrder(order._id)}>
                    <Text style={styles.deleteButtonText}>✗</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fafbfc",
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
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
  filterSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  filterScroll: {
    flexDirection: "row",
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
  },
  filterButtonTextActive: {
    color: "#fff",
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: 16,
  },
  loadingText: {
    textAlign: "center",
    color: "#666",
    fontSize: 14,
    marginTop: 20,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: 14,
    marginTop: 20,
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  orderHeaderLeft: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: "#999",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },
  orderBody: {
    gap: 12,
  },
  customerInfo: {
    gap: 4,
  },
  customerLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#666",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  customerPhone: {
    fontSize: 14,
    color: "#666",
  },
  customerAddress: {
    fontSize: 14,
    color: "#666",
  },
  itemsSection: {
    gap: 4,
  },
  itemsLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#666",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  itemName: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
  },
  notesSection: {
    backgroundColor: "#f9f9f9",
    padding: 8,
    borderRadius: 6,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },
  notesText: {
    fontSize: 13,
    color: "#333",
  },
  orderActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  statusButtons: {
    flexDirection: "row",
    flex: 1,
    gap: 8,
  },
  statusActionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
  },
  confirmButton: {
    backgroundColor: "#2196f3",
  },
  shipButton: {
    backgroundColor: "#9c27b0",
  },
  deliverButton: {
    backgroundColor: "#4caf50",
  },
  cancelButton: {
    backgroundColor: "#f44336",
  },
  statusActionButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f44336",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
})
