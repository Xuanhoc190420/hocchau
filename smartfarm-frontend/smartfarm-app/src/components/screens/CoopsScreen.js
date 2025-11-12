"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList } from "react-native"
import { COLORS } from "../../styles/theme"
import { getCoops } from "../../api/api"

export default function CoopsScreen() {
  const [coops, setCoops] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCoops()
  }, [])

  const loadCoops = async () => {
    try {
      setLoading(true)
      const data = await getCoops()
      setCoops(data || [])
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải danh sách chuồng: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const renderCoopCard = ({ item }) => (
    <View style={styles.coopCard}>
      <View style={styles.coopHeader}>
        <View style={[styles.coopIconContainer, { backgroundColor: "#c8e6c9" }]}>
          <Text style={styles.coopIcon}>🏠</Text>
        </View>
        <View style={styles.coopInfo}>
          <Text style={styles.coopName}>{item.name}</Text>
          {item.location && <Text style={styles.coopLocation}>📍 {item.location}</Text>}
        </View>
      </View>

      <View style={styles.coopStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Số Gà</Text>
          <Text style={styles.statValue}>{item.chickens || 0}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Trạng Thái</Text>
          <Text style={[styles.statValue, styles.statusActive]}>Hoạt Động</Text>
        </View>
      </View>

      {item.notes && (
        <View style={styles.coopNotes}>
          <Text style={styles.notesLabel}>Ghi chú:</Text>
          <Text style={styles.notesText}>{item.notes}</Text>
        </View>
      )}

      <View style={styles.coopFooter}>
        <Text style={styles.createdDate}>Tạo ngày: {new Date(item.createdAt).toLocaleDateString("vi-VN")}</Text>
      </View>
    </View>
  )

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Trang Trại</Text>
        </View>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trang Trại Của Tôi</Text>
        <Text style={styles.headerSubtitle}>{coops.length} chuồng gà</Text>
      </View>

      {coops.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🐔</Text>
          <Text style={styles.emptyTitle}>Chưa Có Chuồng Nào</Text>
          <Text style={styles.emptyText}>Hãy tạo chuồng gà đầu tiên trong phần Quản lí trang trại</Text>
        </View>
      ) : (
        <FlatList
          data={coops}
          keyExtractor={(item) => item._id}
          renderItem={renderCoopCard}
          contentContainerStyle={styles.listContent}
          scrollEnabled={false}
        />
      )}

      {/* Summary Section */}
      {coops.length > 0 && (
        <View style={styles.summarySection}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Tổng Chuồng</Text>
            <Text style={styles.summaryValue}>{coops.length}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Tổng Gà</Text>
            <Text style={styles.summaryValue}>{coops.reduce((sum, c) => sum + (c.chickens || 0), 0)}</Text>
          </View>
        </View>
      )}

      {/* Refresh Button */}
      <TouchableOpacity style={styles.refreshButton} onPress={loadCoops}>
        <Text style={styles.refreshButtonText}>↻ Làm Mới</Text>
      </TouchableOpacity>
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

  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    paddingBottom: 32,
  },

  coopCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.primary,
  },
  coopHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  coopIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  coopIcon: {
    fontSize: 32,
  },
  coopInfo: {
    flex: 1,
  },
  coopName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  coopLocation: {
    fontSize: 12,
    color: "#666",
  },

  coopStats: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
  },
  statusActive: {
    color: "#4caf50",
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: "#e0e0e0",
  },

  coopNotes: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fffde7",
    borderTopWidth: 1,
    borderTopColor: "#fff9c4",
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#f57f17",
    marginBottom: 4,
  },
  notesText: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },

  coopFooter: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#fafbfc",
  },
  createdDate: {
    fontSize: 11,
    color: "#999",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },

  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
    color: "#666",
  },

  summarySection: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.primary,
  },

  refreshButton: {
    marginHorizontal: 12,
    marginVertical: 10,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  refreshButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
})
