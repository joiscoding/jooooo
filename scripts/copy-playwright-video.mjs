import { copyFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function findVideoWebm(dir) {
  if (!existsSync(dir)) return null;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p, { throwIfNoEntry: false });
    if (!st) continue;
    if (st.isDirectory()) {
      const inner = findVideoWebm(p);
      if (inner) return inner;
    } else if (name === 'video.webm') {
      return p;
    }
  }
  return null;
}

const src = findVideoWebm('test-results');
const dest = '/opt/cursor/artifacts/lb2-global-search.webm';
if (src) {
  try {
    copyFileSync(src, dest);
  } catch {
    /* optional copy when artifacts dir is not writable */
  }
}
