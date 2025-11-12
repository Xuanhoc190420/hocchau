"use client"

import { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, ScrollView } from "react-native"
import { COLORS } from "../../styles/theme"
import { getCoops, createChickenTx, getChickenTxs, deleteChickenTx } from "../../api/api"

export default function ImportChickenScreen({ onBack }) {
  const [step, setStep] = useState(1) // step 1: select coop, step 2: form, step 3: history
  const [coops, setCoops] = useState([])
  const [selectedCoop, setSelectedCoop] = useState(null)
  const [quantity, setQuantity] = useState("")
  const [breed, setBreed] = useState("")
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]) // Changed to string format for web date input compatibility
  const [chickPrice, setChickPrice] = useState("") // Added new fields for chick price and supplier
  const [supplier, setSupplier] = useState("")
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)

  const breeds = ["Gà mái", "Gà trống", "Gà con", "Gà thải loại"]

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

  const handleDateChange = (event, selectedDate) => {
    // Added date picker handler
    if (selectedDate) {
      setStartDate(selectedDate.toISOString().split("T")[0])
    }
  }

  const formatCurrency = (value) => {
    // Added currency formatting helper
    const number = value.replace(/\D/g, "")
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  const parseCurrency = (formatted) => {
    return formatted.replace(/\./g, "")
  }

  const handleImportChicken = async () => {
    if (!quantity || Number.parseInt(quantity) <= 0) {
      window.alert("Vui lòng nhập số lượng gà")
      return
    }
    if (!breed.trim()) {
      window.alert("Vui lòng chọn giống gà")
      return
    }

    try {
      setLoading(true)
      await createChickenTx({
        coopId: selectedCoop._id,
        type: "IN",
        quantity: Number.parseInt(quantity),
        breed,
        startDate: startDate, // Already in correct format
        chickPrice: chickPrice ? Number.parseInt(parseCurrency(chickPrice)) : 0,
        supplier: supplier.trim(),
        reason: "nhập gà",
      })

      window.alert("Nhập gà thành công!")
      setQuantity("")
      setBreed("")
      setStartDate(new Date().toISOString().split("T")[0])
      setChickPrice("")
      setSupplier("")
      setStep(3)
      loadTransactions()
    } catch (error) {
      window.alert(`Lỗi: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTx = async (txId, txData) => {
    const confirmed = window.confirm(`Bạn có chắc muốn xóa giao dịch nhập ${txData.quantity} con ${txData.breed}?`)

    if (!confirmed) return

    try {
      await deleteChickenTx(txId)
      window.alert("Đã xóa giao dịch thành công!")
      loadTransactions()
    } catch (error) {
      window.alert(`Lỗi: ${error.message}`)
    }
  }

  // Step 1: Select Coop
  if (step === 1) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack}>
            <Text style={styles.backButton}>← Quay lại</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Chọn Chuồng Nhập Gà</Text>
        </View>

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
          ListEmptyComponent={<Text style={styles.emptyText}>Không có chuồng nào</Text>}
        />
      </View>
    )
  }

  // Step 2: Form
  if (step === 2) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setStep(1)}>
            <Text style={styles.backButton}>← Chọn chuồng khác</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Nhập Gà</Text>
          <Text style={styles.coopDisplay}>{selectedCoop?.name}</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Số lượng gà *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ví dụ: 100"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="number-pad"
            placeholderTextColor="#aaa"
          />

          <Text style={styles.label}>Giống gà *</Text>
          <View style={styles.breedContainer}>
            {breeds.map((b) => (
              <TouchableOpacity
                key={b}
                style={[styles.breedButton, breed === b && styles.breedButtonActive]}
                onPress={() => setBreed(b)}
              >
                <Text style={[styles.breedButtonText, breed === b && styles.breedButtonTextActive]}>{b}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Ngày nhập *</Text>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 12,
              fontSize: 14,
              backgroundColor: "#fff",
              width: "100%",
              fontFamily: "inherit",
            }}
          />

          <Text style={styles.label}>Giá con giống (đ)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ví dụ: 25.000"
            value={chickPrice}
            onChangeText={(text) => setChickPrice(formatCurrency(text))}
            keyboardType="number-pad"
            placeholderTextColor="#aaa"
          />

          <Text style={styles.label}>Nhà cung cấp</Text>
          <TextInput
            style={styles.input}
            placeholder="Ví dụ: Công ty TNHH Giống Gà ABC"
            value={supplier}
            onChangeText={setSupplier}
            placeholderTextColor="#aaa"
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleImportChicken} disabled={loading}>
            <Text style={styles.submitButtonText}>{loading ? "Đang lưu..." : "Nhập Gà"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }

  // Step 3: History
  if (step === 3) {
    const importTxs = transactions.filter((t) => t.type === "IN")
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setStep(1)}>
            <Text style={styles.backButton}>← Nhập gà khác</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Lịch Sử Nhập Gà ({importTxs.length})</Text>
        </View>

        <FlatList
          data={importTxs}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.txCard}>
              <View style={styles.txContent}>
                <Text style={styles.txDate}>{new Date(item.createdAt).toLocaleDateString("vi-VN")}</Text>
                <Text style={styles.txBreed}>{item.breed}</Text>
                <Text style={styles.txQuantity}>Số lượng: {item.quantity} con</Text>
                {item.chickPrice > 0 && (
                  <Text style={styles.txPrice}>Giá: {item.chickPrice.toLocaleString("vi-VN")} đ/con</Text>
                )}
                {item.chickPrice > 0 && (
                  <Text style={styles.txTotal}>
                    Tổng: {(item.chickPrice * item.quantity).toLocaleString("vi-VN")} đ
                  </Text>
                )}
                {item.supplier && <Text style={styles.txSupplier}>NCC: {item.supplier}</Text>}
              </View>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteTx(item._id, item)}>
                <Text style={styles.deleteBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />

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
    backgroundColor: COLORS.bg,
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
  breedContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  breedButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  breedButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  breedButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
  },
  breedButtonTextActive: {
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
  emptyText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 24,
  },
  txCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#4caf50",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  txContent: {
    flex: 1,
  },
  txDate: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  txBreed: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  txQuantity: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  txPrice: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 2,
    fontWeight: "600",
  },
  txTotal: {
    fontSize: 13,
    color: "#2e7d32",
    marginTop: 2,
    fontWeight: "700",
  },
  txSupplier: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  txNote: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
    fontStyle: "italic",
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
  deleteBtn: {
    backgroundColor: "#ffebee",
    borderWidth: 1,
    borderColor: "#d32f2f",
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  deleteBtnText: {
    color: "#d32f2f",
    fontSize: 16,
    fontWeight: "700",
  },
})
