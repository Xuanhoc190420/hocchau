"use client"

import { useEffect, useState } from "react"
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
} from "react-native"
import { getFeeds, createFeed, deleteFeed } from "../api/api"
import { COLORS } from "../styles/theme"

export default function FeedManager({ navigation }) {
  const [feeds, setFeeds] = useState([])
  const [name, setName] = useState("")
  const [ingredients, setIngredients] = useState([])
  const [currentIngredient, setCurrentIngredient] = useState("")
  const [currentQuantity, setCurrentQuantity] = useState("")
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchFeeds()
  }, [])

  async function fetchFeeds() {
    try {
      const data = await getFeeds()
      setFeeds(Array.isArray(data) ? data : [])
    } catch (e) {
      console.warn(e.message)
    }
  }

  function addIngredient() {
    if (!currentIngredient.trim() || !currentQuantity.trim()) {
      window.alert("Vui lòng nhập tên và số lượng thành phần")
      return
    }
    setIngredients([...ingredients, { name: currentIngredient, quantity: currentQuantity }])
    setCurrentIngredient("")
    setCurrentQuantity("")
  }

  function removeIngredient(idx) {
    setIngredients(ingredients.filter((_, i) => i !== idx))
  }

  async function onCreate() {
    if (!name.trim()) {
      window.alert("Vui lòng nhập tên thức ăn")
      return
    }

    setLoading(true)
    try {
      await createFeed({ name, ingredients })
      setName("")
      setIngredients([])
      setModalVisible(false)
      window.alert("Thức ăn đã được tạo")
      fetchFeeds()
    } catch (e) {
      window.alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteFeed(feedId, feedName) {
    const confirmed = window.confirm(`Bạn có chắc muốn xóa thức ăn "${feedName}"?`)

    if (confirmed) {
      try {
        await deleteFeed(feedId)
        window.alert("Đã xóa thức ăn")
        fetchFeeds() // Refresh the list after deletion
      } catch (e) {
        window.alert(e.message || "Không thể xóa thức ăn")
      }
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản Lý Thức Ăn</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={feeds}
        keyExtractor={(i) => i._id}
        renderItem={({ item }) => (
          <View style={styles.feedCard}>
            <View style={styles.feedRow}>
              <View style={styles.feedInfo}>
                <Text style={styles.feedName}>{item.name}</Text>
                <Text style={styles.ingredientCount}>{item.ingredients?.length || 0} thành phần</Text>
              </View>
              <View style={styles.feedActions}>
                <View style={styles.ingredientBadge}>
                  <Text style={styles.badgeText}>{item.ingredients?.length || 0}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteFeed(item._id, item.name)}
                  style={styles.deleteBtn}
                  activeOpacity={0.7}
                >
                  <Text style={styles.deleteBtnText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>🌾</Text>
            <Text style={styles.emptyText}>Chưa có thức ăn nào</Text>
            <Text style={styles.emptySubtext}>Bấm nút + để tạo mới</Text>
          </View>
        }
        contentContainerStyle={styles.listContainer}
      />

      {/* Create Feed Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <ScrollView style={styles.modalView}>
            <Text style={styles.modalTitle}>Tạo thức ăn mới</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Tên thức ăn *</Text>
              <TextInput
                placeholder="vd: Thức ăn gà mái, Thức ăn gà con..."
                value={name}
                onChangeText={setName}
                style={styles.input}
                placeholderTextColor="#999"
                editable={!loading}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Thành phần</Text>
              <View style={styles.ingredientInputRow}>
                <TextInput
                  placeholder="Tên thành phần"
                  value={currentIngredient}
                  onChangeText={setCurrentIngredient}
                  style={[styles.input, styles.ingredientInput]}
                  placeholderTextColor="#999"
                  editable={!loading}
                />
                <TextInput
                  placeholder="Số lượng"
                  value={currentQuantity}
                  onChangeText={setCurrentQuantity}
                  style={[styles.input, styles.ingredientQtyInput]}
                  placeholderTextColor="#999"
                  editable={!loading}
                />
              </View>
              <TouchableOpacity style={styles.addIngBtn} onPress={addIngredient} disabled={loading}>
                <Text style={styles.addIngBtnText}>+ Thêm thành phần</Text>
              </TouchableOpacity>
            </View>

            {ingredients.length > 0 && (
              <View style={styles.ingredientsListModal}>
                <Text style={styles.label}>Danh sách thành phần:</Text>
                {ingredients.map((ing, idx) => (
                  <View key={idx} style={styles.ingredientItemModal}>
                    <View>
                      <Text style={styles.ingredientNameModal}>{ing.name}</Text>
                      <Text style={styles.ingredientQtyModal}>{ing.quantity}</Text>
                    </View>
                    <TouchableOpacity onPress={() => removeIngredient(idx)} disabled={loading}>
                      <Text style={styles.removeBtn}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => {
                  setName("")
                  setIngredients([])
                  setCurrentIngredient("")
                  setCurrentQuantity("")
                  setModalVisible(false)
                }}
                disabled={loading}
              >
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.submitBtn]} onPress={onCreate} disabled={loading}>
                <Text style={styles.submitBtnText}>Tạo</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

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
    paddingBottom: 80,
  },
  feedCard: {
    backgroundColor: COLORS.card,
    padding: 16,
    marginBottom: 10,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  feedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  feedInfo: {
    flex: 1,
    marginRight: 12,
  },
  feedName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  ingredientCount: {
    fontSize: 13,
    color: "#666",
  },
  feedActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  ingredientBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 45,
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  deleteBtn: {
    backgroundColor: "#ffebee",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ffcdd2",
  },
  deleteBtnText: {
    color: "#d32f2f",
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 20,
  },
  ingredientsList: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  ingredientItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  ingredientName: {
    fontSize: 13,
    color: "#333",
  },
  ingredientQty: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  dateText: {
    fontSize: 11,
    color: "#999",
  },
  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
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
    maxHeight: "90%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 16,
    padding: 20,
    paddingBottom: 8,
  },
  formGroup: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.accent,
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    fontSize: 14,
    color: "#333",
  },
  ingredientInputRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  ingredientInput: {
    flex: 1,
    marginBottom: 0,
  },
  ingredientQtyInput: {
    flex: 0.6,
    marginBottom: 0,
  },
  addIngBtn: {
    backgroundColor: COLORS.accent,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  addIngBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  ingredientsListModal: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  ingredientItemModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
  },
  ingredientNameModal: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  ingredientQtyModal: {
    fontSize: 12,
    color: "#888",
  },
  removeBtn: {
    fontSize: 18,
    color: "#d32f2f",
    fontWeight: "700",
  },
  modalActions: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: 16,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: "#f0f0f0",
  },
  cancelBtnText: {
    color: "#666",
    fontWeight: "600",
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
  },
  submitBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
})
