import { View, Text, StyleSheet, ScrollView } from "react-native"
import { COLORS } from "../../styles/theme"

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Hero Section with Gradient */}
      <View style={styles.heroSection}>
        <View style={styles.heroImageContainer}>
          <View style={styles.heroImagePlaceholder} />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Gà Đồi Hoàng Long</Text>
            <Text style={styles.heroSubtitle}>Chất lượng Premium Từ Thiên Nhiên</Text>
          </View>
        </View>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Về Chúng Tôi</Text>
        <View style={styles.aboutCard}>
          <Text style={styles.aboutText}>
            Gà Đồi Hoàng Long được nuôi dưỡng trên những đồi núi tự nhiên, với điều kiện sống tối ưu và chế độ ăn uống
            chuẩn dinh dưỡng. Mỗi con gà đều được chăm sóc tỉ mỉ để mang lại sản phẩm chất lượng cao nhất.
          </Text>
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tại Sao Chọn Chúng Tôi</Text>
        <View style={styles.featureGrid}>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🏔️</Text>
            <Text style={styles.featureTitle}>Nuôi Tự Nhiên</Text>
            <Text style={styles.featureDesc}>Gà nuôi trên đồi với điều kiện sống tự nhiên</Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🌾</Text>
            <Text style={styles.featureTitle}>Chế Độ Ăn Uống</Text>
            <Text style={styles.featureDesc}>Thức ăn tự nhiên, không chất bảo quản</Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>✅</Text>
            <Text style={styles.featureTitle}>Chất Lượng</Text>
            <Text style={styles.featureDesc}>Đảm bảo an toàn vệ sinh thực phẩm</Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>📦</Text>
            <Text style={styles.featureTitle}>Giao Hàng Nhanh</Text>
            <Text style={styles.featureDesc}>Vận chuyển tươi mới đến tận nhà</Text>
          </View>
        </View>
      </View>

      {/* Chicken Image Section */}
      <View style={styles.chickenSection}>
        {/* Placeholder for chicken portrait */}
        <View style={styles.chickenImagePlaceholder} />
        <View style={styles.chickenContent}>
          <Text style={styles.chickenTitle}>Gà Đồi Hoàng Long</Text>
          <Text style={styles.chickenDesc}>
            Được chọn lọc kỹ lưỡng, nuôi dưỡng tỉ mỉ trên những đồi cao, với khí hậu mát mẻ và thiên nhiên tươi tốt.
          </Text>
        </View>
      </View>

      {/* Products Preview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sản Phẩm Nổi Bật</Text>
        <View style={styles.productPreviewGrid}>
          <View style={styles.productPreviewCard}>
            <Text style={styles.productPreviewIcon}>🐔</Text>
            <Text style={styles.productPreviewName}>Gà Tươi</Text>
          </View>
          <View style={styles.productPreviewCard}>
            <Text style={styles.productPreviewIcon}>🍗</Text>
            <Text style={styles.productPreviewName}>Gà Khô</Text>
          </View>
          <View style={styles.productPreviewCard}>
            <Text style={styles.productPreviewIcon}>🥚</Text>
            <Text style={styles.productPreviewName}>Trứng Gà</Text>
          </View>
          <View style={styles.productPreviewCard}>
            <Text style={styles.productPreviewIcon}>🍜</Text>
            <Text style={styles.productPreviewName}>Phở Gà</Text>
          </View>
        </View>
      </View>

      {/* Contact Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Liên Hệ Với Chúng Tôi</Text>
        <View style={styles.contactInfo}>
          <Text style={styles.contactItem}>📞 +84 1234 567 890</Text>
          <Text style={styles.contactItem}>📧 support@gadoihoanglong.com</Text>
          <Text style={styles.contactItem}>📍 Đồi Hùng Sơn, Tây Sơn, Yên Bái</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Gà Đồi Hoàng Long - Chất Lượng Là Ưu Tiên</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafbfc",
  },

  // Hero Section - IMPROVED
  heroSection: {
    height: 320,
    position: "relative",
    marginBottom: 24,
  },
  heroImageContainer: {
    flex: 1,
    position: "relative",
  },
  heroImagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#4a90e2",
    backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  heroContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 40,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#e8e8e8",
    textAlign: "center",
    fontWeight: "600",
  },

  // Sections
  section: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 16,
  },

  // About Section
  aboutCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  aboutText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 22,
  },

  // Features Grid
  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  featureCard: {
    width: "48%",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 6,
  },
  featureDesc: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    lineHeight: 18,
  },

  // Chicken Section
  chickenSection: {
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  chickenImagePlaceholder: {
    width: "100%",
    height: 240,
    backgroundColor: "#FFC107",
  },
  chickenContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  chickenTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 8,
  },
  chickenDesc: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },

  // Products Preview
  productPreviewGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  productPreviewCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  productPreviewIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  productPreviewName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },

  // Contact Info
  contactInfo: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  contactItem: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },

  // Footer
  footer: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#fff",
    textAlign: "center",
  },
})
