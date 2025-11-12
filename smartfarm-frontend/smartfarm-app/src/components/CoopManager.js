"use client"

import { useEffect, useState } from "react"
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Modal, Alert, SafeAreaView } from "react-native"
import { getCoops, createCoop, deleteCoop } from "../api/api"
import { COLORS } from "../styles/theme"

export default function CoopManager({ navigation }) {
  const [coops, setCoops] = useState([])
  const [name, setName] = useState("")
  const [modalVisible, setModalVisible] = useState(false)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    fetchCoops()
  }, [])

  async function fetchCoops() {
    try {
      const data = await getCoops()
      setCoops(Array.isArray(data) ? data : [])
    } catch (e) {
      console.warn(e.message)
      Alert.alert("Lỗi", "Không thể tải danh sách chuồng")
    }
  }

  function validateCoopName(name) {
    const trimmed = name.trim()

    // Check if name matches pattern "Chuồng: [number]"
    const pattern = /^Chuồng:\s*\d+$/
    if (!pattern.test(trimmed)) {
      return { valid: false, message: 'Tên chuồng phải theo định dạng "Chuồng: 1" hoặc "Chuồng: 2"...' }
    }

    // Check for duplicate names
    const isDuplicate = coops.some((coop) => coop.name.toLowerCase() === trimmed.toLowerCase())
    if (isDuplicate) {
      return { valid: false, message: "Tên chuồng đã tồn tại. Vui lòng chọn tên khác!" }
    }

    return { valid: true }
  }

  async function onCreate() {
    const validation = validateCoopName(name)
    if (!validation.valid) {
      Alert.alert("Thông báo", validation.message)
      return
    }

    try {
      await createCoop({ name: name.trim(), chickens: 0 })
      setName("")
      setModalVisible(false)
      fetchCoops()
      Alert.alert("Thành công", "Chuồng đã được tạo")
    } catch (e) {
      Alert.alert("Lỗi", e.message)
    }
  }

  async function onDeleteCoop(id) {
    Alert.alert("Xác nhận xóa", "Bạn có chắc chắn muốn xóa chuồng này không?", [
      {
        text: "Hủy",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Xóa",
        onPress: async () => {
          setDeleting(id)
          try {
            await deleteCoop(id)
            Alert.alert("Thành công", "Chuồng đã được xóa")
            fetchCoops()
          } catch (e) {
            Alert.alert("Lỗi", e.message)
          } finally {
            setDeleting(null)
          }
        },
        style: "destructive",
      },
    ])
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tạo Chuồng Gà</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Add New Coop Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Tạo chuồng mới</Text>

            {coops.length > 0 && (
              <View style={styles.existingCoopsContainer}>
                <Text style={styles.existingCoopsTitle}>Chuồng hiện có:</Text>
                <View style={styles.existingCoopsList}>
                  {coops.map((coop, index) => (
                    <Text key={coop._id} style={styles.existingCoopItem}>
                      {coop.name}
                    </Text>
                  ))}
                </View>
              </View>
            )}

            <TextInput
              placeholder='Tên chuồng (vd: "Chuồng: 1")'
              value={name}
              onChangeText={setName}
              style={styles.modalInput}
              placeholderTextColor="#999"
            />
            <Text style={styles.helperText}>💡 Tên phải theo định dạng: Chuồng: 1, Chuồng: 2, Chuồng: 3...</Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => {
                  setName("")
                  setModalVisible(false)
                }}
              >
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.submitBtn]} onPress={onCreate}>
                <Text style={styles.submitBtnText}>Tạo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Coops List */}
      <FlatList
        data={coops}
        keyExtractor={(i) => i._id}
        renderItem={({ item }) => (
          <View style={styles.coopItemContainer}>
            <TouchableOpacity
              style={styles.coopItemTouchable}
              onPress={() => navigation.navigate("CoopDetail", { coopId: item._id, coopName: item.name })}
            >
              <View style={styles.coopItem}>
                <View style={styles.coopInfo}>
                  <Text style={styles.coopName}>🏠 {item.name}</Text>
                  <Text style={styles.coopCount}>{item.chickens} con gà</Text>
                </View>
                <View style={styles.coopArrow}>
                  <Text style={styles.arrow}>›</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => onDeleteCoop(item._id)}
              disabled={deleting === item._id}
            >
              <Text style={styles.deleteBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>🏚️</Text>
            <Text style={styles.emptyText}>Chưa có chuồng nào</Text>
            <Text style={styles.emptySubtext}>Bấm nút + để tạo chuồng</Text>
          </View>
        }
        contentContainerStyle={styles.listContainer}
      />

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  backBtn: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "700",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  coopItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  coopItemTouchable: {
    flex: 1,
  },
  coopItem: {
    backgroundColor: COLORS.card,
    padding: 14,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  coopInfo: {
    flex: 1,
  },
  coopName: {
    fontWeight: "700",
    fontSize: 16,
    color: COLORS.primary,
    marginBottom: 4,
  },
  coopCount: {
    color: "#888",
    fontSize: 13,
  },
  coopArrow: {
    paddingLeft: 12,
  },
  arrow: {
    fontSize: 24,
    color: COLORS.primary,
  },
  deleteBtn: {
    marginLeft: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffebee",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteBtnText: {
    fontSize: 20,
    color: "#d32f2f",
    fontWeight: "700",
  },
  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    color: "#999",
    fontSize: 16,
    fontWeight: "600",
  },
  emptySubtext: {
    color: "#ccc",
    fontSize: 13,
    marginTop: 4,
  },
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    bottom: 20,
    right: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  fabText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "300",
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
    maxHeight: "80%", // Added max height for scrollable content
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 16,
  },
  existingCoopsContainer: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
  },
  existingCoopsTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  existingCoopsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  existingCoopItem: {
    fontSize: 12,
    color: COLORS.primary,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: COLORS.accent,
    padding: 12,
    marginBottom: 8, // Reduced margin to add helper text
    borderRadius: 8,
    fontSize: 15,
    color: "#333",
  },
  helperText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 16,
    fontStyle: "italic",
  },
})
