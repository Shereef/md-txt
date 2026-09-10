import { jest } from '@jest/globals';
import fs from 'fs';

describe('cli', () => {
    let exitSpy: any;
    let consoleErrorSpy: any;
    let consoleLogSpy: any;

    beforeEach(() => {
        exitSpy = jest
            .spyOn(process, 'exit')
            .mockImplementation((() => {}) as any);
        consoleErrorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should show error if no input provided', async () => {
        // mock process.argv to simulate no arguments
        process.argv = ['node', 'cli.js'];
        await import('./cli.js');
        expect(exitSpy).toHaveBeenCalled();
    });
});
