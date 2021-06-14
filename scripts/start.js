const { spawn } = require('child_process')

const EXTENSIONS = ['.js', '.mjs', '.ts']
const FAILURE_SIGNALS = ['SIGKILL', 'SIGTERM']

module.exports = function start({
	exclude = [],
	inspect = false,
	inspectBrk = false,
	main,
	watch = [],
}) {
	const bin = require.resolve('.bin/babel-watch')
	// prettier-ignore
	const args = [
		'--clear-console',
		'--extensions', EXTENSIONS.join(','),
	]

	if (inspectBrk) {
		args.push('--inspect-brk', inspectBrk)
	} else if (inspect) {
		args.push('--inspect', inspect)
	}

	if (exclude.length > 0) {
		args.push('--exclude', exclude.join(','))
	}
	if (watch.length > 0) {
		args.push('--watch', watch.join(','))
	}

	args.push(main)

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
