import { expect, test } from '@playwright/test'

test('pemain dapat mengirim ulasan baru dari detail game tanpa memuat ulang halaman', async ({
	page,
}) => {
	const reviewText =
		'Peta yang luas membuat setiap penemuan terasa benar-benar berharga.'

	await page.goto('/')
	await expect(page.getByRole('heading', { name: 'Elden Ring' })).toBeVisible()

	await page.getByRole('link', { name: 'Buka detail Elden Ring' }).click()
	await expect(page.getByRole('heading', { name: 'Elden Ring' })).toBeVisible()
	await expect(page.getByText('Jordan Lee', { exact: true })).toBeVisible()

	const pageLoadTime = await page.evaluate(() => performance.timeOrigin)

	await page.getByLabel('Nama reviewer').fill('Raka E2E')
	await page.getByRole('radio', { name: '5 bintang' }).focus()
	await page.keyboard.press('Space')
	await expect(page.getByRole('radio', { name: '5 bintang' })).toBeChecked()
	await page.getByLabel('Teks ulasan').fill(reviewText)
	await page.getByRole('button', { name: 'Kirim ulasan' }).click()

	await expect(page.getByText(reviewText, { exact: true })).toBeVisible()
	expect(await page.evaluate(() => performance.timeOrigin)).toBe(pageLoadTime)
})
