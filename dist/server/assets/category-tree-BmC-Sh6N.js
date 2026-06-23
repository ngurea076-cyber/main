const ALL_CATEGORIES_LABEL = "All Categories";
const CATEGORY_TREE = [
  {
    label: "Laptops",
    query: "laptops",
    featured: {
      eyebrow: "Performance Picks",
      title: "Laptops",
      subtitle: "Power for study, work, and play"
    },
    items: [
      "Brand New Laptops",
      "Gaming Laptops",
      "MacBooks",
      "Ex-UK Laptops",
      "Business Laptops",
      "2-in-1 Convertible Laptops",
      "Student Laptops",
      "Workstation Laptops"
    ]
  },
  {
    label: "Monitors",
    query: "monitors",
    featured: {
      eyebrow: "Display Upgrade",
      title: "Monitors",
      subtitle: "Sharper views for every setup"
    },
    items: [
      "Brand New Monitors",
      "Gaming Monitors",
      "Ex-UK Monitors",
      "Curved Monitors",
      "4K UHD Monitors",
      "Office Monitors",
      "Ultrawide Monitors",
      "Portable Monitors",
      "Touchscreen Monitors",
      "CCTV Monitors"
    ]
  },
  {
    label: "Audio",
    query: "audio",
    featured: {
      eyebrow: "Sound Essentials",
      title: "Audio",
      subtitle: "Rich sound at home and on the move"
    },
    items: [
      "Bluetooth Speakers",
      "Soundbars",
      "Wireless Earbuds",
      "Wired Earphones",
      "Over-Ear Headphones",
      "Gaming Headsets",
      "Smart Speakers",
      "Studio Microphones"
    ]
  },
  {
    label: "Smartphones",
    query: "smartphones",
    featured: {
      eyebrow: "Pocket Tech",
      title: "Smartphones",
      subtitle: "Latest phones and smart wearables"
    },
    items: [
      "iPhones",
      "Samsung Phones",
      "Android Phones",
      "Refurbished Phones",
      "Budget Smartphones",
      "Flagship Smartphones",
      "Gaming Phones",
      "Foldable Phones",
      "Smart Watches"
    ]
  },
  {
    label: "Printers",
    query: "printers",
    featured: {
      eyebrow: "Office Output",
      title: "Printers",
      subtitle: "Reliable printing for business and home"
    },
    items: [
      "Inkjet Printers",
      "Laser Printers",
      "All-in-One Printers",
      "Wireless Printers",
      "Receipt Printers",
      "Barcode Printers",
      "Photo Printers",
      "Scanner Machines"
    ]
  },
  {
    label: "Accessories",
    query: "accessories",
    featured: {
      eyebrow: "Daily Add-ons",
      title: "Accessories",
      subtitle: "Finish your setup with the right extras"
    },
    items: [
      "Laptop Bags",
      "Keyboards",
      "Wireless Mice",
      "USB Flash Drives",
      "External Hard Drives",
      "HDMI Cables",
      "Power Banks",
      "WiFi Routers"
    ]
  }
];
function getCategoryGroup(label) {
  return CATEGORY_TREE.find((category) => category.label === label);
}
function getCategoryGroupBySearchParam(value) {
  const normalized = String(value ?? "").trim();
  if (!normalized) return null;
  return CATEGORY_TREE.find(
    (category) => category.label.toLowerCase() === normalized.toLowerCase() || category.query.toLowerCase() === normalized.toLowerCase()
  ) ?? null;
}
function isSubcategoryForMainCategory(mainCategory, value) {
  const group = getCategoryGroup(mainCategory);
  return Boolean(group?.items.some((item) => item === value));
}
export {
  ALL_CATEGORIES_LABEL as A,
  CATEGORY_TREE as C,
  getCategoryGroupBySearchParam as g,
  isSubcategoryForMainCategory as i
};
