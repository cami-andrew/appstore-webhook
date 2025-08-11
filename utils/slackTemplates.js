const {
  getAppStoreStatusLabel,
  getStatusEmoji,
} = require("./stateDescriptions");

const { DateTime } = require("luxon");

function formatTimestamp(iso) {
  const timezone = process.env.TIMEZONE || "UTC";
  const date = DateTime.fromISO(iso, { zone: "utc" }).setZone(timezone);
  return date.toFormat("ccc, dd LLL yyyy HH:mm:ss ZZZZ");
}

function buildSlackMessage(payload) {
  const type = payload.data?.type || "unknown";
  const rawTimestamp =
    payload.data?.attributes?.timestamp || new Date().toISOString();
  const timestamp = formatTimestamp(rawTimestamp);

  const APP_STORE_URL = process.env.APP_STORE_URL || null;

  const events = {
    appStoreVersionAppVersionStateUpdated: () => {
      const newValue = payload.data.attributes.newValue;
      const oldValue = payload.data.attributes.oldValue;
      const versionId = payload?.data?.relationships?.instance?.data?.id;

      let blocks = [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "🚀 앱의 상태가 변경되었습니다.",
            emoji: true,
          },
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*${getStatusEmoji(newValue)} 현재 상태:*\n${getAppStoreStatusLabel(newValue)}`,
            },
            {
              type: "mrkdwn",
              text: `*이전 상태:*\n${getAppStoreStatusLabel(oldValue)}`,
            },
            {
              type: "mrkdwn",
              text: `*Timestamp:*\n${timestamp}`,
            },
            {
              type: "mrkdwn",
              text: `*Version ID:*\n${versionId}`,
            },
          ],
        },
      ];

      if (APP_STORE_URL) {
        blocks.push({
          type: "section",
          text: {
            type: "mrkdwn",
            text: `<${APP_STORE_URL}|🔗 App Store에서 보기>`,
          },
        });
      }

      return { blocks };
    },

    webhookPingCreated: () => ({
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "🔄 웹훅 핑 테스트",
            emoji: true,
          },
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Ping ID:*\n${payload.data.id}`,
            },
            {
              type: "mrkdwn",
              text: `*Timestamp:*\n${timestamp}`,
            },
          ],
        },
      ],
    }),

    webhookPings: () => null,

    betaFeedbackScreenshotSubmissionCreated: () => {
      const feedbackId = payload.data.relationships?.instance?.data?.id;
      const timestamp = formatTimestamp(payload.data.attributes.timestamp);

      const adamId = process.env.APP_ADAM_ID;
      const bundleId = process.env.APP_BUNDLE_ID;
      const platformId = process.env.APP_PLATFORM_ID;

      const elements = [];

      const isValidFeedbackId = typeof feedbackId === "string" && feedbackId.trim() !== "";

      if (isValidFeedbackId && adamId) {
        const webLink = `https://appstoreconnect.apple.com/apps/${adamId}/testflight/screenshots/${feedbackId}`;
        elements.push({
          type: "mrkdwn",
          text: `🌐 <${webLink}|App Store Connect에서 보기>`,
        });
      }

      if (isValidFeedbackId && adamId && bundleId && platformId) {
        const xcodeLink = `xcode://organizer/feedback/downloadFeedback?adamId=${adamId}&feedbackId=${feedbackId}&bundleId=${bundleId}&platformId=${platformId}&userAgent=appStoreConnect`;
        elements.push({
          type: "mrkdwn",
          text: `💻 <${xcodeLink}|Xcode Organizer에서 보기>`,
        });
      }

      const blocks = [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "🧪 TestFlight 피드백 스크린샷이 제출되었습니다",
            emoji: true,
          },
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Screenshot ID:*\n\`${feedbackId}\``,
            },
            {
              type: "mrkdwn",
              text: `*Timestamp:*\n${timestamp}`,
            },
          ],
        },
      ];

      if (elements.length > 0) {
        blocks.push({
          type: "context",
          elements,
        });
      }

      return { blocks };
    },

    betaFeedbackCrashSubmissionCreated: () => {
      const crashId = payload.data.relationships?.instance?.data?.id;
      const timestamp = formatTimestamp(payload.data.attributes.timestamp);

      const adamId = process.env.APP_ADAM_ID;

      const elements = [];

      const isValidCrashId = typeof crashId === "string" && crashId.trim() !== "";
      if (isValidCrashId && adamId) {
        const webLink = `https://appstoreconnect.apple.com/apps/${adamId}/testflight/crashes/${crashId}`;
        elements.push({
          type: "mrkdwn",
          text: `🌐 <${webLink}|App Store Connect에서 보기>`,
        });
      }

      const blocks = [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "🐞 TestFlight 크래시 피드백 제출되었습니다.",
            emoji: true,
          },
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Crash ID:*\n\`${crashId}\``,
            },
            {
              type: "mrkdwn",
              text: `*Timestamp:*\n${timestamp}`,
            },
          ],
        },
      ];

      if (elements.length > 0) {
        blocks.push({
          type: "context",
          elements,
        });
      }

      return { blocks };
    },
  };

  const template = events[type]?.() ?? {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `📬 처리되지 않은 App Store 이벤트: ${type}`,
          emoji: true,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "```json\n" + JSON.stringify(payload, null, 2) + "\n```",
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `⏱️ *Timestamp:* ${timestamp}`,
          },
        ],
      },
    ],
  };

  return template;
}

module.exports = { buildSlackMessage };
