"use client"

import { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ScrollView } from "react-native"
import { COLORS } from "../../styles/theme"
import { createCoop, getCoops, deleteCoop } from "../../api/api"

export default function CreateCoopScreen({ onBack }) {
  const [name, setName] = useState("")
  const [coops, setCoops] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCoops()
  }, [])

  const loadCoops = async () => {
    try {
      setLoading(true)
      console.log("[v0] Loading coops...")
      const data = await getCoops()
      console.log("[v0] Coops loaded:", data)
      setCoops(data || [])
    } catch (error) {
      console.log("[v0] Error loading coops:", error)
      alert("Lỗi khi tải danh sách chuồng: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const validateCoopName = (name) => {
    const trimmed = name.trim()

    // Check if name matches pattern "Chuồng: [number]"
   const pattern = /^[Cc]huồng\s+\d+$/
    if (!pattern.test(trimmed)) {
      return { valid: false, message: 'Tên chuồng phải theo định dạng "Chuồng 1" hoặc "chuồng 2"...' }
    }

    // Check for duplicate names
    const isDuplicate = coops.some((coop) => coop.name.toLowerCase() === trimmed.toLowerCase())
    if (isDuplicate) {
      return { valid: false, message: "Tên chuồng đã tồn tại. Vui lòng chọn tên khác!" }
    }

    return { valid: true }
  }

  const handleCreateCoop = async () => {
    if (!name.trim()) {
      alert("Vui lòng nhập tên chuồng!")
      return
    }

    const validation = validateCoopName(name)
    if (!validation.valid) {
      alert(validation.message)
      return
    }

    try {
      setLoading(true)
      await createCoop({
        name: name.trim(),
      })

      alert("Tạo chuồng thành công!")
      setName("")
      await loadCoops()
    } catch (error) {
      alert("Lỗi: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCoop = async (coopId, coopName) => {
    // Use browser confirm dialog
    const confirmed = window.confirm(`Bạn có chắc muốn xóa "${coopName}" không?`)

    if (!confirmed) {
      return
    }

    try {
      setLoading(true)
      await deleteCoop(coopId)
      alert("Xóa chuồng thành công!")
      // Immediately reload the coops list
      await loadCoops()
    } catch (error) {
      alert("Lỗi khi xóa chuồng: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButtonContainer}>
          <Text style={styles.backButton}>← Quay lại</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formWrapper}>
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Tạo Chuồng Gà</Text>
          <Text style={styles.formSubtitle}>Nhập thông tin chuồng mới</Text>

          {/* Existing Coops Display */}
          {coops.length > 0 && (
            <View style={styles.existingCoopsSection}>
              <Text style={styles.existingCoopsTitle}>📋 Chuồng hiện có ({coops.length}):</Text>
              <View style={styles.existingCoopsList}>
                {coops.map((coop) => (
                  <View key={coop._id} style={styles.existingCoopBadge}>
                    <Text style={styles.existingCoopBadgeText}>{coop.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Name Input - Centered */}
           {/* Name Input - Centered */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>🏠 Tên chuồng</Text>
            <TextInput
              style={styles.input}
              placeholder='Ví dụ: "Chuồng 1" hoặc "chuồng 2"'
              value={name}
              onChangeText={setName}
              placeholderTextColor="#bbb"
              editable={!loading}
            />
            <Text style={styles.helperText}>💡 Định dạng: Chuồng 1, chuồng 2, Chuồng 3...</Text>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleCreateCoop}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>{loading ? "Đang lưu..." : "Hoàn Tất"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.listSection}>
        <Text style={styles.listSectionTitle}>Danh Sách Chuồng ({coops.length})</Text>

        {coops.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🐔</Text>
            <Text style={styles.emptyText}>Chưa có chuồng nào</Text>
          </View>
        ) : (
          <FlatList
            data={coops}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.coopCard}>
                <View style={styles.coopCardContent}>
                  <View style={styles.coopCardHeader}>
                    <View>
                      <Text style={styles.coopName}>{item.name}</Text>
                    </View>
                    <View style={styles.coopBadge}>
                      <Text style={styles.coopBadgeText}>{item.chickens || 0}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteCoop(item._id, item.name)}>
                  <Text style={styles.deleteButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
            scrollEnabled={false}
          />
        )}
      </View>

      {/* Footer Button */}
      <TouchableOpacity style={styles.doneButton} onPress={onBack}>
        <Text style={styles.doneButtonText}>Quay Lại Quản Lí</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafbfc",
  },

  // Header
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButtonContainer: {
    alignSelf: "flex-start",
  },
  backButton: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
  },

  formWrapper: {
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 24,
    alignItems: "center",
  },
  formCard: {
    width: "100%",
    maxWidth: 600,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 6,
  },
  formSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },

  // Input Groups
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#333",
    backgroundColor: "#fafbfc",
    textAlign: "center",
  },
  helperText: {
    fontSize: 11,
    color: "#666",
    marginTop: 6,
    fontStyle: "italic",
    textAlign: "center",
  },

  existingCoopsSection: {
    backgroundColor: "#f8f9fa",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  existingCoopsTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  existingCoopsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  existingCoopBadge: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  existingCoopBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary,
  },

  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  buttonDisabled: {
    opacity: 0.6,
  },

  // List Section
  listSection: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  listSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 16,
  },

  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
  },

  coopCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    borderLeftWidth: 5,
    borderLeftColor: COLORS.primary,
  },
  coopCardContent: {
    flex: 1,
    padding: 14,
  },
  coopCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  coopName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
  },
  coopBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  coopBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary,
  },
  deleteButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    fontSize: 22,
    color: "#ff6b6b",
    fontWeight: "700",
  },

  // Done Button
  doneButton: {
    backgroundColor: COLORS.primary,
    marginHorizontal: 16,
    marginVertical: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
})
