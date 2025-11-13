"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from "react-native"
import { useState, useEffect } from "react"
import { COLORS } from "../../styles/theme"
import { getStores } from "../../api/api"

export default function StoreChainScreen() {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStores()
  }, [])

  const fetchStores = async () => {
    try {
      const data = await getStores()
      // Group stores by district
      const groupedStores = groupByDistrict(data)
      setStores(groupedStores)
    } catch (error) {
      console.error("Error fetching stores:", error)
    } finally {
      setLoading(false)
    }
  }

  const groupByDistrict = (storeList) => {
    const districts = {}
    storeList.forEach((store) => {
      // Extract district from address
      const districtMatch = store.address.match(/Quận\s+(\d+|[A-Za-z]+)/i)
      const district = districtMatch ? districtMatch[1] : "Khác"

      if (!districts[district]) {
        districts[district] = []
      }
      districts[district].push(store)
    })
    return districts
  }

  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`)
  }

  const handleViewMap = (latitude, longitude, name) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    Linking.openURL(url)
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Đang tải danh sách cửa hàng...</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      {/* Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>🐔 Gà Đồi Hoàng Long</Text>
          <Text style={styles.bannerSubtitle}>Chuyên phở gà ngon, không gian thoáng mát</Text>
          <Text style={styles.bannerPromo}>⭐ Ưu đãi đặc biệt cho khách hàng thân thiết</Text>
        </View>
      </View>

      {/* Store Chain Title */}
      <View style={styles.chainHeader}>
        <Text style={styles.chainTitle}>CHUỖI CỬA HÀNG</Text>
      </View>

      {/* System Title */}
      <View style={styles.systemHeader}>
        <Text style={styles.systemTitle}>HỆ THỐNG PHỞ GÀ HOÀNG LONG</Text>
      </View>

      {/* Store List by District */}
      <View style={styles.storesContainer}>
        {Object.keys(stores).length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Chưa có cửa hàng nào</Text>
          </View>
        ) : (
          Object.keys(stores)
            .sort()
            .map((district) => (
              <View key={district} style={styles.districtSection}>
                <View style={styles.districtHeader}>
                  <Text style={styles.districtTitle}>QUẬN {district.toUpperCase()}</Text>
                </View>

                {stores[district].map((store) => (
                  <View key={store._id} style={styles.storeCard}>
                    <View style={styles.storeInfo}>
                      <Text style={styles.storeName}>{store.name}</Text>

                      <View style={styles.storeDetail}>
                        <Text style={styles.detailIcon}>📍</Text>
                        <Text style={styles.detailText}>Địa chỉ: {store.address}</Text>
                      </View>

                      <View style={styles.storeDetail}>
                        <Text style={styles.detailIcon}>📞</Text>
                        <Text style={styles.detailText}>Điện thoại: {store.phone}</Text>
                      </View>

                      <View style={styles.storeDetail}>
                        <Text style={styles.detailIcon}>🕐</Text>
                        <Text style={styles.detailText}>Giờ mở cửa: {store.openingHours}</Text>
                      </View>

                      {store.rating > 0 && (
                        <View style={styles.storeDetail}>
                          <Text style={styles.detailIcon}>⭐</Text>
                          <Text style={styles.detailText}>
                            Đánh giá: {store.rating}/5 ({store.totalReviews || 0} lượt)
                          </Text>
                        </View>
                      )}

                      <View style={styles.storeActions}>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleViewMap(store.location.latitude, store.location.longitude, store.name)}
                        >
                          <Text style={styles.actionButtonText}>Xem bản đồ</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButtonCall} onPress={() => handleCall(store.phone)}>
                          <Text style={styles.actionButtonCallText}>Gọi ngay</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {store.status && (
                      <View
                        style={[
                          styles.statusBadge,
                          store.status === "active" && styles.statusActive,
                          store.status === "paused" && styles.statusPaused,
                          store.status === "closed" && styles.statusClosed,
                        ]}
                      >
                        <Text style={styles.statusText}>
                          {store.status === "active" && "Đang hoạt động"}
                          {store.status === "paused" && "Tạm ngừng"}
                          {store.status === "closed" && "Đã đóng cửa"}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            ))
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#666",
  },
  banner: {
    backgroundColor: COLORS.primary,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  bannerContent: {
    alignItems: "center",
    gap: 8,
  },
  bannerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
  },
  bannerSubtitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    opacity: 0.95,
  },
  bannerPromo: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    opacity: 0.9,
    marginTop: 4,
  },
  chainHeader: {
    backgroundColor: COLORS.primaryDark,
    paddingVertical: 16,
    alignItems: "center",
  },
  chainTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFD700",
    letterSpacing: 1,
  },
  systemHeader: {
    backgroundColor: "#f8f9fa",
    paddingVertical: 20,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  systemTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primaryDark,
    letterSpacing: 0.5,
  },
  storesContainer: {
    padding: 20,
    gap: 24,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
  districtSection: {
    marginBottom: 20,
  },
  districtHeader: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  districtTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  storeCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    position: "relative",
  },
  storeInfo: {
    gap: 10,
  },
  storeName: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primaryDark,
    marginBottom: 4,
  },
  storeDetail: {
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
    color: "#555",
    flex: 1,
    lineHeight: 20,
  },
  storeActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.primary,
  },
  actionButtonCall: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  actionButtonCallText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
  },
  statusBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: "#4caf50",
  },
  statusPaused: {
    backgroundColor: "#ff9800",
  },
  statusClosed: {
    backgroundColor: "#f44336",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },
})
