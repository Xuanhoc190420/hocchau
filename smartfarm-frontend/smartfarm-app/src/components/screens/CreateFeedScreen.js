"use client"

import { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ScrollView } from "react-native"
import { COLORS } from "../../styles/theme"
import { getCoops, createFeed, getFeeds, deleteFeed } from "../../api/api"

const INGREDIENT_OPTIONS = [
  { id: "cam_co", name: "Cám cỏ" },
  { id: "cam_gao", name: "Cám gạo" },
  { id: "cam_ngo", name: "Cám ngô" },
  { id: "lua_mach", name: "Lúa mạch" },
  { id: "ngo", name: "Ngô" },
  { id: "dau_nanh", name: "Đậu nành" },
  { id: "custom", name: "➕ Thêm thành phần khác" }, // Added custom ingredient option
]

const formatCurrency = (value) => {
  // Remove all non-digit characters
  const numbers = value.replace(/\D/g, "")
  if (!numbers) return ""

  // Add thousand separators
  return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

const parseCurrency = (value) => {
  // Remove dots and return plain number
  return value.replace(/\./g, "")
}

export default function CreateFeedScreen({ onBack, isAdmin = true }) {
  const [step, setStep] = useState(1)
  const [coops, setCoops] = useState([])
  const [selectedCoop, setSelectedCoop] = useState(null)
  const [feedType, setFeedType] = useState(null)
  const [compoundFeedWeek, setCompoundFeedWeek] = useState(null)

  const [feedName, setFeedName] = useState("")
  const [quantity, setQuantity] = useState("")
  const [unitPrice, setUnitPrice] = useState("")

  const [ingredients, setIngredients] = useState([])
  const [showIngredientSelector, setShowIngredientSelector] = useState(false)
  const [currentIngredientName, setCurrentIngredientName] = useState("")
  const [currentIngredientQty, setCurrentIngredientQty] = useState("")
  const [currentIngredientPrice, setCurrentIngredientPrice] = useState("")
  const [isCustomIngredient, setIsCustomIngredient] = useState(false) // Track if adding custom ingredient

  const [feeds, setFeeds] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCoops()
    loadFeeds()
  }, [])

  const loadCoops = async () => {
    try {
      const data = await getCoops()
      setCoops(data || [])
    } catch (error) {
      window.alert(error.message)
    }
  }

  const loadFeeds = async () => {
    try {
      const data = await getFeeds()
      setFeeds(data || [])
    } catch (error) {
      window.alert(error.message)
    }
  }

  const resetForm = () => {
    setFeedName("")
    setQuantity("")
    setUnitPrice("")
    setIngredients([])
    setCurrentIngredientName("")
    setCurrentIngredientQty("")
    setCurrentIngredientPrice("")
    setFeedType(null)
    setCompoundFeedWeek(null)
  }

  const handleSelectCoop = (coop) => {
    setSelectedCoop(coop)
    setStep(2)
  }

  const handleSelectFeedType = (type) => {
    setFeedType(type)
    if (type === "compound") {
      setStep(3) // Go to compound feed week selection
    } else {
      setStep(4) // Go to vaccine/vitamin form
    }
  }

  const handleSelectCompoundWeek = (week) => {
    setCompoundFeedWeek(week)
    setFeedName(`Thức ăn tổng hợp tuần ${week}`)
    setStep(5) // Go to ingredient selection
  }

  const handleAddIngredient = () => {
    if (!currentIngredientName.trim() || !currentIngredientQty.trim() || !currentIngredientPrice.trim()) {
      window.alert("Vui lòng nhập đầy đủ thông tin thành phần")
      return
    }

    const qty = Number.parseFloat(currentIngredientQty)
    const price = Number.parseFloat(parseCurrency(currentIngredientPrice))

    if (isNaN(qty) || qty <= 0 || isNaN(price) || price <= 0) {
      window.alert("Số lượng và đơn giá phải là số dương")
      return
    }

    setIngredients([
      ...ingredients,
      {
        name: currentIngredientName,
        quantity: qty,
        unitPrice: price,
        totalPrice: qty * price,
      },
    ])
    setCurrentIngredientName("")
    setCurrentIngredientQty("")
    setCurrentIngredientPrice("")
    setShowIngredientSelector(false)
    setIsCustomIngredient(false)
  }

  const handleRemoveIngredient = (index) => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa thành phần này?")

    if (confirmed) {
      setIngredients(ingredients.filter((_, i) => i !== index))
    }
  }

  const calculateTotalCost = () => {
    if (feedType === "vaccine" || feedType === "vitamin") {
      const qty = Number.parseFloat(quantity) || 0
      const price = Number.parseFloat(parseCurrency(unitPrice)) || 0
      return qty * price
    } else if (feedType === "compound") {
      return ingredients.reduce((sum, ing) => sum + ing.totalPrice, 0)
    }
    return 0
  }

  const handleSaveFeed = async () => {
    if (feedType === "vaccine" || feedType === "vitamin") {
      if (!feedName.trim() || !quantity.trim() || !unitPrice.trim()) {
        window.alert("Vui lòng nhập đầy đủ thông tin")
        return
      }
    } else if (feedType === "compound") {
      if (ingredients.length === 0) {
        window.alert("Vui lòng thêm ít nhất một thành phần")
        return
      }
    }

    const totalCost = calculateTotalCost()

    try {
      setLoading(true)

      await createFeed({
        name: feedName.trim(),
        type: feedType,
        ingredients:
          feedType === "compound"
            ? ingredients
            : [
                {
                  name: feedName,
                  quantity: Number.parseFloat(quantity),
                  unitPrice: Number.parseFloat(parseCurrency(unitPrice)),
                  totalPrice: totalCost,
                },
              ],
        coopId: selectedCoop._id,
        totalCost,
      })

      window.alert(
        `Tạo ${feedType === "vaccine" ? "vắc-xin" : feedType === "vitamin" ? "vitamin" : "thức ăn tổng hợp"} thành công!\nChi phí: ${totalCost.toLocaleString("vi-VN")} đ`,
      )
      resetForm()
      setStep(6)
      loadFeeds()
    } catch (error) {
      window.alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUnitPriceChange = (text) => {
    const formatted = formatCurrency(text)
    setUnitPrice(formatted)
  }

  const handleIngredientPriceChange = (text) => {
    const formatted = formatCurrency(text)
    setCurrentIngredientPrice(formatted)
  }

  const handleDeleteFeed = async (feedId, feedName) => {
    const confirmed = window.confirm(`Bạn có chắc muốn xóa "${feedName}" không?`)

    if (confirmed) {
      try {
        setLoading(true)
        await deleteFeed(feedId)
        window.alert("Xóa thức ăn thành công!")
        await loadFeeds()
      } catch (error) {
        window.alert("Lỗi khi xóa thức ăn: " + error.message)
      } finally {
        setLoading(false)
      }
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
          <Text style={styles.title}>Chọn Chuồng</Text>
        </View>

        <FlatList
          data={coops}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.coopSelectCard} onPress={() => handleSelectCoop(item)}>
              <View style={styles.coopSelectInfo}>
                <Text style={styles.coopSelectName}>{item.name}</Text>
                <Text style={styles.coopSelectCount}>{item.chickens || 0} gà</Text>
              </View>
              <Text style={styles.selectArrow}>›</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>Không có chuồng nào</Text>}
        />
      </View>
    )
  }

  // Step 2: Select Feed Type
  if (step === 2) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setStep(1)}>
            <Text style={styles.backButton}>← Chọn chuồng khác</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Tạo Thức Ăn</Text>
          <Text style={styles.subtitle}>{selectedCoop?.name}</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Chọn loại thức ăn</Text>

          <TouchableOpacity
            style={[styles.feedTypeCard, feedType === "vaccine" && styles.feedTypeCardSelected]}
            onPress={() => handleSelectFeedType("vaccine")}
          >
            <View style={styles.checkboxContainer}>
              <View style={[styles.checkbox, feedType === "vaccine" && styles.checkboxChecked]}>
                {feedType === "vaccine" && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </View>
            <View style={styles.feedTypeInfo}>
              <Text style={styles.feedTypeName}>💉 Vắc-xin</Text>
              <Text style={styles.feedTypeDesc}>Vắc-xin phòng bệnh cho gà</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.feedTypeCard, feedType === "vitamin" && styles.feedTypeCardSelected]}
            onPress={() => handleSelectFeedType("vitamin")}
          >
            <View style={styles.checkboxContainer}>
              <View style={[styles.checkbox, feedType === "vitamin" && styles.checkboxChecked]}>
                {feedType === "vitamin" && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </View>
            <View style={styles.feedTypeInfo}>
              <Text style={styles.feedTypeName}>💊 Vitamin</Text>
              <Text style={styles.feedTypeDesc}>Vitamin bổ sung dinh dưỡng</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.feedTypeCard, feedType === "compound" && styles.feedTypeCardSelected]}
            onPress={() => handleSelectFeedType("compound")}
          >
            <View style={styles.checkboxContainer}>
              <View style={[styles.checkbox, feedType === "compound" && styles.checkboxChecked]}>
                {feedType === "compound" && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </View>
            <View style={styles.feedTypeInfo}>
              <Text style={styles.feedTypeName}>🌾 Thức ăn tổng hợp</Text>
              <Text style={styles.feedTypeDesc}>Thức ăn hỗn hợp nhiều thành phần</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  // Step 3: Select Compound Feed Week (1-30)
  if (step === 3) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setStep(2)}>
            <Text style={styles.backButton}>← Quay lại</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Chọn Thức Ăn Tổng Hợp</Text>
          <Text style={styles.subtitle}>Tuần 1 - 30</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.weekGrid}>
            {Array.from({ length: 30 }, (_, i) => i + 1).map((week) => (
              <TouchableOpacity
                key={week}
                style={[styles.weekButton, compoundFeedWeek === week && styles.weekButtonSelected]}
                onPress={() => handleSelectCompoundWeek(week)}
              >
                <Text style={[styles.weekButtonText, compoundFeedWeek === week && styles.weekButtonTextSelected]}>
                  {week}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    )
  }

  // Step 4: Vaccine/Vitamin Form
  if (step === 4) {
    const typeLabel = feedType === "vaccine" ? "Vắc-xin" : "Vitamin"

    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setStep(2)}>
            <Text style={styles.backButton}>← Quay lại</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Thông Tin {typeLabel}</Text>
          <Text style={styles.subtitle}>{selectedCoop?.name}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inlineFormRow}>
            <View style={styles.inlineFormItem}>
              <Text style={styles.label}>Tên {typeLabel.toLowerCase()} *</Text>
              <TextInput
                style={styles.input}
                placeholder={`Ví dụ: ${feedType === "vaccine" ? "Newcastle" : "B-Complex"}`}
                value={feedName}
                onChangeText={setFeedName}
                placeholderTextColor="#aaa"
              />
            </View>
          </View>

          <View style={styles.inlineFormRow}>
            <View style={[styles.inlineFormItem, { flex: 1 }]}>
              <Text style={styles.label}>Số lượng *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ví dụ: 100"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="decimal-pad"
                placeholderTextColor="#aaa"
              />
            </View>

            <View style={[styles.inlineFormItem, { flex: 1 }]}>
              <Text style={styles.label}>Đơn giá (đ) *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ví dụ: 5.000"
                value={unitPrice}
                onChangeText={handleUnitPriceChange}
                keyboardType="number-pad"
                placeholderTextColor="#aaa"
              />
            </View>
          </View>

          {quantity && unitPrice && (
            <View style={styles.totalCostBox}>
              <Text style={styles.totalCostLabel}>Tổng chi phí:</Text>
              <Text style={styles.totalCostValue}>{calculateTotalCost().toLocaleString("vi-VN")} đ</Text>
            </View>
          )}

          <TouchableOpacity style={styles.submitButton} onPress={handleSaveFeed} disabled={loading}>
            <Text style={styles.submitButtonText}>{loading ? "Đang lưu..." : "Hoàn Tất"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }

  // Step 5: Compound Feed Ingredients
  if (step === 5) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setStep(3)}>
            <Text style={styles.backButton}>← Quay lại</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{feedName}</Text>
          <Text style={styles.subtitle}>Thành phần thức ăn</Text>
        </View>

        <View style={styles.form}>
          {!showIngredientSelector ? (
            <>
              <Text style={styles.label}>Danh sách thành phần ({ingredients.length})</Text>

              {ingredients.map((item, index) => (
                <View key={index} style={styles.ingredientCard}>
                  <View style={styles.ingredientCardContent}>
                    <Text style={styles.ingredientCardName}>{item.name}</Text>
                    <View style={styles.ingredientCardDetails}>
                      <Text style={styles.ingredientCardText}>Số lượng: {item.quantity} kg</Text>
                      <Text style={styles.ingredientCardText}>
                        Đơn giá: {item.unitPrice.toLocaleString("vi-VN")} đ/kg
                      </Text>
                      <Text style={styles.ingredientCardTotal}>
                        Thành tiền: {item.totalPrice.toLocaleString("vi-VN")} đ
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRemoveIngredient(index)}
                    style={styles.ingredientDeleteBtn}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.ingredientDeleteBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity style={styles.addButton} onPress={() => setShowIngredientSelector(true)}>
                <Text style={styles.addButtonText}>+ Thêm Thành Phần</Text>
              </TouchableOpacity>

              {ingredients.length > 0 && (
                <>
                  <View style={styles.totalCostBox}>
                    <Text style={styles.totalCostLabel}>Tổng chi phí:</Text>
                    <Text style={styles.totalCostValue}>{calculateTotalCost().toLocaleString("vi-VN")} đ</Text>
                  </View>

                  <TouchableOpacity style={styles.submitButton} onPress={handleSaveFeed} disabled={loading}>
                    <Text style={styles.submitButtonText}>{loading ? "Đang lưu..." : "Hoàn Tất"}</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          ) : (
            <>
              <Text style={styles.label}>Chọn thành phần</Text>

              <View style={styles.ingredientOptions}>
                {INGREDIENT_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.ingredientOptionButton,
                      currentIngredientName === option.name && styles.ingredientOptionButtonSelected,
                    ]}
                    onPress={() => {
                      if (option.id === "custom") {
                        setIsCustomIngredient(true)
                        setCurrentIngredientName("")
                      } else {
                        setIsCustomIngredient(false)
                        setCurrentIngredientName(option.name)
                      }
                    }}
                  >
                    <View style={styles.checkboxContainer}>
                      <View style={[styles.checkbox, currentIngredientName === option.name && styles.checkboxChecked]}>
                        {currentIngredientName === option.name && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                    </View>
                    <Text style={styles.ingredientOptionText}>{option.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {isCustomIngredient && (
                <View style={styles.inlineFormRow}>
                  <View style={styles.inlineFormItem}>
                    <Text style={styles.label}>Tên thành phần *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Nhập tên thành phần"
                      value={currentIngredientName}
                      onChangeText={setCurrentIngredientName}
                      placeholderTextColor="#aaa"
                    />
                  </View>
                </View>
              )}

              {(currentIngredientName || isCustomIngredient) && (
                <>
                  <View style={styles.inlineFormRow}>
                    <View style={[styles.inlineFormItem, { flex: 1 }]}>
                      <Text style={styles.label}>Số lượng (kg) *</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Ví dụ: 50"
                        value={currentIngredientQty}
                        onChangeText={setCurrentIngredientQty}
                        keyboardType="decimal-pad"
                        placeholderTextColor="#aaa"
                      />
                    </View>

                    <View style={[styles.inlineFormItem, { flex: 1 }]}>
                      <Text style={styles.label}>Đơn giá (đ/kg) *</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Ví dụ: 15.000"
                        value={currentIngredientPrice}
                        onChangeText={handleIngredientPriceChange}
                        keyboardType="number-pad"
                        placeholderTextColor="#aaa"
                      />
                    </View>
                  </View>

                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={[styles.modalBtn, styles.cancelBtn]}
                      onPress={() => {
                        setShowIngredientSelector(false)
                        setCurrentIngredientName("")
                        setCurrentIngredientQty("")
                        setCurrentIngredientPrice("")
                        setIsCustomIngredient(false)
                      }}
                    >
                      <Text style={styles.cancelBtnText}>Hủy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.modalBtn, styles.submitBtn]} onPress={handleAddIngredient}>
                      <Text style={styles.submitBtnText}>Thêm</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>
    )
  }

  // Step 6: Feed List
  if (step === 6) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              resetForm()
              setSelectedCoop(null)
              setStep(1)
            }}
          >
            <Text style={styles.backButton}>← Tạo thức ăn khác</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Danh Sách Thức Ăn ({feeds.length})</Text>
        </View>

        <FlatList
          data={feeds}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.feedCard}>
              <View style={styles.feedCardContent}>
                <View style={styles.feedCardHeader}>
                  <Text style={styles.feedCardName}>{item.name}</Text>
                  <View style={styles.feedTypeBadge}>
                    <Text style={styles.feedTypeBadgeText}>
                      {item.type === "vaccine" ? "💉" : item.type === "vitamin" ? "💊" : "🌾"}
                    </Text>
                  </View>
                </View>
                <Text style={styles.feedCardIngredients}>{item.ingredients?.length || 0} thành phần</Text>
                {item.totalCost && (
                  <Text style={styles.feedCardCost}>Chi phí: {item.totalCost.toLocaleString("vi-VN")} đ</Text>
                )}
              </View>
              <TouchableOpacity style={styles.feedDeleteButton} onPress={() => handleDeleteFeed(item._id, item.name)}>
                <Text style={styles.feedDeleteButtonText}>✕</Text>
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
  subtitle: {
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
    marginTop: 4,
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
  inlineFormRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  inlineFormItem: {
    flex: 1,
  },
  feedTypeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  feedTypeCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: "#f0f8ff",
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  checkmark: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  feedTypeInfo: {
    flex: 1,
  },
  feedTypeName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  feedTypeDesc: {
    fontSize: 12,
    color: "#666",
  },
  weekGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  weekButton: {
    width: "15%",
    aspectRatio: 1,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  weekButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  weekButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  weekButtonTextSelected: {
    color: "#fff",
  },
  ingredientOptions: {
    marginBottom: 16,
  },
  ingredientOptionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  ingredientOptionButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: "#f0f8ff",
  },
  ingredientOptionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  ingredientCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ingredientCardContent: {
    flex: 1,
  },
  ingredientCardName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    marginBottom: 6,
  },
  ingredientCardDetails: {
    gap: 2,
  },
  ingredientCardText: {
    fontSize: 12,
    color: "#666",
  },
  ingredientCardTotal: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.primary,
    marginTop: 4,
  },
  ingredientDeleteBtn: {
    backgroundColor: "#ffebee",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ff6b6b",
    marginLeft: 8,
  },
  ingredientDeleteBtnText: {
    color: "#d32f2f",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 18,
  },
  addButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginTop: 8,
  },
  addButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  totalCostBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginTop: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  totalCostLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  totalCostValue: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.primary,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  coopSelectCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  coopSelectInfo: {
    flex: 1,
  },
  coopSelectName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  coopSelectCount: {
    fontSize: 14,
    color: "#666",
  },
  selectArrow: {
    fontSize: 24,
    color: COLORS.primary,
    fontWeight: "300",
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
  feedCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    borderLeftWidth: 5,
    borderLeftColor: COLORS.primary,
  },
  feedCardContent: {
    flex: 1,
    padding: 14,
  },
  feedCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  feedCardName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    flex: 1,
  },
  feedTypeBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  feedTypeBadgeText: {
    fontSize: 14,
  },
  feedCardIngredients: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  feedCardCost: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.primary,
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
  feedDeleteButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  feedDeleteButtonText: {
    fontSize: 22,
    color: "#ff6b6b",
    fontWeight: "700",
  },
})
  