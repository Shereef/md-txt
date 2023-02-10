#!/usr/bin/env node
'use strict';
import * as meow from 'meow';
import { markdownToTxt } from 'markdown-to-txt';
import fs from 'fs';

export const cli = meow.default(
    `
	Usage
	  $ md-txt source.md destination.txt
	  
	Example
	  $ md-txt CHANGELOG.md CHANGELOG.txt

	Options
	  -f, --force    force overwrite of destination file
`,
    {
        importMeta: import.meta,
        flags: {
            force: {
                type: 'boolean',
                alias: 'f',
                default: false,
            },
            verbose: {
                type: 'boolean',
                alias: 'v',
                default: false,
            },
        },
    },
);

if (cli.input.length < 2) {
    console.error('Please specify source and destination path');
    process.exit(1);
}

try {
    const inputFile = cli.input[0];
    if (fs.existsSync(inputFile)) {
        if (cli.flags.verbose || process.env.DEBUG === 'true') {
            console.debug(`file '${inputFile}' found!`);
        }
    } else {
        console.error(`file '${inputFile}' not found!`);
        process.exit(1);
    }

    const outputFile = cli.input[1];
    if (!cli.flags.force) {
        if (fs.existsSync(outputFile)) {
            console.error(`
      file '${outputFile}' found!
      Please delete it, run with --force or change the destination filename/extension
      `);
            process.exit(1);
        } else {
            if (cli.flags.verbose || process.env.DEBUG === 'true') {
                console.debug(`file '${outputFile}' found!`);
            }
        }
    } else {
        if (cli.flags.verbose || process.env.DEBUG === 'true') {
            console.debug(`running with force`);
        }
    }
    if (cli.flags.verbose || process.env.DEBUG === 'true') {
        console.debug('inputFile', inputFile);
        console.debug('outputFile', outputFile);
    } else {
        console.info(`Converting ${inputFile} to ${outputFile}`);
    }
    const inputData = fs.readFileSync(inputFile, 'utf-8');
    if (cli.flags.verbose && process.env.DEBUG === 'true') {
        console.debug('inputData', inputData);
    }
    const outputData = markdownToTxt(inputData);
    if (fs.existsSync(outputFile)) {
        if (cli.flags.verbose || process.env.DEBUG === 'true') {
            console.log('File exists. Deleting now ...');
        }
        fs.rmSync(outputFile);
    }

    if (cli.flags.verbose && process.env.DEBUG === 'true') {
        console.debug('outputData', outputData);
    }
    if (cli.flags.verbose || process.env.DEBUG === 'true') {
        console.log('Saving converted file');
    }
    fs.writeFileSync(outputFile, outputData);
    if (cli.flags.verbose || process.env.DEBUG === 'true') {
        console.log('Done!');
    }
} catch (err) {
    console.error(err);
    process.exit(1);
}
