import { mkdir, rename } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'

const baseUrl = process.env.BASE_URL ?? 'http://127.0.0.1:5173'
const capturesRoot = path.resolve(process.cwd(), '..', 'captures')
const screenshotsDir = path.join(capturesRoot, 'screenshots')
const videoDir = path.join(capturesRoot, 'video')

async function ensureDirectories() {
  await mkdir(screenshotsDir, { recursive: true })
  await mkdir(videoDir, { recursive: true })
}

async function waitForApp(page) {
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(600)
}

async function capture() {
  await ensureDirectories()

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1600 },
    colorScheme: 'light',
    recordVideo: {
      dir: videoDir,
      size: { width: 1440, height: 900 },
    },
  })
  const page = await context.newPage()

  try {
    await page.goto(baseUrl, { waitUntil: 'networkidle' })
    await page.evaluate(() => window.localStorage.clear())
    await page.reload({ waitUntil: 'networkidle' })
    await waitForApp(page)

    await page.screenshot({
      path: path.join(screenshotsDir, '01-home.png'),
      fullPage: true,
    })

    await page.getByRole('button', { name: 'Save to album' }).first().click()
    await page.getByLabel('Album name').fill('Campaign selects')
    await page
      .getByLabel('Note')
      .fill('Tonal outerwear, relaxed tailoring, and city-ready layers.')
    await page.getByRole('button', { name: 'Save look' }).click()
    await waitForApp(page)

    await page.getByRole('link', { name: 'Albums', exact: true }).click()
    await waitForApp(page)
    await page.screenshot({
      path: path.join(screenshotsDir, '02-albums.png'),
      fullPage: true,
    })

    await page.getByRole('link', { name: 'Open album' }).first().click()
    await waitForApp(page)
    await page.getByLabel('Link label').fill('Editorial reference')
    await page.getByLabel('URL').fill('https://example.com/editorial')
    await page.getByRole('button', { name: 'Add link' }).click()
    await waitForApp(page)
    await page.screenshot({
      path: path.join(screenshotsDir, '03-album-detail.png'),
      fullPage: true,
    })

    await page.getByRole('link', { name: 'Open look' }).first().click()
    await waitForApp(page)
    await page.screenshot({
      path: path.join(screenshotsDir, '04-look-detail.png'),
      fullPage: true,
    })

    await page.waitForTimeout(1400)

    const video = page.video()

    await context.close()
    await browser.close()

    if (video) {
      const recordedVideoPath = await video.path()
      await rename(recordedVideoPath, path.join(videoDir, 'quiet-fold-demo.webm'))
    }

    console.log(`Saved screenshots to ${screenshotsDir}`)
    console.log(`Saved recording to ${path.join(videoDir, 'quiet-fold-demo.webm')}`)
  } catch (error) {
    await context.close()
    await browser.close()
    throw error
  }
}

await capture()
