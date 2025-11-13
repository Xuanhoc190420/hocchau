import mongoose from "mongoose"

const homeContentSchema = new mongoose.Schema(
  {
    sectionType: {
      type: String,
      required: true,
      enum: ["hero", "about", "features", "products", "contact", "custom"],
    },
    order: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: "",
    },
    subtitle: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    buttonText: {
      type: String,
      default: "",
    },
    buttonLink: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    items: [
      {
        title: String,
        description: String,
        icon: String,
        value: String,
        imageUrl: String,
      },
    ],
    isVisible: {
      type: Boolean,
      default: true,
    },
    backgroundColor: {
      type: String,
      default: "",
    },
    textColor: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
)

export default mongoose.model("HomeContent", homeContentSchema)
