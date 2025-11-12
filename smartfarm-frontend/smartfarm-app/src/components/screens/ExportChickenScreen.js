"use client"

import { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, ScrollView } from "react-native"
import { COLORS } from "../../styles/theme"
import { getCoops, createChickenTx, getChickenTxs, deleteChickenTx } from "../../api/api"

export default function ExportChickenScreen({ onBack }) {
  const [step, setStep] = useState(1)
  const [coops, setCoops] = useState([])
  const [selectedCoop, setSelectedCoop] = useState(null)
  const [operation, setOperation] = useState("")
  const [quantity, setQuantity] = useState("")
  const [reason, setReason] = useState("")
  const [notes, setNotes] = useState("")
  const [salePrice, setSalePrice] = useState("")
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const reasonsAdd = ["Chuyển từ chuồng khác", "Gà thay lông", "Khác"]
  const reasonsRemove = ["Bán gà", "Gà chết", "Hao hụt", "Khác"]

  useEffect(() => {
    loadCoops()
    loadTransactions()
  }, [])

  const loadCoops = async () => {
    try {
      const data = await getCoops()
      setCoops(data || [])
    } catch (error) {
      Alert.alert("Lỗi", error.message)
    }
  }

  const loadTransactions = async () => {
    try {
      const data = await getChickenTxs()
      setTransactions(data || [])
    } catch (error) {
      Alert.alert("Lỗi", error.message)
    }
  }

  const handleSelectCoop = (coop) => {
    setSelectedCoop(coop)
    setStep(2)
  }

  const handleExportChicken = async () => {
    if (!operation) {
      Alert.alert("Lỗi", "Vui lòng chọn thêm hoặc bớt gà")
      return
    }
    if (!quantity || Number.parseInt(quantity) <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập số lượng gà")
      return
    }
    if (!reason.trim()) {
      Alert.alert("Lỗi", "Vui lòng chọn lí do")
      return
    }
    if (
      operation === "-" &&
      reason === "Bán gà" &&
      (!salePrice || Number.parseInt(salePrice.replace(/\./g, ""), 10) <= 0)
    ) {
      Alert.alert("Lỗi", "Vui lòng nhập giá bán gà")
      return
    }

    try {
      setLoading(true)
      const type = operation === "+" ? "IN" : "OUT"
      const txData = {
        coopId: selectedCoop._id,
        type,
        quantity: Number.parseInt(quantity),
        reason,
        note: notes,
      }

      if (type === "OUT" && reason === "Bán gà") {
        txData.salePrice = Number.parseInt(salePrice.replace(/\./g, ""), 10)
      }

      await createChickenTx(txData)

      Alert.alert("Thành công", `${operation === "+" ? "Thêm" : "Trừ"} gà thành công!`)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)

      setQuantity("")
      setReason("")
      setNotes("")
      setSalePrice("")
      setOperation("")
      setStep(3)
      loadTransactions()
    } catch (error) {
      Alert.alert("Lỗi", error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTransaction = async (txId) => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc muốn xóa ghi xuất gà này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        onPress: async () => {
          try {
            await deleteChickenTx(txId)
            loadTransactions()
            Alert.alert("Thành công", "Xóa ghi xuất gà thành công!")
          } catch (error) {
            Alert.alert("Lỗi", error.message)
          }
        },
        style: "destructive",
      },
    ])
  }

  const formatCurrency = (value) => {
    const num = value.replace(/\D/g, "")
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  const parseCurrency = (value) => {
    return Number.parseInt(value.replace(/\./g, ""), 10) || 0
  }

  // Step 1: Select Coop
  if (step === 1) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack}>
            <Text style={styles.backButton}>← Quay lại</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Xuất / Nhập Gà</Text>
        </View>

        {coops.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🏠</Text>
            <Text style={styles.emptyText}>Không có chuồng nào. Vui lòng tạo chuồng trước.</Text>
          </View>
        ) : (
          <FlatList
            data={coops}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.coopSelectCard} onPress={() => handleSelectCoop(item)}>
                <View>
                  <Text style={styles.coopSelectName}>{item.name}</Text>
                  <Text style={styles.coopSelectLocation}>{item.location || "Không có vị trí"}</Text>
                </View>
                <View style={styles.coopSelectBadge}>
                  <Text style={styles.coopSelectCount}>{item.chickens || 0}</Text>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    )
  }

  // Step 2: Form
  if (step === 2) {
    const currentReasons = operation === "+" ? reasonsAdd : reasonsRemove
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setStep(1)}>
            <Text style={styles.backButton}>← Chọn chuồng khác</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Xuất / Nhập Gà</Text>
          <Text style={styles.coopDisplay}>{selectedCoop?.name}</Text>
        </View>

        {saveSuccess && (
          <View style={styles.successMessage}>
            <Text style={styles.successText}>Dữ liệu đã được lưu</Text>
          </View>
        )}

        <View style={styles.form}>
          <Text style={styles.label}>Chọn thao tác *</Text>
          <View style={styles.operationContainer}>
            <TouchableOpacity
              style={[styles.operationButton, operation === "+" && styles.operationButtonActive]}
              onPress={() => {
                setOperation("+")
                setReason("")
              }}
            >
              <Text style={[styles.operationButtonText, operation === "+" && styles.operationButtonTextActive]}>
                Thêm Gà
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.operationButton, operation === "-" && styles.operationButtonActive]}
              onPress={() => {
                setOperation("-")
                setReason("")
              }}
            >
              <Text style={[styles.operationButtonText, operation === "-" && styles.operationButtonTextActive]}>
                Bớt Gà
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Số lượng gà *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ví dụ: 10"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="number-pad"
            placeholderTextColor="#aaa"
          />

          {operation && (
            <>
              <Text style={styles.label}>Lí do {operation === "+" ? "thêm" : "bớt"} *</Text>
              <View style={styles.reasonContainer}>
                {currentReasons.map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[styles.reasonButton, reason === r && styles.reasonButtonActive]}
                    onPress={() => setReason(r)}
                  >
                    <Text style={[styles.reasonButtonText, reason === r && styles.reasonButtonTextActive]}>{r}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {operation === "-" && reason === "Bán gà" && (
            <>
              <Text style={styles.label}>Giá bán (đ/con) *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ví dụ: 50.000"
                value={salePrice}
                onChangeText={(text) => setSalePrice(formatCurrency(text))}
                keyboardType="number-pad"
                placeholderTextColor="#aaa"
              />
            </>
          )}

          <Text style={styles.label}>Ghi chú</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Ghi chú thêm..."
            value={notes}
            onChangeText={setNotes}
            placeholderTextColor="#aaa"
            multiline
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleExportChicken} disabled={loading}>
            <Text style={styles.submitButtonText}>{loading ? "Đang lưu..." : "Hoàn Tất"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }

  // Step 3: History
  if (step === 3) {
    const exportTxs = transactions.filter((t) => t.type === "OUT")
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setStep(1)}>
            <Text style={styles.backButton}>← Thao tác khác</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Lịch Sử Xuất Gà ({exportTxs.length})</Text>
        </View>

        {exportTxs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>Chưa có lịch sử xuất gà</Text>
          </View>
        ) : (
          <FlatList
            data={exportTxs}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.txCardWrapper}>
                <View style={styles.txCard}>
                  <Text style={styles.txDate}>{new Date(item.createdAt).toLocaleDateString("vi-VN")}</Text>
                  <View style={styles.txHeader}>
                    <Text style={styles.txQuantity}>{item.quantity} con</Text>
                    <Text style={styles.txReason}>{item.reason}</Text>
                  </View>
                  {item.salePrice > 0 && (
                    <Text style={styles.txPrice}>Giá bán: {item.salePrice.toLocaleString("vi-VN")} đ/con</Text>
                  )}
                  {item.salePrice > 0 && (
                    <Text style={styles.txTotal}>
                      Tổng: {(item.salePrice * item.quantity).toLocaleString("vi-VN")} đ
                    </Text>
                  )}
                  {item.note && <Text style={styles.txNote}>📝 {item.note}</Text>}
                </View>
                <TouchableOpacity style={styles.deleteTxButton} onPress={() => handleDeleteTransaction(item._id)}>
                  <Text style={styles.deleteTxButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
            contentContainerStyle={styles.listContent}
          />
        )}

        <TouchableOpacity style={styles.doneButton} onPress={onBack}>
          <Text style={styles.doneButtonText}>Quay lại Quản lí</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  coopDisplay: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  successMessage: {
    backgroundColor: "#e8f5e9",
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  successText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "600",
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  operationContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  operationButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#ddd",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  operationButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.accent,
  },
  operationButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  operationButtonTextActive: {
    color: COLORS.primary,
  },
  reasonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  reasonButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  reasonButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  reasonButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
  },
  reasonButtonTextActive: {
    color: "#fff",
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 24,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  coopSelectCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  coopSelectName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  coopSelectLocation: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  coopSelectBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  coopSelectCount: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  txCardWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  txCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#ff6b6b",
  },
  txDate: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  txHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  txQuantity: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  txReason: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  txNote: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  txPrice: {
    fontSize: 12,
    color: "#2e7d32",
    marginTop: 4,
    fontWeight: "600",
  },
  txTotal: {
    fontSize: 13,
    color: "#1b5e20",
    marginTop: 2,
    fontWeight: "700",
  },
  deleteTxButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteTxButtonText: {
    fontSize: 20,
    color: "#ff6b6b",
    fontWeight: "700",
  },
  doneButton: {
    backgroundColor: COLORS.primary,
    marginHorizontal: 16,
    marginVertical: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
})
