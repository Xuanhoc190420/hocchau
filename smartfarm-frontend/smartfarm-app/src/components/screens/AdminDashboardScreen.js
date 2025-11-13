"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, FlatList, RefreshControl } from "react-native"
import { COLORS } from "../../styles/theme"
import axios from "axios"
import { API_BASE } from "../../api/api"

export default function AdminDashboardScreen({ user, onLogout, onNavigateToStoreManager, onNavigateToHomeContent }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [users, setUsers] = useState([])
  const [coops, setCoops] = useState([])
  const [products, setProducts] = useState([])
  const [feeds, setFeeds] = useState([])
  const [chickens, setChickens] = useState([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    setLoading(true)
    try {
      if (activeTab === "users") {
        const res = await axios.get(`${API_BASE}/api/users/all`)
        setUsers(res.data.users || [])
      } else if (activeTab === "coops") {
        const res = await axios.get(`${API_BASE}/api/coops`)
        setCoops(res.data.data || [])
      } else if (activeTab === "products") {
        const res = await axios.get(`${API_BASE}/api/products`)
        setProducts(res.data.data || [])
      } else if (activeTab === "feeds") {
        const res = await axios.get(`${API_BASE}/api/feed`)
        setFeeds(res.data.data || [])
      } else if (activeTab === "chickens") {
        const res = await axios.get(`${API_BASE}/api/chickens`)
        setChickens(res.data.data || [])
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải dữ liệu")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    loadData()
  }

  const renderOverview = () => (
    <View style={styles.overviewContainer}>
      <Text style={styles.sectionTitle}>Thống Kê Tổng Quan</Text>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{users.length}</Text>
          <Text style={styles.statLabel}>Người Dùng</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{coops.length}</Text>
          <Text style={styles.statLabel}>Chuồng Gà</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{products.length}</Text>
          <Text style={styles.statLabel}>Sản Phẩm</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{feeds.length}</Text>
          <Text style={styles.statLabel}>Loại Thức Ăn</Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Thông Tin Admin</Text>
        <Text style={styles.infoText}>Tên: {user?.fullName}</Text>
        <Text style={styles.infoText}>Email: {user?.email}</Text>
        <Text style={styles.infoText}>Vai trò: Admin</Text>
      </View>

      <TouchableOpacity style={styles.quickActionButton} onPress={onNavigateToStoreManager}>
        <Text style={styles.quickActionIcon}>🏪</Text>
        <Text style={styles.quickActionText}>Quản Lý Cửa Hàng Phở Gà</Text>
        <Text style={styles.quickActionArrow}>→</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.quickActionButton, { backgroundColor: "#52b788" }]}
        onPress={onNavigateToHomeContent}
      >
        <Text style={styles.quickActionIcon}>🏠</Text>
        <Text style={styles.quickActionText}>Quản Lý Nội Dung Trang Chủ</Text>
        <Text style={styles.quickActionArrow}>→</Text>
      </TouchableOpacity>
    </View>
  )

  const renderUsers = () => (
    <FlatList
      data={users}
      keyExtractor={(item) => item._id}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          <Text style={styles.itemName}>{item.fullName}</Text>
          <Text style={styles.itemEmail}>{item.email}</Text>
          <View style={styles.itemRow}>
            <Text style={styles.itemRole}>{item.role === "admin" ? "Admin" : "Khách Hàng"}</Text>
            <Text style={styles.itemPhone}>{item.phone || "N/A"}</Text>
          </View>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.emptyText}>Không có dữ liệu</Text>}
    />
  )

  const renderCoops = () => (
    <FlatList
      data={coops}
      keyExtractor={(item) => item._id}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemEmail}>Sức chứa: {item.capacity || "N/A"}</Text>
          <Text style={styles.itemEmail}>Vị trí: {item.location || "N/A"}</Text>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.emptyText}>Không có dữ liệu</Text>}
    />
  )

  const renderProducts = () => (
    <FlatList
      data={products}
      keyExtractor={(item) => item._id}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          <Text style={styles.itemName}>{item.name}</Text>
          <View style={styles.itemRow}>
            <Text style={styles.itemEmail}>Giá: {item.price?.toLocaleString()}đ</Text>
            <Text style={styles.itemPhone}>SL: {item.quantity}</Text>
          </View>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.emptyText}>Không có dữ liệu</Text>}
    />
  )

  const renderFeeds = () => (
    <FlatList
      data={feeds}
      keyExtractor={(item) => item._id}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          <Text style={styles.itemName}>{item.name}</Text>
          <View style={styles.itemRow}>
            <Text style={styles.itemEmail}>Loại: {item.type || "N/A"}</Text>
            <Text style={styles.itemPhone}>SL: {item.quantity}kg</Text>
          </View>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.emptyText}>Không có dữ liệu</Text>}
    />
  )

  const renderChickens = () => (
    <FlatList
      data={chickens}
      keyExtractor={(item) => item._id}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          <Text style={styles.itemName}>{item.type || "Gà"}</Text>
          <View style={styles.itemRow}>
            <Text style={styles.itemEmail}>Số lượng: {item.quantity}</Text>
            <Text style={styles.itemPhone}>{item.status || "Bình thường"}</Text>
          </View>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.emptyText}>Không có dữ liệu</Text>}
    />
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bảng Điều Khiển Admin</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutBtnText}>Đăng Xuất</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
        {["overview", "users", "coops", "products", "feeds", "chickens"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab === "overview" && "Tổng Quan"}
              {tab === "users" && "Người Dùng"}
              {tab === "coops" && "Chuồng"}
              {tab === "products" && "Sản Phẩm"}
              {tab === "feeds" && "Thức Ăn"}
              {tab === "chickens" && "Gà"}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {activeTab === "overview" && renderOverview()}
        {activeTab === "users" && renderUsers()}
        {activeTab === "coops" && renderCoops()}
        {activeTab === "products" && renderProducts()}
        {activeTab === "feeds" && renderFeeds()}
        {activeTab === "chickens" && renderChickens()}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  logoutBtn: {
    backgroundColor: "#d9534f",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  tabContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#999",
  },
  activeTabText: {
    color: COLORS.primary,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  overviewContainer: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
  },
  statLabel: {
    fontSize: 12,
    color: "#fff",
    marginTop: 4,
  },
  infoBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    gap: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: "#666",
  },
  listItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
  },
  itemEmail: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  itemPhone: {
    fontSize: 12,
    color: "#666",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  itemRole: {
    fontSize: 11,
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 40,
    fontSize: 14,
  },
  quickActionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  quickActionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  quickActionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
  quickActionArrow: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "700",
  },
})
