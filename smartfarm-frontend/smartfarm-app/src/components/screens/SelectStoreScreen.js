"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native"
import { getNearestStores } from "../../api/api"

export default function SelectStoreScreen({ onBack, onSelectStore, customerLocation }) {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNearestStores()
  }, [])

  const loadNearestStores = async () => {
    try {
      setLoading(true)
      // Use customer location if provided, otherwise use default location (Ho Chi Minh City center)
      const lat = customerLocation?.lat || 10.762622
      const lng = customerLocation?.lng || 106.660172

      const data = await getNearestStores(lat, lng, 10)
      setStores(data)
    } catch (error) {
      console.error("[v0] Error loading nearest stores:", error)
      Alert.alert("Lỗi", "Không thể tải danh sách cửa hàng gần bạn")
    } finally {
      setLoading(false)
    }
  }

  const handleSelectStore = (store) => {
    onSelectStore(store)
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
        <Text style={styles.headerTitle}>Chọn cửa hàng gần bạn</Text>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <Text style={styles.loadingText}>Đang tìm cửa hàng gần bạn...</Text>
        ) : stores.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🏪</Text>
            <Text style={styles.emptyText}>Không tìm thấy cửa hàng nào gần bạn</Text>
          </View>
        ) : (
          <>
            <View style={styles.infoBox}>
              <Text style={styles.infoIcon}>📍</Text>
              <Text style={styles.infoText}>Tìm thấy {stores.length} cửa hàng gần bạn. Chọn cửa hàng để đặt hàng.</Text>
            </View>

            {stores.map((store, index) => (
              <TouchableOpacity
                key={store._id}
                style={styles.storeCard}
                onPress={() => handleSelectStore(store)}
                disabled={store.status !== "active"}
              >
                <View style={styles.storeHeader}>
                  <View style={styles.storeTitleRow}>
                    <View style={styles.storeNameRow}>
                      <Text style={styles.storeRank}>#{index + 1}</Text>
                      <Text style={styles.storeName}>{store.name}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(store.status) }]}>
                      <Text style={styles.statusText}>{getStatusText(store.status)}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.distanceRow}>
                  <Text style={styles.distanceIcon}>📏</Text>
                  <Text style={styles.distanceText}>Cách bạn {store.distance} km</Text>
                </View>

                <View style={styles.storeInfo}>
                  <View style={styles.infoRow}>
                    <Text style={styles.detailIcon}>📍</Text>
                    <Text style={styles.detailText}>{store.address}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.detailIcon}>📱</Text>
                    <Text style={styles.detailText}>{store.phone}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.detailIcon}>🕒</Text>
                    <Text style={styles.detailText}>{store.openingHours}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.detailIcon}>⭐</Text>
                    <Text style={styles.detailText}>Đánh giá: {store.rating}/5</Text>
                  </View>
                  {store.description && (
                    <View style={styles.infoRow}>
                      <Text style={styles.detailIcon}>💬</Text>
                      <Text style={styles.detailText}>{store.description}</Text>
                    </View>
                  )}
                </View>

                {store.status === "active" ? (
                  <View style={styles.selectButton}>
                    <Text style={styles.selectButtonText}>Chọn cửa hàng này</Text>
                  </View>
                ) : (
                  <View style={styles.closedButton}>
                    <Text style={styles.closedButtonText}>Cửa hàng đang đóng cửa</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
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
    textAlign: "center",
  },
  infoBox: {
    backgroundColor: "#d8f3dc",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  infoIcon: {
    fontSize: 24,
  },
  infoText: {
    fontSize: 14,
    color: "#1b4332",
    flex: 1,
    fontWeight: "600",
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
  },
  storeNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  storeRank: {
    fontSize: 20,
    fontWeight: "700",
    color: "#52b788",
  },
  storeName: {
    fontSize: 16,
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
  distanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#d8f3dc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  distanceIcon: {
    fontSize: 20,
  },
  distanceText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1b4332",
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
  detailIcon: {
    fontSize: 14,
    marginTop: 2,
  },
  detailText: {
    fontSize: 14,
    color: "#2d6a4f",
    flex: 1,
  },
  selectButton: {
    backgroundColor: "#52b788",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  selectButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  closedButton: {
    backgroundColor: "#e5e5e5",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  closedButtonText: {
    color: "#999",
    fontSize: 15,
    fontWeight: "700",
  },
})
