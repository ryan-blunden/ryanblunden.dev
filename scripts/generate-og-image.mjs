import path from 'path';
import { spawn } from 'child_process';
import puppeteer from 'puppeteer';

const targetUrl = process.env.OG_IMAGE_URL ?? 'http://localhost:4321/og-image';
const outputPath = path.resolve(process.cwd(), 'public', 'og-image.jpg');

const serverUrl = new URL(targetUrl);
const isLocalhost = serverUrl.hostname === 'localhost' || serverUrl.hostname === '127.0.0.1';
let devServerProcess = null;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const canFetch = async (url) => {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 1000);

	try {
		const response = await fetch(url, { signal: controller.signal });
		return response.ok;
	} catch {
		return false;
	} finally {
		clearTimeout(timeout);
	}
};

const startDevServer = () => {
	devServerProcess = spawn('npm', ['run', 'dev', '--', '--host', '0.0.0.0'], {
		stdio: 'ignore',
		shell: process.platform === 'win32',
	});
};

const ensureDevServer = async () => {
	if (!isLocalhost) {
		return;
	}

	if (await canFetch(targetUrl)) {
		return;
	}

	startDevServer();

	const attempts = 30;
	for (let i = 0; i < attempts; i += 1) {
		await wait(500);
		if (await canFetch(targetUrl)) {
			return;
		}
	}

	throw new Error('Dev server failed to start within 15s.');
};

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();

try {
	await ensureDevServer();

	await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
	await page.goto(targetUrl, { waitUntil: 'networkidle0' });

	await page.evaluate(async () => {
		const image = document.querySelector('#og-image img');
		const imageReady =
			image && !image.complete
				? new Promise((resolve) => {
						image.addEventListener('load', resolve, { once: true });
						image.addEventListener('error', resolve, { once: true });
					})
				: Promise.resolve();
		await Promise.all([document.fonts?.ready ?? Promise.resolve(), imageReady]);
	});

	const element = await page.$('#og-image');
	if (!element) {
		throw new Error('Missing #og-image element on the page.');
	}

	await element.screenshot({
		path: outputPath,
		type: 'jpeg',
		quality: 92,
	});
} finally {
	await page.close();
	await browser.close();
	if (devServerProcess) {
		devServerProcess.kill('SIGTERM');
	}
}
