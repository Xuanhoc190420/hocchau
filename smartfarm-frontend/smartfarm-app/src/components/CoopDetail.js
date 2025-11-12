"use client"

import { useEffect, useState } from "react"
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from "react-native"
import { getCoop, createChickenTx, getChickenTxs } from "../api/api"
import { COLORS } from "../styles/theme"

import DateTimePicker from "@react-native-community/datetime-picker"

export default function CoopDetail({ route, navigation }) {
  const { coopId, coopName, isImport, isExport } = route.params || {}
  const [coop, setCoop] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [qty, setQty] = useState("")
  const [reason, setReason] = useState("")
  const [type, setType] = useState(isImport ? "IN" : isExport ? "OUT" : "IN")
  const [breed, setBreed] = useState("")
  const [modalVisible, setModalVisible] = useState(isImport || isExport)
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)

  useEffect(() => {
    if (coopId) {
      fetchData()
      const interval = setInterval(fetchData, 2000)
      return () => clearInterval(interval)
    } else {
      setModalVisible(true)
    }
  }, [])

  async function fetchData() {
    try {
      if (coopId) {
        const coopData = await getCoop(coopId)
        setCoop(coopData)
        const txs = await getChickenTxs()
        setTransactions(txs.filter((t) => t.coopId === coopId).slice(0, 20))
      }
    } catch (e) {
      console.warn(e.message)
    }
  }

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false)
    }
    if (selectedDate) {
      setStartDate(selectedDate)
    }
  }

  async function applyTx() {
    const q = Number.parseInt(qty || "0", 10)
    if (!q || q <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập số lượng > 0")
      return
    }
    if (!breed.trim()) {
      Alert.alert("Lỗi", "Vui lòng chọn giống gà")
      return
    }
    if (!coopId) {
      Alert.alert("Lỗi", "Vui lòng chọn chuồng")
      return
    }

    setLoading(true)
    try {
      await createChickenTx({
        coopId,
        type,
        quantity: q,
        reason,
        breed,
        startDate: startDate.toISOString().split("T")[0],
      })
      setQty("")
      setReason("")
      setBreed("")
      setStartDate(new Date())
      setModalVisible(false)
      Alert.alert("Thành công", type === "IN" ? "Nhập gà thành công!" : "Xuất gà thành công!")
      await fetchData()
    } catch (e) {
      Alert.alert("Lỗi", e.message)
    } finally {
      setLoading(false)
    }
  }

  if (!coopId) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chọn Chuồng</Text>
          <View style={{ width: 40 }} />
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => navigation.goBack()}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Vui lòng chọn chuồng trước</Text>
              <TouchableOpacity style={[styles.modalBtn, styles.submitBtn]} onPress={() => navigation.goBack()}>
                <Text style={styles.submitBtnText}>Quay lại</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{coopName || "Chi tiết Chuồng"}</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Coop Info Card */}
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Chuồng:</Text>
            <Text style={styles.infoValue}>{coop?.name || "Loading..."}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Số lượng gà:</Text>
            <Text style={styles.chickensCount}>{coop?.chickens || 0}</Text>
          </View>
          {(coop?.totalChickenCost > 0 || coop?.totalFeedCost > 0) && (
            <>
              <View style={styles.divider} />
              <View style={styles.costSection}>
                <Text style={styles.costTitle}>Chi phí chăn nuôi</Text>
                {coop?.totalChickenCost > 0 && (
                  <View style={styles.costRow}>
                    <Text style={styles.costLabel}>Chi phí giống:</Text>
                    <Text style={styles.costValue}>{coop.totalChickenCost.toLocaleString("vi-VN")} đ</Text>
                  </View>
                )}
                {coop?.totalFeedCost > 0 && (
                  <View style={styles.costRow}>
                    <Text style={styles.costLabel}>Chi phí thức ăn:</Text>
                    <Text style={styles.costValue}>{coop.totalFeedCost.toLocaleString("vi-VN")} đ</Text>
                  </View>
                )}
                <View style={styles.divider} />
                <View style={styles.costRow}>
                  <Text style={styles.costLabelTotal}>Tổng chi phí:</Text>
                  <Text style={styles.costValueTotal}>
                    {((coop?.totalChickenCost || 0) + (coop?.totalFeedCost || 0)).toLocaleString("vi-VN")} đ
                  </Text>
                </View>
              </View>
            </>
          )}
          {coop?.location && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Vị trí:</Text>
                <Text style={styles.infoValue}>{coop.location}</Text>
              </View>
            </>
          )}
        </View>

        {/* Quick Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.quickBtn, styles.inBtn]}
            onPress={() => {
              setType("IN")
              setModalVisible(true)
            }}
          >
            <Text style={styles.quickBtnLabel}>⬇️</Text>
            <Text style={styles.quickBtnText}>Nhập gà</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickBtn, styles.outBtn]}
            onPress={() => {
              setType("OUT")
              setModalVisible(true)
            }}
          >
            <Text style={styles.quickBtnLabel}>⬆️</Text>
            <Text style={styles.quickBtnText}>Xuất gà</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false)
            if (isImport || isExport) navigation.goBack()
          }}
        >
          <View style={styles.centeredView}>
            <ScrollView style={styles.modalView}>
              <Text style={styles.modalTitle}>{type === "IN" ? "🔽 Nhập gà" : "🔼 Xuất gà"}</Text>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Giống gà *</Text>
                <TextInput
                  placeholder="vd: Hàn Quốc, Cobb, Brahma..."
                  value={breed}
                  onChangeText={setBreed}
                  style={styles.input}
                  placeholderTextColor="#999"
                  editable={!loading}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Số lượng *</Text>
                <TextInput
                  placeholder="vd: 50"
                  keyboardType="numeric"
                  value={qty}
                  onChangeText={setQty}
                  style={styles.input}
                  placeholderTextColor="#999"
                  editable={!loading}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Ngày bắt đầu *</Text>
                <TouchableOpacity
                  style={styles.datePickerBtn}
                  onPress={() => setShowDatePicker(true)}
                  disabled={loading}
                >
                  <Text style={styles.datePickerBtnText}>{startDate.toLocaleDateString("vi-VN")}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={startDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handleDateChange}
                  />
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Lý do</Text>
                <TextInput
                  placeholder="vd: Bán, chuyển chuồng, thay máu..."
                  value={reason}
                  onChangeText={setReason}
                  style={styles.input}
                  placeholderTextColor="#999"
                  editable={!loading}
                />
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.cancelBtn]}
                  onPress={() => {
                    setQty("")
                    setReason("")
                    setBreed("")
                    setStartDate(new Date())
                    setModalVisible(false)
                    if (isImport || isExport) navigation.goBack()
                  }}
                  disabled={loading}
                >
                  <Text style={styles.cancelBtnText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, styles.submitBtn]} onPress={applyTx} disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitBtnText}>{type === "IN" ? "Nhập gà" : "Xuất gà"}</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>

        {/* Transaction History */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Lịch sử giao dịch</Text>
          {transactions.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Text style={styles.emptyText}>Chưa có giao dịch nào</Text>
            </View>
          ) : (
            transactions.map((tx, idx) => (
              <View key={idx} style={styles.txItem}>
                <View style={[styles.txType, tx.type === "IN" ? styles.inType : styles.outType]}>
                  <Text style={styles.txTypeText}>{tx.type === "IN" ? "IN" : "OUT"}</Text>
                </View>
                <View style={styles.txDetails}>
                  <Text style={styles.txBreed}>{tx.breed}</Text>
                  <Text style={styles.txMeta}>{tx.quantity} con</Text>
                  {tx.reason && <Text style={styles.txReason}>{tx.reason}</Text>}
                </View>
                <View style={styles.txDate}>
                  <Text style={styles.txDateText}>
                    {new Date(tx.createdAt).toLocaleDateString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
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
  card: {
    backgroundColor: COLORS.card,
    margin: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoLabel: {
    color: "#666",
    fontSize: 13,
    fontWeight: "600",
  },
  infoValue: {
    color: "#333",
    fontSize: 14,
    fontWeight: "500",
  },
  chickensCount: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.primary,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 8,
  },
  actionRow: {
    flexDirection: "row",
    marginHorizontal: 12,
    gap: 8,
    marginBottom: 16,
  },
  quickBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  inBtn: {
    backgroundColor: "#e3f2fd",
  },
  outBtn: {
    backgroundColor: "#fff3e0",
  },
  quickBtnLabel: {
    fontSize: 24,
    marginBottom: 4,
  },
  quickBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  datePickerBtn: {
    borderWidth: 1,
    borderColor: COLORS.accent,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  datePickerBtnText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  historySection: {
    marginHorizontal: 12,
    marginBottom: 24,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 12,
  },
  emptyHistory: {
    backgroundColor: COLORS.card,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  emptyText: {
    color: "#999",
    fontSize: 13,
  },
  txItem: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    alignItems: "center",
    gap: 12,
  },
  txType: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  inType: {
    backgroundColor: "#c8e6c9",
  },
  outType: {
    backgroundColor: "#ffe0b2",
  },
  txTypeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#333",
  },
  txDetails: {
    flex: 1,
  },
  txBreed: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  txMeta: {
    fontSize: 12,
    color: "#888",
  },
  txReason: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
    fontStyle: "italic",
  },
  txDate: {
    alignItems: "flex-end",
  },
  txDateText: {
    fontSize: 11,
    color: "#999",
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
    maxHeight: "90%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 16,
  },
  formGroup: {
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
    borderRadius: 8,
    fontSize: 14,
    color: "#333",
  },
  modalActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
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
  costSection: {
    paddingVertical: 8,
  },
  costTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 8,
  },
  costRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  costLabel: {
    color: "#666",
    fontSize: 12,
    fontWeight: "500",
  },
  costValue: {
    color: "#333",
    fontSize: 13,
    fontWeight: "600",
  },
  costLabelTotal: {
    color: "#333",
    fontSize: 13,
    fontWeight: "700",
  },
  costValueTotal: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "700",
  },
})
