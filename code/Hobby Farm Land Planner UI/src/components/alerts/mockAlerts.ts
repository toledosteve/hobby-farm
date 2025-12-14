import type { Alert, NotificationPreferences } from "./types";

export const mockAlerts: Alert[] = [
  {
    id: "alert-1",
    category: "weather",
    severity: "important",
    status: "new",
    title: "Frost Risk Tonight",
    shortDescription:
      "Overnight temperatures may drop below freezing. Orchard trees in bloom could be affected.",
    fullDescription:
      "Tonight's forecast shows temperatures dropping to 28°F between 2am and 6am. This could damage blossoms on your apple and pear trees, potentially affecting fruit set. Consider protective measures like wind machines, smudge pots, or overhead irrigation if available. Even a few degrees of protection can make a difference.",
    affectedModules: ["Orchard"],
    icon: "🌡️",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    actionLabel: "View Orchard",
    actionLink: "orchard",
    metadata: {
      weatherCondition: "Clear, calm night",
      temperatureF: 28,
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "alert-2",
    category: "opportunity",
    severity: "heads-up",
    status: "new",
    title: "Ideal Sap Flow Starting",
    shortDescription:
      "Good conditions expected for the next 3-4 days. Temperatures cycling above and below freezing.",
    fullDescription:
      "Weather patterns show excellent sap flow conditions starting tomorrow. Daytime highs near 45°F and nighttime lows around 25°F create the freeze-thaw cycles that drive strong sap flow. This is a great window to maximize your maple syrup collection.",
    affectedModules: ["Maple Sugaring"],
    icon: "🍁",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    actionLabel: "View Sugar Bush",
    actionLink: "maple",
    metadata: {
      weatherCondition: "Freeze-thaw cycle",
      temperatureF: 45,
    },
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "alert-3",
    category: "task",
    severity: "heads-up",
    status: "new",
    title: "Hive Inspections Due",
    shortDescription:
      "3 hives haven't been inspected in over 2 weeks. Good weather this weekend for inspection.",
    fullDescription:
      "It's been 16 days since your last hive inspections for Hive A, Hive B, and Hive C. With temperatures forecast to be in the 60s this weekend, it's a good opportunity to check on queen activity, brood patterns, and food stores. Spring is an active time for colonies.",
    affectedModules: ["Beekeeping"],
    icon: "🐝",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    actionLabel: "View Hives",
    actionLink: "beekeeping",
    metadata: {
      taskType: "Hive Inspection",
    },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "alert-4",
    category: "health",
    severity: "notice",
    status: "read",
    title: "Medication Withdrawal Period",
    shortDescription:
      "Withdrawal period for flock treatment ends in 3 days (Dec 17). Eggs can be consumed after this date.",
    fullDescription:
      "Your Wyandotte flock received a treatment on December 7th with a 10-day egg withdrawal period. As of December 17th, eggs from this flock will be safe for consumption. Mark your calendar and resume normal egg collection after this date.",
    affectedModules: ["Poultry"],
    icon: "🦠",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    metadata: {
      taskType: "Medication Withdrawal",
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "alert-5",
    category: "task",
    severity: "notice",
    status: "read",
    title: "Pruning Window Closing",
    shortDescription:
      "Dormant pruning season for fruit trees ends in 3-4 weeks as buds begin to swell.",
    fullDescription:
      "Late winter is the ideal time for dormant pruning of fruit trees. With spring approaching, you have about 3-4 weeks left before buds begin to swell and it's best to stop major pruning. Focus on structural pruning for young trees and maintenance pruning for mature trees.",
    affectedModules: ["Orchard"],
    icon: "✂️",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    actionLabel: "View Trees",
    actionLink: "orchard",
    metadata: {
      taskType: "Dormant Pruning",
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "alert-6",
    category: "opportunity",
    severity: "heads-up",
    status: "read",
    title: "Good Planting Window Approaching",
    shortDescription:
      "Soil conditions and temperatures favorable for tree planting in 2-3 weeks.",
    fullDescription:
      "Early spring provides an excellent window for planting bare-root fruit trees and native species. Soil is workable and trees are still dormant, allowing them to establish roots before leafing out. Start preparing planting sites and consider ordering any trees you'd like to add this season.",
    affectedModules: ["Orchard", "Trees"],
    icon: "🌱",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    actionLabel: "View Tree Inventory",
    actionLink: "trees",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "alert-7",
    category: "weather",
    severity: "notice",
    status: "snoozed",
    title: "Heat Stress Possible Tomorrow",
    shortDescription:
      "High temperatures forecast (85°F+). Monitor chickens for signs of heat stress.",
    fullDescription:
      "Tomorrow's forecast shows temperatures reaching 88°F with high humidity. Poultry are sensitive to heat stress. Ensure fresh water is available, provide shade, and consider offering frozen treats or electrolytes. Watch for panting, wing spreading, or reduced activity.",
    affectedModules: ["Poultry"],
    icon: "🌡️",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    snoozedUntil: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Snoozed for 2 days
    actionLabel: "View Flock",
    actionLink: "poultry",
    metadata: {
      weatherCondition: "Hot and humid",
      temperatureF: 88,
    },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "alert-8",
    category: "opportunity",
    severity: "heads-up",
    status: "new",
    title: "Peak Bloom Overlap for Pollination",
    shortDescription:
      "Your apple varieties are blooming simultaneously. Excellent cross-pollination opportunity.",
    fullDescription:
      "Weather conditions and tree development have aligned bloom timing across your Honeycrisp, Gala, and Granny Smith trees. This overlap creates ideal conditions for cross-pollination. With bee activity forecast to be good over the next week, you should see strong fruit set.",
    affectedModules: ["Orchard", "Beekeeping"],
    icon: "🌸",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    actionLabel: "View Orchard",
    actionLink: "orchard",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
];

export const defaultNotificationPreferences: NotificationPreferences = {
  enabled: true,
  categories: {
    weather: true,
    task: true,
    health: true,
    opportunity: true,
  },
  deliveryMethod: "in-app",
  emailSummaryFrequency: "daily",
};
