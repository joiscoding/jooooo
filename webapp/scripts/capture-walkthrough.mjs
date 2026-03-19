import { mkdir, rename } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'

const baseUrl = process.env.BASE_URL ?? 'http://127.0.0.1:5173'
const capturesRoot = path.resolve(process.cwd(), '..', 'captures')
const videoDir = path.join(capturesRoot, 'video')

async function ensureDirectories() {
  await mkdir(videoDir, { recursive: true })
}

async function wait(page, ms = 900) {
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(ms)
}

async function setCaption(page, text) {
  await page.evaluate((value) => {
    const existing = document.getElementById('capture-caption')

    if (existing) {
      existing.textContent = value
      return
    }

    const caption = document.createElement('div')
    caption.id = 'capture-caption'
    caption.textContent = value
    caption.style.position = 'fixed'
    caption.style.left = '24px'
    caption.style.bottom = '24px'
    caption.style.zIndex = '9999'
    caption.style.maxWidth = '420px'
    caption.style.padding = '14px 18px'
    caption.style.borderRadius = '18px'
    caption.style.background = 'rgba(22, 20, 18, 0.88)'
    caption.style.color = '#f6f1eb'
    caption.style.fontFamily =
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    caption.style.fontSize = '18px'
    caption.style.fontWeight = '600'
    caption.style.lineHeight = '1.35'
    caption.style.letterSpacing = '0.01em'
    caption.style.boxShadow = '0 18px 44px rgba(0, 0, 0, 0.18)'
    caption.style.backdropFilter = 'blur(12px)'

    document.body.appendChild(caption)
  }, text)
}

async function clearCaption(page) {
  await page.evaluate(() => {
    document.getElementById('capture-caption')?.remove()
  })
}

async function smoothScroll(page, y) {
  await page.evaluate((top) => {
    window.scrollTo({ top, behavior: 'smooth' })
  }, y)
}

async function recordWalkthrough() {
  await ensureDirectories()

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    colorScheme: 'light',
    recordVideo: {
      dir: videoDir,
      size: { width: 1440, height: 960 },
    },
  })
  const page = await context.newPage()

  try {
    await page.goto(baseUrl, { waitUntil: 'networkidle' })
    await page.evaluate(() => window.localStorage.clear())
    await page.reload({ waitUntil: 'networkidle' })
    await wait(page, 1200)

    await setCaption(page, 'Quiet Fold walkthrough: editorial homepage and offset gallery wall.')
    await wait(page, 1800)

    await smoothScroll(page, 620)
    await wait(page, 1500)
    await smoothScroll(page, 1420)
    await wait(page, 1500)

    await setCaption(page, 'Filtering the gallery by aesthetic, starting with Minimal / quiet.')
    await page.getByRole('button', { name: 'Minimal / quiet' }).click()
    await wait(page, 1600)

    await setCaption(page, 'Switching to Streetwear / urban for a different mood.')
    await page.getByRole('button', { name: 'Streetwear / urban' }).click()
    await wait(page, 1600)

    await setCaption(page, 'Back to the full gallery before opening a look detail page.')
    await page.getByRole('button', { name: 'All looks' }).click()
    await wait(page, 1200)

    await page.getByRole('link', { name: 'Open look' }).first().click()
    await wait(page, 1500)

    await setCaption(page, 'Inside a look detail page with hero imagery, metadata, and key items.')
    await smoothScroll(page, 520)
    await wait(page, 1400)

    await setCaption(page, 'Saving the look into a new album stored locally in the browser.')
    await page.getByRole('button', { name: 'Add to album' }).click()
    await wait(page, 900)
    await page.getByLabel('Album name').fill('Walkthrough selects')
    await page
      .getByLabel('Note')
      .fill('Looks for the demo flow, including saved references and calm tailoring.')
    await page.getByRole('button', { name: 'Save look' }).click()
    await wait(page, 1400)

    await setCaption(page, 'Opening the Albums view to inspect saved collections.')
    await page.getByRole('link', { name: 'Albums', exact: true }).click()
    await wait(page, 1500)

    await smoothScroll(page, 480)
    await wait(page, 1200)

    await page.getByRole('link', { name: 'Open album' }).first().click()
    await wait(page, 1400)

    await setCaption(page, 'Each album can also store external links for products, editorials, or moodboards.')
    await page.getByLabel('Link label').fill('Reference editorial')
    await page.getByLabel('URL').fill('https://example.com/lookbook-reference')
    await page.getByRole('button', { name: 'Add link' }).click()
    await wait(page, 1400)

    await smoothScroll(page, 760)
    await wait(page, 1500)

    await setCaption(page, 'Saved looks remain attached to the album and survive refresh via localStorage.')
    await wait(page, 2000)

    await page.getByRole('link', { name: 'Open look' }).first().click()
    await wait(page, 1200)

    await setCaption(page, 'That is the end-to-end MVP flow: browse, filter, save, and organize.')
    await smoothScroll(page, 0)
    await wait(page, 1800)
    await clearCaption(page)
    await wait(page, 700)

    const video = page.video()

    await context.close()
    await browser.close()

    if (video) {
      const recordedVideoPath = await video.path()
      await rename(recordedVideoPath, path.join(videoDir, 'quiet-fold-walkthrough.webm'))
    }

    console.log(`Saved walkthrough recording to ${path.join(videoDir, 'quiet-fold-walkthrough.webm')}`)
  } catch (error) {
    await context.close()
    await browser.close()
    throw error
  }
}

await recordWalkthrough()
