const axios = require("axios");
const { buildSlackMessage } = require("../utils/slackTemplates");

async function sendToSlack(payload, webhookUrl) {
  const message = buildSlackMessage(payload);
  if (!message) return;

  try {
    await axios.post(webhookUrl, message);
    console.log("✅ Slack 메시지가 성공적으로 전송되었습니다.");
  } catch (error) {
    console.error("❌ Slack 메시지 전송에 실패했습니다:", error.response?.data || error.message);
  }
}

module.exports = { sendToSlack };
