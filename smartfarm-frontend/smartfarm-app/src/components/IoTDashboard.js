"use client"

import { useEffect, useState } from "react"
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, SafeAreaView } from "react-native"
import { fetchBlynkAll } from "../api/api"
import { COLORS } from "../styles/theme"

export default function IoTDashboard() {
  const [sensors, setSensors] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSensors = async () => {
    try {
      setError(null)
      const response = await fetchBlynkAll()
      if (response && response.data) {
        setSensors(response.data)
      } else if (response) {
        setSensors(response)
      }
      setLoading(false)
    } catch (e) {
      console.warn("[v0] Fetch error:", e.message)
      setError(e.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSensors()
    const t = setInterval(fetchSensors, 5000)
    return () => {
      clearInterval(t)
    }
  }, [])

  const getSensorValue = (key) => {
    if (!sensors || !sensors[key]) return "N/A"
    const val = sensors[key]
    return typeof val === "number" ? val.toFixed(2) : JSON.stringify(val)
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hệ Thống IoT</Text>
          <Text style={styles.headerSubtitle}>Theo dõi cảm biến trang trại</Text>
        </View>

        {/* IoT Status Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>📡 CẢM BIẾN IOT</Text>
            <Text style={styles.subtitle}>Cập nhật tự động mỗi 5 giây</Text>
          </View>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ Lỗi: {error}</Text>
            </View>
          )}

          {loading && !sensors ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Đang tải dữ liệu từ Blynk...</Text>
            </View>
          ) : (
            <View style={styles.sensorsGrid}>
              {/* Temperature V0 */}
              <View style={styles.sensorCard}>
                <Text style={styles.sensorIcon}>🌡️</Text>
                <Text style={styles.sensorLabel}>Nhiệt độ</Text>
                <Text style={styles.sensorValue}>{getSensorValue("V0")}</Text>
                <Text style={styles.sensorUnit}>°C</Text>
              </View>

              {/* Humidity V1 */}
              <View style={styles.sensorCard}>
                <Text style={styles.sensorIcon}>💧</Text>
                <Text style={styles.sensorLabel}>Độ ẩm</Text>
                <Text style={styles.sensorValue}>{getSensorValue("V1")}</Text>
                <Text style={styles.sensorUnit}>%</Text>
              </View>

              {/* Weight V2 */}
              <View style={styles.sensorCard}>
                <Text style={styles.sensorIcon}>⚖️</Text>
                <Text style={styles.sensorLabel}>Trọng lượng</Text>
                <Text style={styles.sensorValue}>{getSensorValue("V2")}</Text>
                <Text style={styles.sensorUnit}>kg</Text>
              </View>

              {/* Water Level V3 */}
              <View style={styles.sensorCard}>
                <Text style={styles.sensorIcon}>💧</Text>
                <Text style={styles.sensorLabel}>Mực nước</Text>
                <Text style={styles.sensorValue}>{getSensorValue("V3")}</Text>
                <Text style={styles.sensorUnit}>L</Text>
              </View>
            </View>
          )}

          {/* Refresh Button */}
          <TouchableOpacity style={styles.refreshBtn} onPress={fetchSensors}>
            <Text style={styles.refreshBtnIcon}>🔄</Text>
            <Text style={styles.refreshBtnText}>Tải lại ngay</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
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
  card: {
    backgroundColor: "#fff",
    margin: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitle: {
    color: COLORS.primary,
    fontWeight: "700",
    marginBottom: 4,
    fontSize: 16,
  },
  subtitle: {
    color: "#888",
    marginBottom: 0,
    fontSize: 13,
  },
  errorBox: {
    backgroundColor: "#ffebee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#d32f2f",
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 13,
  },
  loadingBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loadingText: {
    color: "#666",
    marginTop: 12,
    fontSize: 13,
  },
  sensorsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sensorCard: {
    width: "48%",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    alignItems: "center",
    borderTopWidth: 3,
    borderTopColor: COLORS.primary,
  },
  sensorIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  sensorLabel: {
    color: "#666",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  sensorValue: {
    color: COLORS.primary,
    fontSize: 22,
    fontWeight: "700",
  },
  sensorUnit: {
    color: "#999",
    fontSize: 12,
    marginTop: 2,
  },
  refreshBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  refreshBtnIcon: {
    fontSize: 16,
  },
  refreshBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
})
