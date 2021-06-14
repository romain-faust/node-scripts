const { spawn } = require('child_process')

const FAILURE_SIGNALS = ['SIGKILL', 'SIGTERM']

module.exports = function format({ check = false, input = [] }) {
	const bin = require.resolve('.bin/prettier')
	// prettier-ignore
	const args = [
		check ? '--check' : '--write',
		...input,
	]

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
