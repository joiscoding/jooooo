/**
 * Builds a short WebM walkthrough from LB-5 empty-state screenshots.
 * Run after: npm run build && node scripts/capture-empty-states.mjs
 *
 * Output: /opt/cursor/artifacts/lb5-empty-states/empty-states-demo.webm (override with DEMO_OUT)
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const shotsDir =
  process.env.CAPTURE_OUT || '/opt/cursor/artifacts/lb5-empty-states';
const outPath =
  process.env.DEMO_OUT ||
  path.join(shotsDir, 'empty-states-demo.webm');

const inputs = [
  'gallery-filtered-empty.png',
  'albums-list-empty.png',
  'album-detail-empty.png',
];

function main() {
  const scaleChain = inputs
    .map(
      (_, i) =>
        `[${i}:v]scale=1280:900:force_original_aspect_ratio=decrease,pad=1280:900:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=20[v${i}]`
    )
    .join(';');
  const concatIn = inputs.map((_, i) => `[v${i}]`).join('');
  const filterComplex = `${scaleChain};${concatIn}concat=n=${inputs.length}:v=1:a=0[outv]`;

  const args = ['-y'];
  for (const name of inputs) {
    args.push('-loop', '1', '-t', '3', '-i', path.join(shotsDir, name));
  }
  args.push(
    '-filter_complex',
    filterComplex,
    '-map',
    '[outv]',
    '-c:v',
    'libvpx-vp9',
    '-b:v',
    '0',
    '-crf',
    '35',
    '-an',
    outPath
  );

  const r = spawnSync('ffmpeg', args, { stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status ?? 1);
  console.log('Wrote', outPath);
}

main();
