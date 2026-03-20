/**
 * Optional: SLACK_WEBHOOK_URL (incoming webhook) — posts a short status message.
 * Usage: SLACK_WEBHOOK_URL=https://hooks.slack.com/... node scripts/slack-notify.mjs "Your text"
 */
const url = process.env.SLACK_WEBHOOK_URL;
const text =
  process.argv.slice(2).join(' ') ||
  'FASCO landing demo: run `npm run demo:record` for screenshots + scroll video in demo-output/.';

if (!url) {
  console.error(
    'SLACK_WEBHOOK_URL is not set; skipping Slack notification. Set it to an incoming webhook URL to post.',
  );
  process.exit(0);
}

const res = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text }),
});

if (!res.ok) {
  console.error('Slack webhook failed:', res.status, await res.text());
  process.exit(1);
}

console.log('Slack notification sent.');
