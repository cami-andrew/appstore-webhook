const statusDescriptions = {
  PREPARE_FOR_SUBMISSION: "제출 준비 중",
  READY_FOR_REVIEW: "App Store 심사 준비 완료",
  WAITING_FOR_REVIEW: "App Store 심사 대기 중",
  IN_REVIEW: "현재 App Store에서 심사 중",
  PENDING_CONTRACT: "계약 승인 대기 중",
  PENDING_APPLE_RELEASE: "승인 완료, Apple 출시 대기 중",
  PENDING_DEVELOPER_RELEASE: "승인 완료, 개발자 출시 대기 중",
  PROCESSING_FOR_APP_STORE: "App Store 처리 중",
  PROCESSING_FOR_DISTRIBUTION: "배포 처리 중",
  READY_FOR_DISTRIBUTION: "배포 준비 완료",
  REJECTED: "App Store에서 거부됨",
  METADATA_REJECTED: "메타데이터가 거부됨",
  DEVELOPER_REJECTED: "개발자가 제출 취소함",
  REMOVED_FROM_SALE: "판매를 중단함",
  DEVELOPER_REMOVED_FROM_SALE: "개발자가 판매를 중단함",
  PREORDER_READY_FOR_SALE: "사전 주문 판매 준비 완료",
  READY_FOR_SALE: "App Store에 출시됨",
  APPROVED: "출시 승인 완료",
};

const statusEmojis = {
  PREPARE_FOR_SUBMISSION: "📝",
  READY_FOR_REVIEW: "📤",
  WAITING_FOR_REVIEW: "⏳",
  IN_REVIEW: "🔎",
  PENDING_CONTRACT: "📄",
  PENDING_APPLE_RELEASE: "🍏",
  PENDING_DEVELOPER_RELEASE: "🚦",
  PROCESSING_FOR_APP_STORE: "⚙️",
  PROCESSING_FOR_DISTRIBUTION: "🔄",
  READY_FOR_DISTRIBUTION: "🎯",
  REJECTED: "❌",
  METADATA_REJECTED: "🛑",
  REMOVED_FROM_SALE: "📉",
  DEVELOPER_REMOVED_FROM_SALE: "📤",
  DEVELOPER_REJECTED: "🚫",
  PREORDER_READY_FOR_SALE: "🔔",
  READY_FOR_SALE: "✅",
  APPROVED: "📗",
};

function getAppStoreStatusLabel(code) {
  return statusDescriptions[code] || code;
}

function getStatusEmoji(code) {
  return statusEmojis[code] || "📦";
}

module.exports = {
  getAppStoreStatusLabel,
  getStatusEmoji,
};
