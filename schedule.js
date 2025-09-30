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

function nextMondayAt0900Utc() {
  // Schedules for 09:00 UTC; if 09:00 local time is needed, compute the offset to UTC or change hour here.
  const now = new Date();
  const day = now.getUTCDay(); // 0=Sun..6=Sat
  const daysUntilMon = (1 - day + 7) % 7 || 7;
  const d = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + daysUntilMon,
    9, 0, 0, 0  // 09:00 UTC
  ));
  return Math.floor(d.getTime() / 1000);
}

(async () => {
  const post_at = nextMondayAt0900Utc();
  const res = await web.chat.scheduleMessage({ channel: channelId, text: messageText, post_at });
  console.log('Scheduled:', res.scheduled_message_id);
})();
