// schedule.cjs - CommonJS version (works with require and without top-level await)
const { WebClient } = require('@slack/web-api');

const web = new WebClient(process.env.SLACK_BOT_TOKEN);
const channelId = 'C097RTHM23X'; // e.g., C0123456789

const messageText =
  ':wave: Hi everyone! Please send your FA updates for the week by replying in this channel.\n' +
  "Here's a format you can use for your updates—just copy and paste:\n\n" +
  '---\n' +
  '*FA Weekly Update:*\n' +
  '- Project/Task:\n' +
  '- Progress:\n' +
  '- Blockers:\n' +
  '- Next Steps:\n' +
  '---\n' +
  'Thank you!';

// 09:00 at GMT+2 equals 07:00 UTC
function nextMondayAt0900_GMTplus2_toUnix() {
  const now = new Date();
  const day = now.getUTCDay(); // 0..6
  const daysUntilMon = (1 - day + 7) % 7 || 7;
  const d = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + daysUntilMon,
    7, 0, 0, 0
  ));
  return Math.floor(d.getTime() / 1000);
}

// Wrap async calls in an IIFE so we can use await in CommonJS
(async () => {
  try {
    const post_at = nextMondayAt0900_GMTplus2_toUnix();
    const res = await web.chat.scheduleMessage({
      channel: channelId,
      text: messageText,
      post_at
    });
    console.log('Scheduled:', res.scheduled_message_id);
  } catch (e) {
    console.error('Failed to schedule:', e);
    process.exit(1);
  }
})();
