import { expect, test } from '@playwright/test'

test('pemain dapat mengirim ulasan baru dari detail game tanpa memuat ulang halaman', async ({
	page,
}) => {
	const runId = crypto.randomUUID()
	const reviewerName = `Raka E2E ${runId}`
	const reviewText = `Peta yang luas membuat setiap penemuan terasa benar-benar berharga (${runId}).`

	await page.goto('/')
	await expect(page.getByRole('heading', { name: 'Elden Ring' })).toBeVisible()

	await page.getByRole('link', { name: 'Buka detail Elden Ring' }).click()
	await expect(page.getByRole('heading', { name: 'Elden Ring' })).toBeVisible()
	await expect(page.getByText('Jordan Lee', { exact: true })).toBeVisible()

	const pageLoadTime = await page.evaluate(() => performance.timeOrigin)

	await page.getByLabel('Nama reviewer').fill(reviewerName)
	await page.getByRole('radio', { name: '5 bintang' }).focus()
	await page.keyboard.press('Space')
	await expect(page.getByRole('radio', { name: '5 bintang' })).toBeChecked()
	await page.getByLabel('Teks ulasan').fill(reviewText)
	await page.getByRole('button', { name: 'Kirim ulasan' }).click()

	const submittedReview = page
		.getByRole('listitem')
		.filter({ hasText: reviewerName })
		.filter({ hasText: reviewText })
	await expect(submittedReview).toBeVisible()
	await expect(submittedReview.getByLabel('Rating 5 dari 5')).toBeVisible()
	expect(await page.evaluate(() => performance.timeOrigin)).toBe(pageLoadTime)
})
