"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native"
import { COLORS } from "../../styles/theme"
import { API_BASE } from "../../api/api"
import axios from "axios"

export default function ContactScreen({ onNavigate }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!name || !email || !subject || !message) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin")
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(`${API_BASE}/api/contact`, {
        name,
        email,
        phone,
        subject,
        message,
      })

      if (response.data.ok) {
        setSubmitted(true)
        setName("")
        setEmail("")
        setPhone("")
        setSubject("")
        setMessage("")

        setTimeout(() => setSubmitted(false), 3000)
      }
    } catch (error) {
      Alert.alert("Lỗi", error.response?.data?.error || "Gửi thất bại")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate("Home")}>
          <Text style={styles.backButton}>← Quay lại Trang chủ</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Liên Hệ Với Chúng Tôi</Text>
        <Text style={styles.subtitle}>Chúng tôi sẽ phản hồi sớm nhất có thể</Text>
      </View>

      {submitted && (
        <View style={styles.successMessage}>
          <Text style={styles.successText}>Gửi thành công! Cảm ơn bạn đã liên hệ.</Text>
        </View>
      )}

      <View style={styles.form}>
        <Text style={styles.label}>Họ và Tên</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập tên của bạn"
          value={name}
          onChangeText={setName}
          editable={!loading}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="example@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          editable={!loading}
        />

        <Text style={styles.label}>Số điện thoại (Tùy chọn)</Text>
        <TextInput
          style={styles.input}
          placeholder="+84 ..."
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          editable={!loading}
        />

        <Text style={styles.label}>Chủ đề</Text>
        <TextInput
          style={styles.input}
          placeholder="Chủ đề liên hệ"
          value={subject}
          onChangeText={setSubject}
          editable={!loading}
        />

        <Text style={styles.label}>Nội dung</Text>
        <TextInput
          style={[styles.input, styles.messageInput]}
          placeholder="Nhập nội dung của bạn..."
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitBtnText}>{loading ? "Đang gửi..." : "Gửi"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Thông tin liên hệ</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Điện thoại:</Text>
          <Text style={styles.infoValue}>+84 1234 567 890</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>support@gadoihoanglong.com</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Địa chỉ:</Text>
          <Text style={styles.infoValue}>Đồi Hùng Sơn, Tây Sơn, Yên Bái</Text>
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
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 24,
  },
  backButton: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  successMessage: {
    backgroundColor: "#e8f5e9",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  successText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "600",
  },
  form: {
    gap: 12,
    marginBottom: 24,
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
    marginBottom: 12,
  },
  messageInput: {
    minHeight: 100,
    paddingVertical: 12,
  },
  submitBtn: {
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
  submitBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  infoSection: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 8,
  },
  infoItem: {
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 13,
    color: "#333",
  },
})
