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

// Compute next Monday 09:00 at GMT+2 (fixed offset +02:00)
function nextMondayAt0900_GMTplus2_toUnix() {
  const now = new Date();
  const day = now.getUTCDay(); // 0=Sun..6=Sat, UTC-based
  const daysUntilMon = (1 - day + 7) % 7 || 7;

  // Build a UTC date for the next Monday at 07:00 UTC, which equals 09:00 at GMT+2
  // Note: GMT+2 is UTC+2, so 09:00 local = 07:00 UTC
  const targetUtcHour = 7;
  const d = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + daysUntilMon,
    targetUtcHour, 0, 0, 0
  ));
  return Math.floor(d.getTime() / 1000);
}

(async () => {
  const post_at = nextMondayAt0900_GMTplus2_toUnix();
  const res = await web.chat.scheduleMessage({ channel: channelId, text: messageText, post_at });
  console.log('Scheduled:', res.scheduled_message_id);
})();

