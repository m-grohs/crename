#! /usr/bin/env node
'use strict';

import { parseArgs } from 'node:util';
import { readFile } from 'node:fs';
import { select } from '@inquirer/prompts';
import { options } from '../src/options.js';

(() => {
	const { values } = parseArgs({ options, allowPositionals: true });

	// Flags -c and -d cant exits at the same time
	if ('custom' in values && 'default' in values) {
		console.error('Flags --custom/-c and --default/-d can not be used together.\n');
		process.exit();
	}

	// Flag --help read global help file
	if ('help' in values) {
		readFile('help/help.txt', 'utf-8', (err, data) => {
			if (err) console.log(err);

			console.log(data);
			process.exit();
		});
	}

	run();
})();

async function run() {
	const answer = await select({
		message: 'Select a color',
		choices: [
			{ name: 'Red', value: '#ff0000' },
			{ name: 'Green', value: '#00ff00' },
			{ name: 'Blue', value: '#0000ff' }
		]
	});
	console.log('You selected:', answer);
}

// OLD STUFF
// =========

// if (args.help) {
// }

// import { extname } from 'path';
// import { readdir, rename, renameSync } from 'node:fs';

// Current Working Directory
// const cwd = process.cwd();

// Default rename option for renaming Manga Chapters formerly known as "Folder Rename"
// function defaultRename() {
// 	// spacer
// 	console.log('\nDefault Rename:\n');

// 	readdir(cwd, (err, files) => {
// 		if (err) throw err;

// 		for (const file of files) {
// 			// Get Chapter Number with Regex and construct new Name
// 			const chapNum = file.match(/\d+/g);
// 			const newName = `Chapter ${chapNum[0]}`;

// 			rename(file, newName, (err) => {
// 				if (err) throw err;
// 			});
// 			console.log(`"${file}" renamed to: "${newName}"`);
// 		}
// 	});
// }

// async function customRename(baseName, startingCounter) {
// 	console.log('\nCustom Rename:\n');

// 	readdir(cwd, (err, files) => {
// 		let count = startingCounter;

// 		if (err) throw err;

// 		for (const file of files) {
// 			const fileExt = extname(file);

// 			// Only rename Files without Extension to skip Folders
// 			if (fileExt) {
// 				const newName = baseName + count + fileExt;

// 				renameSync(file, newName);
// 				console.log(`"${file}" renamed to: "${newName}"`);
// 				count++;
// 			}
// 		}
// 	});
// }

// const customPrompts = [
// 	{
// 		type: 'select',
// 		name: 'baseChoice',
// 		message: 'Pick Operation:',
// 		choices: [
// 			{
// 				title: 'Default Rename for Manga Chapters',
// 				description: 'Default Rename for Manga Chapters. (Renames everything in CWD regardless of Folder/File)',
// 				value: 'default'
// 			},
// 			{
// 				title: 'Custom Rename Inputs',
// 				description: 'Custom Rename with Inputs for Name and starting Number (Ignores Folders)',
// 				value: 'custom'
// 			}
// 		]
// 	},
// 	{
// 		type: (prev) => (prev === 'custom' ? 'text' : null),
// 		name: 'baseName',
// 		message: 'Enter base naming scheme i.e. "B99S1":'
// 	},
// 	{
// 		type: (_, values) => (values.baseName ? 'text' : null),
// 		name: 'baseNumber',
// 		message: 'Enter the starting number to count from:'
// 	}
// ];

// 	async () => {
// 		const resp = await prompts(customPrompts);

// 		if (resp.baseChoice === 'default') defaultRename();

// 		if (resp.baseChoice === 'custom') customRename(resp.baseName, resp.baseNumber);
// 	}
// )();
