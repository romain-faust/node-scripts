const { spawn } = require('child_process')

const EXTENSIONS = ['.js', '.mjs', '.ts']
const FAILURE_SIGNALS = ['SIGKILL', 'SIGTERM']

module.exports = function build({
	deleteOutputDirOnStart = true,
	input = [],
	outputDir = 'build',
}) {
	const bin = require.resolve('.bin/babel')
	// prettier-ignore
	const args = [
		'--extensions', EXTENSIONS.join(','),
		'--ignore', EXTENSIONS.map((extension) => `**/*.test${extension}`).join(','),
		'--out-dir', outputDir,
		'--source-maps', 'true',
	]

	if (deleteOutputDirOnStart) {
		args.push('--delete-dir-on-start')
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
