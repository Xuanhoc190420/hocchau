"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from "react-native"
import { COLORS } from "../styles/theme"

export default function Header({ currentTab, onTabChange, currentUser, onLogout, onLogin, cartCount = 0 }) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchText, setSearchText] = useState("")

  const navItems = [
    { id: "Home", label: "Trang chủ" },
    { id: "Products", label: "Sản phẩm" },
    { id: "Coops", label: "Trang trại" },
    { id: "IoT", label: "Hệ thống IoT" },
    { id: "Farm", label: "Quản lí trang trại" },
  ]

  const handleSearch = (text) => {
    setSearchText(text)
  }

  const handleNavClick = (id) => {
    onTabChange(id)
  }

  const handleLogoutClick = () => {
    setShowUserMenu(false)
    onLogout()
  }

  const handleLoginClick = () => {
    onLogin()
  }

  return (
    <View style={styles.header}>
      <View style={styles.brandSection}>
        <Text style={styles.brandIcon}>🐔</Text>
        <Text style={styles.brandName}>Gà Đồi Hoàng Long</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.navSection}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.navItem, currentTab === item.id && styles.navItemActive]}
            onPress={() => handleNavClick(item.id)}
          >
            <Text style={[styles.navLabel, currentTab === item.id && styles.navLabelActive]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.contactBtn} onPress={() => handleNavClick("Contact")}>
          <Text style={styles.contactIcon}>📞</Text>
          <Text style={styles.contactText}>Liên hệ</Text>
        </TouchableOpacity>

        {currentUser ? (
          <TouchableOpacity style={styles.userBtn} onPress={() => setShowUserMenu(!showUserMenu)}>
            <Text style={styles.userIcon}>👤</Text>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{currentUser.fullName}</Text>
              {currentUser.role === "admin" && <Text style={styles.userBadge}>Admin</Text>}
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.loginBtn} onPress={handleLoginClick}>
            <Text style={styles.loginIcon}>👤</Text>
            <Text style={styles.loginText}>Đăng nhập</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.cartBtn} onPress={() => onTabChange("Cart")}>
          <Text style={styles.cartIcon}>🛒</Text>
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {showUserMenu && currentUser && (
          <View style={styles.userMenu}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuHeaderName}>{currentUser.fullName}</Text>
              <Text style={styles.menuHeaderEmail}>{currentUser.email}</Text>
            </View>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuIcon}>👤</Text>
              <Text style={styles.menuText}>Tài khoản của tôi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuIcon}>📦</Text>
              <Text style={styles.menuText}>Đơn hàng</Text>
            </TouchableOpacity>
            {currentUser.role === "admin" && (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setShowUserMenu(false)
                  handleNavClick("Farm")
                }}
              >
                <Text style={styles.menuIcon}>⚙️</Text>
                <Text style={styles.menuText}>Quản lý</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.menuItem, styles.menuItemLast]} onPress={handleLogoutClick}>
              <Text style={styles.menuIcon}>🚪</Text>
              <Text style={styles.menuText}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    gap: 12,
  },
  brandSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minWidth: 180,
  },
  brandIcon: {
    fontSize: 28,
  },
  brandName: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.primary,
    letterSpacing: 0.3,
  },
  navSection: {
    flexDirection: "row",
    gap: 24,
    flex: 1,
  },
  navItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    position: "relative",
  },
  navItemActive: {
    backgroundColor: "rgba(46, 125, 50, 0.08)",
    borderRadius: 6,
  },
  navLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    letterSpacing: 0.2,
  },
  navLabelActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minWidth: 200,
    gap: 8,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#333",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minWidth: 300,
    position: "relative",
  },
  contactBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: "transparent",
    gap: 6,
  },
  contactIcon: {
    fontSize: 16,
  },
  contactText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  loginBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    gap: 6,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  loginIcon: {
    fontSize: 14,
  },
  loginText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
  },
  userBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 6,
    gap: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  userIcon: {
    fontSize: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  userName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  userBadge: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  cartBtn: {
    position: "relative",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cartIcon: {
    fontSize: 20,
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
  userMenu: {
    position: "absolute",
    top: 50,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    minWidth: 220,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    zIndex: 1000,
    overflow: "hidden",
  },
  menuHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  menuHeaderName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    marginBottom: 2,
  },
  menuHeaderEmail: {
    fontSize: 11,
    color: "#666",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    gap: 10,
  },
  menuIcon: {
    fontSize: 14,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
  },
})
