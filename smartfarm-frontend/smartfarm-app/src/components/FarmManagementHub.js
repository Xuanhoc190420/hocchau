"use client"

import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from "react-native"
import { COLORS } from "../styles/theme"
import { getCoops, getFeeds, getChickenTxs } from "../api/api"
import { useState, useEffect } from "react"

export default function FarmManagementHub({ onSelectFeature }) {
  const [stats, setStats] = useState({
    totalCoops: 0,
    totalFeeds: 0,
    totalChickens: 0,
    totalTransactions: 0,
    totalCosts: 0,
    totalRevenue: 0,
  })
  const [coops, setCoops] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const calculateChickenAge = (createdAt) => {
    if (!createdAt) return 0
    const createdDate = new Date(createdAt)
    const today = new Date()
    const diffTime = Math.abs(today - createdDate)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const weeks = Math.floor(diffDays / 7) + 1
    return weeks
  }

  const loadStats = async () => {
    try {
      console.log("[v0] Loading farm stats...")
      const [coopsData, feedsData, txData] = await Promise.all([getCoops(), getFeeds(), getChickenTxs()])

      console.log("[v0] Coops data:", coopsData)
      console.log("[v0] Feeds data:", feedsData)
      console.log("[v0] Transactions data:", txData)

      const totalChickens = (coopsData || []).reduce((sum, coop) => sum + (coop.chickens || 0), 0)
      const totalCosts = (coopsData || []).reduce((sum, coop) => {
        const chickenCost = coop.totalChickenCost || 0
        const feedCost = coop.totalFeedCost || 0
        return sum + chickenCost + feedCost
      }, 0)
      const totalRevenue = (coopsData || []).reduce((sum, coop) => sum + (coop.totalRevenue || 0), 0)

      setStats({
        totalCoops: (coopsData || []).length,
        totalFeeds: (feedsData || []).length,
        totalChickens: totalChickens,
        totalTransactions: (txData || []).length,
        totalCosts: totalCosts,
        totalRevenue: totalRevenue,
      })
      setCoops(coopsData || [])
      setLoading(false)
    } catch (error) {
      console.log("[v0] Error loading stats:", error.message)
      setLoading(false)
    }
  }

  const features = [
    {
      id: 1,
      title: "Tạo Chuồng",
      icon: "🏠",
      description: "Tạo chuồng gà mới",
      color: "#e3f2fd",
      borderColor: "#1976d2",
      onPress: () => {
        console.log("[v0] Selected: createCoop")
        onSelectFeature("createCoop")
      },
    },
    {
      id: 2,
      title: "Tạo Thức Ăn",
      icon: "🌾",
      description: "Tạo loại thức ăn mới",
      color: "#f3e5f5",
      borderColor: "#7b1fa2",
      onPress: () => {
        console.log("[v0] Selected: createFeed")
        onSelectFeature("createFeed")
      },
    },
    {
      id: 3,
      title: "Nhập Gà",
      icon: "⬇️",
      description: "Nhập gà vào chuồng",
      color: "#e8f5e9",
      borderColor: "#388e3c",
      onPress: () => {
        console.log("[v0] Selected: importChicken")
        onSelectFeature("importChicken")
      },
    },
    {
      id: 4,
      title: "Xuất Gà",
      icon: "⬆️",
      description: "Xuất gà khỏi chuồng",
      color: "#fff3e0",
      borderColor: "#f57c00",
      onPress: () => {
        console.log("[v0] Selected: exportChicken")
        onSelectFeature("exportChicken")
      },
    },
    {
      id: 5,
      title: "Quản Lý Sản Phẩm",
      icon: "🛒",
      description: "Tạo, sửa, xóa sản phẩm",
      color: "#fce4ec",
      borderColor: "#c2185b",
      onPress: () => {
        console.log("[v0] Selected: manageProducts")
        onSelectFeature("manageProducts")
      },
    },
    {
      id: 6,
      title: "Quản Lý Đơn Hàng",
      icon: "📦",
      description: "Xem và cập nhật đơn hàng",
      color: "#e1f5fe",
      borderColor: "#0288d1",
      onPress: () => {
        console.log("[v0] Selected: manageOrders")
        onSelectFeature("manageOrders")
      },
    },
    {
      id: 7,
      title: "Quản Lý Cửa Hàng",
      icon: "🏪",
      description: "Quản lý cửa hàng phở gà",
      color: "#fff9c4",
      borderColor: "#f57f17",
      onPress: () => {
        console.log("[v0] Selected: manageStores")
        onSelectFeature("manageStores")
      },
    },
  ]

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Quản Lí Trang Trại</Text>
          <Text style={styles.headerSubtitle}>Chọn chức năng để tiếp tục</Text>
        </View>

        <View style={styles.grid}>
          {features.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              style={[styles.featureCard, { backgroundColor: feature.color, borderColor: feature.borderColor }]}
              onPress={feature.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.featureIcon, { borderColor: feature.borderColor }]}>
                <Text style={styles.icon}>{feature.icon}</Text>
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Thống Kê Nhanh</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🐔</Text>
              <Text style={styles.statLabel}>Chuồng Gà</Text>
              <Text style={styles.statValue}>{stats.totalCoops}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🌾</Text>
              <Text style={styles.statLabel}>Loại Thức Ăn</Text>
              <Text style={styles.statValue}>{stats.totalFeeds}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🔢</Text>
              <Text style={styles.statLabel}>Tổng Gà</Text>
              <Text style={styles.statValue}>{stats.totalChickens}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>📊</Text>
              <Text style={styles.statLabel}>Giao Dịch</Text>
              <Text style={styles.statValue}>{stats.totalTransactions}</Text>
            </View>
          </View>

          <View style={styles.totalCostCard}>
            <Text style={styles.totalCostIcon}>💰</Text>
            <View style={styles.totalCostContent}>
              <Text style={styles.totalCostLabel}>Tổng Chi Phí Trang Trại</Text>
              <Text style={styles.totalCostValue}>{stats.totalCosts.toLocaleString("vi-VN")} đ</Text>
            </View>
          </View>

          <View style={styles.totalRevenueCard}>
            <Text style={styles.totalRevenueIcon}>💵</Text>
            <View style={styles.totalRevenueContent}>
              <Text style={styles.totalRevenueLabel}>Tổng Doanh Thu Bán Gà</Text>
              <Text style={styles.totalRevenueValue}>{stats.totalRevenue.toLocaleString("vi-VN")} đ</Text>
            </View>
          </View>

          {coops.length > 0 && (
            <View style={styles.coopListSection}>
              <Text style={styles.coopListTitle}>Chi Tiết Từng Chuồng</Text>
              {coops.map((coop) => {
                const chickenCost = coop.totalChickenCost || 0
                const feedCost = coop.totalFeedCost || 0
                const totalCoopCost = chickenCost + feedCost
                const revenue = coop.totalRevenue || 0
                const chickens = coop.chickens || 0
                const status = chickens > 0 ? "Hoạt động" : "Đang trống"
                const chickenAgeWeeks = calculateChickenAge(coop.createdAt)

                return (
                  <View key={coop._id} style={styles.coopDetailCard}>
                    <View style={styles.coopDetailHeader}>
                      <View style={styles.coopDetailNameRow}>
                        <Text style={styles.coopDetailIcon}>🏠</Text>
                        <Text style={styles.coopDetailName}>{coop.name}</Text>
                      </View>
                      <View
                        style={[
                          styles.coopStatusBadge,
                          chickens > 0 ? styles.coopStatusActive : styles.coopStatusEmpty,
                        ]}
                      >
                        <Text
                          style={[
                            styles.coopStatusText,
                            chickens > 0 ? styles.coopStatusTextActive : styles.coopStatusTextEmpty,
                          ]}
                        >
                          {status}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.coopDetailBody}>
                      <View style={styles.coopDetailRow}>
                        <Text style={styles.coopDetailLabel}>Số gà:</Text>
                        <Text style={styles.coopDetailValue}>{chickens} con</Text>
                      </View>

                      {chickens > 0 && (
                        <View style={styles.coopDetailRow}>
                          <Text style={styles.coopDetailLabel}>Tuần tuổi gà:</Text>
                          <Text style={[styles.coopDetailValue, styles.chickenAgeValue]}>
                            Đang tuần {chickenAgeWeeks}
                          </Text>
                        </View>
                      )}

                      <View style={styles.coopDetailRow}>
                        <Text style={styles.coopDetailLabel}>Tiền đã dùng:</Text>
                        <Text style={[styles.coopDetailValue, styles.coopDetailCost]}>
                          {totalCoopCost.toLocaleString("vi-VN")} đ
                        </Text>
                      </View>

                      {chickenCost > 0 && (
                        <View style={styles.coopDetailSubRow}>
                          <Text style={styles.coopDetailSubLabel}>• Chi phí giống:</Text>
                          <Text style={styles.coopDetailSubValue}>{chickenCost.toLocaleString("vi-VN")} đ</Text>
                        </View>
                      )}

                      {feedCost > 0 && (
                        <View style={styles.coopDetailSubRow}>
                          <Text style={styles.coopDetailSubLabel}>• Chi phí thức ăn:</Text>
                          <Text style={styles.coopDetailSubValue}>{feedCost.toLocaleString("vi-VN")} đ</Text>
                        </View>
                      )}

                      {revenue > 0 && (
                        <View style={styles.coopDetailRow}>
                          <Text style={styles.coopDetailLabel}>Tiền bán gà:</Text>
                          <Text style={[styles.coopDetailValue, styles.coopDetailRevenue]}>
                            {revenue.toLocaleString("vi-VN")} đ
                          </Text>
                        </View>
                      )}
                    </View>

                    {coop.createdAt && (
                      <Text style={styles.coopDetailDate}>
                        Tạo ngày: {new Date(coop.createdAt).toLocaleDateString("vi-VN")}
                      </Text>
                    )}
                  </View>
                )
              })}
            </View>
          )}
        </View>
      </ScrollView>
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
    backgroundColor: "#fafbfc",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
  grid: {
    paddingHorizontal: 12,
    paddingVertical: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    width: "48%",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 12,
    borderWidth: 2,
  },
  icon: {
    fontSize: 32,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 6,
    textAlign: "center",
  },
  featureDescription: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  statsSection: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "#666",
    fontWeight: "600",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
  },
  totalCostCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  totalCostIcon: {
    fontSize: 36,
    marginRight: 12,
  },
  totalCostContent: {
    flex: 1,
  },
  totalCostLabel: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
    marginBottom: 4,
  },
  totalCostValue: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.primary,
  },
  totalRevenueCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#2e7d32",
  },
  totalRevenueIcon: {
    fontSize: 36,
    marginRight: 12,
  },
  totalRevenueContent: {
    flex: 1,
  },
  totalRevenueLabel: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
    marginBottom: 4,
  },
  totalRevenueValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2e7d32",
  },
  coopListSection: {
    marginTop: 20,
  },
  coopListTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 12,
  },
  coopDetailCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  coopDetailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  coopDetailNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  coopDetailIcon: {
    fontSize: 24,
  },
  coopDetailName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  coopStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  coopStatusActive: {
    backgroundColor: "#e8f5e9",
  },
  coopStatusEmpty: {
    backgroundColor: "#fafafa",
  },
  coopStatusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  coopStatusTextActive: {
    color: "#2e7d32",
  },
  coopStatusTextEmpty: {
    color: "#999",
  },
  coopDetailBody: {
    gap: 8,
  },
  coopDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  coopDetailLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  coopDetailValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "700",
  },
  chickenAgeValue: {
    color: "#2e7d32",
  },
  coopDetailCost: {
    color: "#d32f2f",
  },
  coopDetailRevenue: {
    color: "#2e7d32",
  },
  coopDetailSubRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 12,
    paddingVertical: 2,
  },
  coopDetailSubLabel: {
    fontSize: 12,
    color: "#888",
  },
  coopDetailSubValue: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
  },
  coopDetailDate: {
    fontSize: 11,
    color: "#999",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
})
