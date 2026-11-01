import { formatters } from './formatters.js';

const statusMap = {
  "releasing": { text: "Releasing", cssClass: "status-releasing", iconId: "i-circle-dot-dashed" },
  "completed": { text: "Completed", cssClass: "status-completed", iconId: "i-circle-check-big" },
  "cancelled": { text: "Cancelled", cssClass: "status-cancelled", iconId: "i-trash" },
  "upcoming": { text: "Upcoming", cssClass: "status-upcoming", iconId: "i-circle-dot-dashed" },
  "hiatus": { text: "Hiatus", cssClass: "status-hiatus", iconId: "i-circle-pause" },
  "default": { text: "404", cssClass: "status-unknown", iconId: "i-circle-help" }
};
const globalreleaseMap = {
  true: { text: "G", cssClass: "global" }
}
const exclusiveMap = {
  true: {text: "E", cssClass: "global"}
}

const releasetypeMap = {
  "new": {text:"New", cssClass: "type-new", iconId: "i-sparkles"},
  "comeback": {text: "Comeback", cssClass: "type-returning", iconId: "i-refresh-cw"},
  "sidestory": {text: "Sidestory", cssClass: "type-returning", iconId:"i-refresh-cw"},
  "default": {text:"404"}
}

// =====
// Layout Placement
// =====
export const barLayout = {
  topBar: ["releaseDate", "releaseType", "exclusive"],
  bottomBar: ["releaseStatus", "length", "global"]
};

export const fieldMaps = {
  releaseStatus: statusMap,
  global: globalreleaseMap,
  exclusive: exclusiveMap,
  releaseDate: {
    formatter: "dateOrdinal",
    cssClass: "badge-date",
    iconId: "#i-calendar"
  },
  length: {
    key: "length",
    typeKey: "unit",
    iconMap: {
      volume: "#i-library",
      chapter: "#i-table-of-contents"
    },
    defaultIcon: "#i-table-of-contents"
  },
  releaseType: releasetypeMap
};

export const SUBTITLE_PROPERTIES = [
  {key: "author", icon: 'i-pen'},
  {key: "artist", icon: 'i-ruler'},
  {key: "creator", icon: 'i-pencil-ruler'}
]