"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, SafeAreaView, Alert, TouchableOpacity } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Header from "./src/components/Header"
import HomeScreen from "./src/components/screens/HomeScreen"
import FarmManagementHub from "./src/components/FarmManagementHub"
import CoopsScreen from "./src/components/screens/CoopsScreen"
import ProductsScreen from "./src/components/screens/ProductsScreen"
import ContactScreen from "./src/components/screens/ContactScreen"
import CreateCoopScreen from "./src/components/screens/CreateCoopScreen"
import CreateFeedScreen from "./src/components/screens/CreateFeedScreen"
import ImportChickenScreen from "./src/components/screens/ImportChickenScreen"
import ExportChickenScreen from "./src/components/screens/ExportChickenScreen"
import OrderManagementScreen from "./src/components/screens/OrderManagementScreen"
import LoginScreen from "./src/components/screens/LoginScreen"
import RegisterScreen from "./src/components/screens/RegisterScreen"
import StoreManagerScreen from "./src/components/screens/StoreManagerScreen"
import StoreChainScreen from "./src/components/screens/StoreChainScreen"

import { COLORS } from "./src/styles/theme"

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [currentTab, setCurrentTab] = useState("Home")
  const [farmScreen, setFarmScreen] = useState("hub")
  const [refreshKey, setRefreshKey] = useState(0)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authScreen, setAuthScreen] = useState("login")

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken")
      const userStr = await AsyncStorage.getItem("currentUser")

      if (token && userStr) {
        const user = JSON.parse(userStr)
        setIsAuthenticated(true)
        setCurrentUser(user)
      }
    } catch (error) {
      console.log("Error checking auth:", error)
    }
  }

  const handleLoginSuccess = async (token, user) => {
    try {
      await AsyncStorage.setItem("authToken", token)
      await AsyncStorage.setItem("currentUser", JSON.stringify(user))
      setIsAuthenticated(true)
      setCurrentUser(user)
      setShowAuthModal(false)
      Alert.alert("Đăng nhập thành công", `Chào mừng ${user.fullName}!`)
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu thông tin đăng nhập")
    }
  }

  const handleRegisterSuccess = async (token, user) => {
    try {
      await AsyncStorage.setItem("authToken", token)
      await AsyncStorage.setItem("currentUser", JSON.stringify(user))
      setIsAuthenticated(true)
      setCurrentUser(user)
      setShowAuthModal(false)
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu thông tin đăng nhập")
    }
  }

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken")
      await AsyncStorage.removeItem("currentUser")
      setIsAuthenticated(false)
      setCurrentUser(null)
      setCurrentTab("Home")
      setFarmScreen("hub")
      Alert.alert("Đăng xuất", "Bạn đã đăng xuất thành công")
    } catch (error) {
      Alert.alert("Lỗi", "Không thể đăng xuất")
    }
  }

  const handleBackToHub = () => {
    setFarmScreen("hub")
    setRefreshKey((prev) => prev + 1)
  }

  const handleTabChange = (tab) => {
    setCurrentTab(tab)
    setFarmScreen("hub")
  }

  const renderAuthModal = () => {
    if (!showAuthModal) return null

    if (authScreen === "login") {
      return (
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPress={() => setShowAuthModal(false)}>
            <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalContent}>
                <LoginScreen onLoginSuccess={handleLoginSuccess} onSwitchToRegister={() => setAuthScreen("register")} />
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      )
    } else {
      return (
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPress={() => setShowAuthModal(false)}>
            <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalContent}>
                <RegisterScreen
                  onRegisterSuccess={handleRegisterSuccess}
                  onSwitchToLogin={() => setAuthScreen("login")}
                />
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      )
    }
  }

  const renderContent = () => {
    if (currentTab === "Home") {
      return <HomeScreen />
    }
    if (currentTab === "Products") {
      return <ProductsScreen />
    }
    if (currentTab === "StoreChain") {
      return <StoreChainScreen />
    }
    if (currentTab === "Coops") {
      return <CoopsScreen />
    }
    if (currentTab === "Farm") {
      if (farmScreen === "hub") {
        return <FarmManagementHub onSelectFeature={(feature) => setFarmScreen(feature)} />
      }
      if (farmScreen === "createCoop") {
        return <CreateCoopScreen onBack={handleBackToHub} />
      }
      if (farmScreen === "createFeed") {
        return <CreateFeedScreen onBack={handleBackToHub} />
      }
      if (farmScreen === "importChicken") {
        return <ImportChickenScreen onBack={handleBackToHub} />
      }
      if (farmScreen === "exportChicken") {
        return <ExportChickenScreen onBack={handleBackToHub} />
      }
      if (farmScreen === "manageProducts") {
        return <ProductsScreen isAdminMode={true} onBack={handleBackToHub} />
      }
      if (farmScreen === "manageOrders") {
        return <OrderManagementScreen onBack={handleBackToHub} />
      }
      if (farmScreen === "manageStores") {
        return <StoreManagerScreen onBack={handleBackToHub} />
      }
    }
    if (currentTab === "Contact") {
      return <ContactScreen onNavigate={handleTabChange} />
    }

    return null
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        currentTab={currentTab}
        onTabChange={handleTabChange}
        currentUser={currentUser}
        onLogout={handleLogout}
        onLogin={() => {
          setAuthScreen("login")
          setShowAuthModal(true)
        }}
      />
      <View style={styles.content}>{renderContent()}</View>
      {renderAuthModal()}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    flex: 1,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    maxHeight: "90%",
  },
})
