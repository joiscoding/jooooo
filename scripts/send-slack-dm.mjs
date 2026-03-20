/**
 * Post a DM using a Slack bot (chat:write + im:history or users scope).
 * Set SLACK_BOT_TOKEN (xoxb-...) and SLACK_USER_ID (U…).
 * Optional: SLACK_MESSAGE
 */
const token = process.env.SLACK_BOT_TOKEN;
const userId = process.env.SLACK_USER_ID;
const text =
  process.env.SLACK_MESSAGE ??
  'FASCO landing demo is ready: run `npm run dev` then `npm run demo:capture`. Assets: `/opt/cursor/artifacts/assets/fasco-landing-demo/` (PNGs + `landing-demo.webm`).';

async function slackApi(method, body) {
  const res = await fetch(`https://slack.com/api/${method}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!data.ok) {
    throw new Error(`${method}: ${data.error ?? res.status}`);
  }
  return data;
}

async function main() {
  if (!token || !userId) {
    console.warn(
      '[slack] SLACK_BOT_TOKEN and SLACK_USER_ID not set — skipping Slack DM.',
    );
    process.exit(0);
  }

  const { channel } = await slackApi('conversations.open', { users: userId });
  await slackApi('chat.postMessage', { channel, text });
  console.log('[slack] DM sent.');
}

main().catch((err) => {
  console.error('[slack]', err.message);
  process.exit(1);
});
