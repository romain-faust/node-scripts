const { spawn } = require('child_process')

const FAILURE_SIGNALS = ['SIGKILL', 'SIGTERM']

module.exports = function test({ coverage = false, watch = false }) {
	const bin = require.resolve('.bin/jest')
	const args = []

	if (coverage) {
		args.push('--coverage')
	}
	if (watch) {
		args.push('--watch')
	}

	return new Promise((resolve, reject) => {
		const spawnedProcess = spawn(process.execPath, [bin, ...args], {
			stdio: 'inherit',
		})

		spawnedProcess.on('error', (error) => {
			reject(error)
		})
		spawnedProcess.on('exit', (code, signal) => {
			if (FAILURE_SIGNALS.includes(signal)) {
				resolve(1)
			} else {
				resolve(code)
			}
		})

		process.on('SIGINT', () => {
			spawnedProcess.kill('SIGINT')
		})
	})
}
