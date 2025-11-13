"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from "react-native"
import { getStores, createStore, updateStore, deleteStore } from "../../api/api"

export default function StoreManagerScreen({ onBack }) {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingStore, setEditingStore] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    coordinates: { lat: "", lng: "" },
    phone: "",
    image: "",
    openingHours: "08:00 - 22:00",
    status: "active",
    description: "",
    rating: "5",
  })

  useEffect(() => {
    loadStores()
  }, [])

  const loadStores = async () => {
    try {
      setLoading(true)
      const data = await getStores()
      setStores(data)
    } catch (error) {
      console.error("[v0] Error loading stores:", error)
      Alert.alert("Lỗi", "Không thể tải danh sách cửa hàng")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (store = null) => {
    if (store) {
      setEditingStore(store)
      setFormData({
        name: store.name,
        address: store.address,
        coordinates: {
          lat: store.coordinates.lat.toString(),
          lng: store.coordinates.lng.toString(),
        },
        phone: store.phone,
        image: store.image || "",
        openingHours: store.openingHours,
        status: store.status,
        description: store.description || "",
        rating: store.rating.toString(),
      })
    } else {
      setEditingStore(null)
      setFormData({
        name: "",
        address: "",
        coordinates: { lat: "", lng: "" },
        phone: "",
        image: "",
        openingHours: "08:00 - 22:00",
        status: "active",
        description: "",
        rating: "5",
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingStore(null)
  }

  const handleSubmit = async () => {
    console.log("[v0] Form data before validation:", formData)

    if (
      !formData.name ||
      !formData.address ||
      !formData.coordinates.lat ||
      !formData.coordinates.lng ||
      !formData.phone
    ) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin bắt buộc (Tên cửa hàng, Địa chỉ, Tọa độ, Số điện thoại)")
      return
    }

    const lat = Number.parseFloat(formData.coordinates.lat)
    const lng = Number.parseFloat(formData.coordinates.lng)
    const rating = Number.parseFloat(formData.rating)

    if (isNaN(lat) || isNaN(lng)) {
      Alert.alert("Lỗi", "Tọa độ phải là số hợp lệ")
      return
    }

    if (isNaN(rating) || rating < 0 || rating > 5) {
      Alert.alert("Lỗi", "Đánh giá phải là số từ 0 đến 5")
      return
    }

    try {
      const payload = {
        name: formData.name,
        address: formData.address,
        coordinates: { lat, lng },
        phone: formData.phone,
        image: formData.image,
        openingHours: formData.openingHours,
        status: formData.status,
        description: formData.description,
        rating,
      }

      console.log("[v0] Payload to send:", payload)

      if (editingStore) {
        console.log("[v0] Updating store:", editingStore._id)
        await updateStore(editingStore._id, payload)
        Alert.alert("Thành công", "Cập nhật cửa hàng thành công")
      } else {
        console.log("[v0] Creating new store")
        const result = await createStore(payload)
        console.log("[v0] Create store result:", result)
        Alert.alert("Thành công", "Tạo cửa hàng mới thành công")
      }

      handleCloseModal()
      loadStores()
    } catch (error) {
      console.error("[v0] Error saving store:", error)
      console.error("[v0] Error details:", error.message, error.response?.data)
      Alert.alert("Lỗi", error.response?.data?.message || error.message || "Không thể lưu cửa hàng")
    }
  }

  const handleDelete = async (storeId) => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc muốn xóa cửa hàng này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteStore(storeId)
            Alert.alert("Thành công", "Xóa cửa hàng thành công")
            loadStores()
          } catch (error) {
            console.error("[v0] Error deleting store:", error)
            Alert.alert("Lỗi", "Không thể xóa cửa hàng")
          }
        },
      },
    ])
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "#52b788"
      case "closed":
        return "#e63946"
      case "temporarily_closed":
        return "#f77f00"
      default:
        return "#666"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Đang hoạt động"
      case "closed":
        return "Đã đóng cửa"
      case "temporarily_closed":
        return "Tạm ngưng"
      default:
        return status
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý cửa hàng phở gà</Text>
      </View>

      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.addButton} onPress={() => handleOpenModal()}>
          <Text style={styles.addButtonText}>+ Thêm cửa hàng</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <Text style={styles.loadingText}>Đang tải...</Text>
        ) : stores.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🏪</Text>
            <Text style={styles.emptyText}>Chưa có cửa hàng nào</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={() => handleOpenModal()}>
              <Text style={styles.emptyButtonText}>Tạo cửa hàng đầu tiên</Text>
            </TouchableOpacity>
          </View>
        ) : (
          stores.map((store) => (
            <View key={store._id} style={styles.storeCard}>
              <View style={styles.storeHeader}>
                <View style={styles.storeTitleRow}>
                  <Text style={styles.storeName}>🏪 {store.name}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(store.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(store.status)}</Text>
                  </View>
                </View>
                <View style={styles.ratingRow}>
                  <Text style={styles.ratingText}>⭐ {store.rating}/5</Text>
                </View>
              </View>

              <View style={styles.storeInfo}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>📍</Text>
                  <Text style={styles.infoText}>{store.address}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>📱</Text>
                  <Text style={styles.infoText}>{store.phone}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>🕒</Text>
                  <Text style={styles.infoText}>{store.openingHours}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>📌</Text>
                  <Text style={styles.infoText}>
                    Tọa độ: {store.coordinates.lat.toFixed(6)}, {store.coordinates.lng.toFixed(6)}
                  </Text>
                </View>
                {store.description && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>📝</Text>
                    <Text style={styles.infoText}>{store.description}</Text>
                  </View>
                )}
              </View>

              <View style={styles.storeActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => handleOpenModal(store)}
                >
                  <Text style={styles.actionButtonText}>✏️ Sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDelete(store._id)}
                >
                  <Text style={styles.actionButtonText}>🗑️ Xóa</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingStore ? "Sửa cửa hàng" : "Thêm cửa hàng mới"}</Text>
              <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <Text style={styles.label}>Tên cửa hàng *</Text>
              <TextInput
                style={styles.input}
                placeholder="Phở Gà Đông Tảo"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />

              <Text style={styles.label}>Địa chỉ *</Text>
              <TextInput
                style={styles.input}
                placeholder="123 Nguyễn Văn A, Quận 1, TP.HCM"
                value={formData.address}
                onChangeText={(text) => setFormData({ ...formData, address: text })}
                multiline
              />

              <Text style={styles.label}>Vĩ độ (Latitude) *</Text>
              <TextInput
                style={styles.input}
                placeholder="10.762622"
                value={formData.coordinates.lat}
                onChangeText={(text) =>
                  setFormData({ ...formData, coordinates: { ...formData.coordinates, lat: text } })
                }
                keyboardType="numeric"
              />

              <Text style={styles.label}>Kinh độ (Longitude) *</Text>
              <TextInput
                style={styles.input}
                placeholder="106.660172"
                value={formData.coordinates.lng}
                onChangeText={(text) =>
                  setFormData({ ...formData, coordinates: { ...formData.coordinates, lng: text } })
                }
                keyboardType="numeric"
              />

              <Text style={styles.label}>Số điện thoại *</Text>
              <TextInput
                style={styles.input}
                placeholder="0901234567"
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                keyboardType="phone-pad"
              />

              <Text style={styles.label}>URL hình ảnh</Text>
              <TextInput
                style={styles.input}
                placeholder="https://example.com/store.jpg"
                value={formData.image}
                onChangeText={(text) => setFormData({ ...formData, image: text })}
              />

              <Text style={styles.label}>Giờ mở cửa</Text>
              <TextInput
                style={styles.input}
                placeholder="08:00 - 22:00"
                value={formData.openingHours}
                onChangeText={(text) => setFormData({ ...formData, openingHours: text })}
              />

              <Text style={styles.label}>Mô tả</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Chuyên phở gà ngon, không gian thoáng mát..."
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                multiline
                numberOfLines={3}
              />

              <Text style={styles.label}>Đánh giá (0-5)</Text>
              <TextInput
                style={styles.input}
                placeholder="5"
                value={formData.rating}
                onChangeText={(text) => setFormData({ ...formData, rating: text })}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Trạng thái</Text>
              <View style={styles.statusPicker}>
                <TouchableOpacity
                  style={[styles.statusOption, formData.status === "active" && styles.statusOptionSelected]}
                  onPress={() => setFormData({ ...formData, status: "active" })}
                >
                  <Text
                    style={[styles.statusOptionText, formData.status === "active" && styles.statusOptionTextSelected]}
                  >
                    Đang hoạt động
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.statusOption, formData.status === "temporarily_closed" && styles.statusOptionSelected]}
                  onPress={() => setFormData({ ...formData, status: "temporarily_closed" })}
                >
                  <Text
                    style={[
                      styles.statusOptionText,
                      formData.status === "temporarily_closed" && styles.statusOptionTextSelected,
                    ]}
                  >
                    Tạm ngưng
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.statusOption, formData.status === "closed" && styles.statusOptionSelected]}
                  onPress={() => setFormData({ ...formData, status: "closed" })}
                >
                  <Text
                    style={[styles.statusOptionText, formData.status === "closed" && styles.statusOptionTextSelected]}
                  >
                    Đã đóng cửa
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ height: 100 }} />
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCloseModal}>
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
                <Text style={styles.saveButtonText}>{editingStore ? "Cập nhật" : "Tạo mới"}</Text>
              </TouchableOpacity>
            </View>
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
  toolbar: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#d8f3dc",
  },
  addButton: {
    backgroundColor: "#52b788",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 14,
    color: "#74c69d",
    marginTop: 24,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#74c69d",
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: "#52b788",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  storeCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  storeHeader: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#d8f3dc",
  },
  storeTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  storeName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1b4332",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    color: "#f77f00",
    fontWeight: "600",
  },
  storeInfo: {
    gap: 8,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  infoIcon: {
    fontSize: 14,
    marginTop: 2,
  },
  infoText: {
    fontSize: 14,
    color: "#2d6a4f",
    flex: 1,
  },
  storeActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#52b788",
  },
  deleteButton: {
    backgroundColor: "#e63946",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    maxHeight: "90%",
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#d8f3dc",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1b4332",
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontSize: 20,
    color: "#666",
    fontWeight: "600",
  },
  modalScroll: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1b4332",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#b7e4c7",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  statusPicker: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  statusOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#b7e4c7",
    backgroundColor: "#fff",
  },
  statusOptionSelected: {
    backgroundColor: "#52b788",
    borderColor: "#52b788",
  },
  statusOptionText: {
    fontSize: 13,
    color: "#2d6a4f",
    fontWeight: "600",
  },
  statusOptionTextSelected: {
    color: "#fff",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#d8f3dc",
    backgroundColor: "#fff",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#2d6a4f",
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
})
