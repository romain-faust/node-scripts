#!/usr/bin/env node

const { Command } = require('commander')

const build = require('../scripts/build')
const format = require('../scripts/format')
const lint = require('../scripts/lint')
const start = require('../scripts/start')
const test = require('../scripts/test')

const DEFAULT_INSPECT_ADDRESS = '127.0.0.1:9229'
const DEFAULT_OUTPUT_DIR = 'build'

const program = new Command()

// prettier-ignore
program
	.command('build <file-or-directory...>')
	.description('build for production')
	.option('--no-delete-output-dir-on-start', 'do not remove the output directory on start')
	.option('--output-dir <directory>', 'change the output directory', DEFAULT_OUTPUT_DIR)
	.action(async (filesOrDirectories, options) => {
		try {
			process.exitCode = await build({
				deleteOutputDirOnStart: options.deleteOutputDirOnStart,
				input: filesOrDirectories,
				outputDir: options.outputDir,
			})
		} catch (error) {
			console.error(error.stack)
			process.exitCode = 1
		}
	})

// prettier-ignore
program
	.command('format <file-or-directory...>')
	.description('run the code formatter')
	.option('--check', 'report the problems instead of automatically fixing them')
	.action(async (filesOrDirectories, options) => {
		try {
			process.exitCode = await format({
				check: options.check,
				input: filesOrDirectories,
			})
		} catch (error) {
			console.error(error.stack)
			process.exitCode = 1
		}
	})

// prettier-ignore
program
	.command('lint <file-or-directory...>')
	.description('run the code analysis')
	.option('--no-fix', 'report the problems instead of automatically fixing them')
	.action(async (filesOrDirectories, options) => {
		try {
			process.exitCode = await lint({
				fix: options.fix,
				input: filesOrDirectories,
			})
		} catch (error) {
			console.error(error.stack)
			process.exitCode = 1
		}
	})

// prettier-ignore
program
	.command('start <entry-point>')
	.description('build for development (ie. with live reload)')
	.option('--exclude <file-or-directory...>', 'list of files/directories to exclude from compilation', collect, [])
	.option('--inspect [host:port]', 'enable the inspector')
	.option('--inspect-brk [host:port]', 'enable the inspector (break mode)')
	.option('--watch <file-or-directory...>', 'list of additional files/directories to watch for changes', collect, [])
	.action(async (entryPoint, options) => {
		try {
			process.exitCode = await start({
				exclude: options.exclude,
				inspect: normalizeInspectAddress(options.inspect),
				inspectBrk: normalizeInspectAddress(options.inspectBrk),
				main: entryPoint,
				watch: options.watch,
			})
		} catch (error) {
			console.error(error.stack)
			process.exitCode = 1
		}
	})

// prettier-ignore
program
	.command('test')
	.description('run the tests')
	.option('--coverage', 'create a code coverage report')
	.option('--watch', 'enable the watch mode')
	.action(async (options) => {
		try {
			process.exitCode = await test({
				coverage: options.coverage,
				watch: options.watch,
			})
		} catch (error) {
			console.error(error.stack)
			process.exitCode = 1
		}
	})

program.parse(process.argv)

function collect(value, previous) {
	return [...previous, value]
}

function normalizeInspectAddress(value) {
	if (value === true) {
		return DEFAULT_INSPECT_ADDRESS
	}
	return value
}
