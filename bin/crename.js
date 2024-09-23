#! /usr/bin/env node
'use strict';

import { parseArgs } from 'node:util';
import { readdir, readFile, rename, renameSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, extname, join } from 'node:path';
import { confirm, input, select } from '@inquirer/prompts';
import { options } from '../src/options.js';

(async () => {
	const { values, positionals } = parseArgs({ options, allowPositionals: true });

	// Check for Flags and Arguments
	if (Object.keys(values).length === 0) {
		const answer = await select({
			message: 'Pick Renaming Operation:',
			choices: [
				{ name: 'Default Rename for Folders', value: 'default' },
				{ name: 'Custom Rename for Files', value: 'custom' }
			]
		});

		if (answer === 'default') {
			defaultRename();
		}

		if (answer === 'custom') {
			customRename([]);
		}
	}

	if (Object.keys(values).length >= 1) {
		// Flags -c and -d cant exits at the same time
		if ('custom' in values && 'default' in values) {
			console.error('Flags --custom/-c and --default/-d can not be used together.\n');
			process.exit(9);
		}

		// Flag --help read global help file only when there is no arg
		// otherwise show specific help files to other commands.
		if ('help' in values && Object.keys(values).length === 1) {
			const arg = positionals;
			const helpFile = getHelpFile(arg[0]);

			readFile(helpFile, 'utf-8', (err, data) => {
				if (err) console.log(err);
				console.log(data);
				process.exitCode = 0;
			});
		}

		if ('default' in values) {
			defaultRename(positionals);
		}

		if ('custom' in values) {
			customRename(positionals);
		}
	}
})();

function getHelpFile(arg) {
	const __fileName = fileURLToPath(import.meta.url);
	const __dirname = dirname(__fileName);

	let fileName = 'help.txt';

	if (arg === 'default') {
		fileName = 'help_default.txt';
	}

	if (arg === 'custom') {
		fileName = 'help_custom.txt';
	}

	return join(__dirname, '..', 'help', fileName);
}

async function defaultRename(args) {
	const cwd = process.cwd();
	const startTime = new Date();

	// Check for No or Empty Arguments
	if (!args || args.length === 0) args = ['Chapter '];

	// Check for more Arguments
	if (args.length > 1) {
		console.log(`\nOnly one argument is allowed. Ignored Argument(s): ${args.slice(1)}\n`);
		process.exit(9);
	}

	const confirmation = await confirm({
		message: 'This will rename all existing Folders in the current Directory.\nAre you sure you want to continue?',
		default: true
	});

	if (confirmation) {
		console.log('\nStarting Default Renaming Process...\n');

		readdir(cwd, (err, files) => {
			if (err) throw err;

			for (const file of files) {
				// Get file extension to only rename Folders
				const fileExt = extname(file);

				if (!fileExt) {
					// Get Folder Number with Regex and construct new Name
					const chapNum = file.match(/\d+/g);

					// Exit when there is no Number to use
					if (!chapNum) {
						console.log(`"${file}" has no Number. Aborting...\n`);
						process.exit(9);
					}
					const newName = args[0] + chapNum[0];
					rename(file, newName, (err) => {
						if (err) throw err;
					});
					console.log(`"${file}" renamed to: "${newName}"`);
				}
			}
			const endTime = new Date();
			const timeDiff = (endTime - startTime) / 1000;
			console.log(`\nDefault Renaming took ${timeDiff}s to complete.\n`);
		});
	}

	process.exitCode = 0;
}

async function customRename(args) {
	const cwd = process.cwd();
	let baseName, baseNum;

	// Check for Arguments
	if (args.length < 1) {
		// baseName does not need a type check. string and number are both valid
		baseName = await input({
			message: "Enter base naming scheme i.e. 'B99S1':"
		});

		baseNum = await input({
			message: "Enter starting number i.e. '1':"
		});

		if (!checkType(baseNum, 'number')) {
			console.log('Starting Number needs to be a Number.\n');
			process.exit(9);
		}
	}

	// Exit if only one Argument is provided
	if (args.length === 1) {
		console.log(
			'\nCustom Rename needs 2 Arguments.\nArg 1 specifies the base naming scheme i.e. "B99S1E".\nArg 2 specifies the Starting Number to count of from i.e. "1".\n'
		);
		process.exit(9);
	}

	if (args.length > 1) {
		// Check that the 2nd Argument for Custom Rename is a valid Number
		baseName = args[0];
		baseNum = Number(args[1]);

		if (checkType(baseNum, 'number') === false) {
			console.log('Starting Number needs to be a Number and greater than 0.\n');
			process.exit(9);
		}
	}

	const confirmation = await confirm({
		message: 'This will rename all existing Files in the current Directory.\nAre you sure you want to continue?',
		default: true
	});

	if (confirmation) {
		const startTime = new Date();

		console.log('\nStarting Custom Rename Process...\n');

		readdir(cwd, (err, files) => {
			if (err) throw err;

			for (const file of files) {
				const fileExt = extname(file);

				// Only rename Files with Extension to skip Folders
				if (fileExt) {
					const newName = baseName + baseNum + fileExt;
					renameSync(file, newName);
					console.log(`"${file}" renamed to: "${newName}"`);
					baseNum++;
				}
			}
			const endTime = new Date();
			const timeDiff = (endTime - startTime) / 1000;
			console.log(`\nCustom Renaming took ${timeDiff}s to complete.\n`);
			process.exitCode = 0;
		});
	}
}

// Checks if an input is a Number and greater than 0
function checkType(ele, type) {
	if (type === 'number') {
		const num = Number(ele);
		if (isNaN(num) || num < 1) {
			return false;
		}
		return true;
	}
}
