"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native"
import { COLORS } from "../../styles/theme"
import { loginUser, API_BASE } from "../../api/api"

function LoginScreen({ onLoginSuccess, onSwitchToRegister }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async () => {
    console.log("[v0] Login: Starting login process")
    setError("")

    // Validation
    if (!email || !password) {
      setError("Vui lòng điền đầy đủ email và mật khẩu")
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ email và mật khẩu")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Email không hợp lệ")
      Alert.alert("Lỗi", "Email không hợp lệ")
      return
    }

    setLoading(true)
    try {
      console.log("[v0] Login: Calling loginUser API with email:", email.trim().toLowerCase())
      const data = await loginUser(email.trim().toLowerCase(), password)
      console.log("[v0] Login: Response received", data)

      if (data.ok && data.token && data.user) {
        console.log("[v0] Login: Login successful, calling onLoginSuccess callback")
        if (onLoginSuccess) {
          await onLoginSuccess(data.token, data.user)
          console.log("[v0] Login: onLoginSuccess callback completed")
        } else {
          console.error("[v0] Login: ERROR - onLoginSuccess callback is not defined!")
          setError("Lỗi hệ thống: callback không được định nghĩa")
        }
      } else {
        console.error("[v0] Login: Invalid response structure", data)
        setError("Phản hồi không hợp lệ từ server")
        Alert.alert("Lỗi", "Phản hồi không hợp lệ từ server")
      }
    } catch (error) {
      console.error("[v0] Login: Error occurred", error)
      const errorMessage =
        error.message || "Không thể kết nối đến server. Vui lòng kiểm tra server đang chạy ở " + API_BASE
      setError(errorMessage)
      Alert.alert("Lỗi đăng nhập", errorMessage)
    } finally {
      setLoading(false)
      console.log("[v0] Login: Process completed")
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Đăng Nhập</Text>
        <Text style={styles.subtitle}>Chào mừng trở lại Gà Đồi Hoàng Long</Text>
      </View>

      <View style={styles.form}>
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="example@email.com"
          value={email}
          onChangeText={(text) => {
            setEmail(text)
            setError("")
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />

        <Text style={styles.label}>Mật khẩu</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          value={password}
          onChangeText={(text) => {
            setPassword(text)
            setError("")
          }}
          secureTextEntry
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.loginBtn, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginBtnText}>{loading ? "Đang xử lý..." : "Đăng Nhập"}</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Chưa có tài khoản? </Text>
          <TouchableOpacity onPress={onSwitchToRegister} disabled={loading}>
            <Text style={styles.linkText}>Đăng ký ngay</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.demoAccounts}>
          <Text style={styles.demoTitle}>Tài khoản demo:</Text>
          <Text style={styles.demoText}>Admin: admin@farm.com / admin123</Text>
          <Text style={styles.demoText}>Khách: customer@farm.com / customer123</Text>
        </View>

        <View style={styles.serverInfo}>
          <Text style={styles.serverInfoText}>Server: {API_BASE}</Text>
          <Text style={styles.serverInfoText}>Kiểm tra server đang chạy trước khi đăng nhập</Text>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  form: {
    gap: 12,
  },
  errorBox: {
    backgroundColor: "#fee",
    borderWidth: 1,
    borderColor: "#fcc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  errorText: {
    color: "#c00",
    fontSize: 13,
    fontWeight: "600",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  loginBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loginBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  footerText: {
    color: "#666",
    fontSize: 13,
  },
  linkText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  demoAccounts: {
    marginTop: 24,
    padding: 12,
    backgroundColor: "#f0f9ff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0f2fe",
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0369a1",
    marginBottom: 8,
  },
  demoText: {
    fontSize: 11,
    color: "#0c4a6e",
    marginVertical: 2,
  },
  serverInfo: {
    marginTop: 16,
    padding: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 6,
  },
  serverInfoText: {
    fontSize: 10,
    color: "#666",
    textAlign: "center",
  },
})

export default LoginScreen
