const { spawn } = require('child_process')

const FAILURE_SIGNALS = ['SIGKILL', 'SIGTERM']

module.exports = function lint({ fix = true, input = [] }) {
	const bin = require.resolve('.bin/eslint')
	const args = []

	if (fix) {
		args.push('--fix')
	}

	args.push(...input)

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
