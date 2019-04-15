"use strict";
module.exports = {
    collectCoverage: true,
    coveragePathIgnorePatterns: [
        '/node_modules',
        '/node_modules.linux/',
        '/node_modules.mac/'
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    modulePathIgnorePatterns: [
        'npm-cache',
        '.npm',
        'node_modules',
        'node_modules.mac',
        'node_modules.linux'
    ],
    testPathIgnorePatterns: [
        '/dist/',
        '/node_modules/',
        '/node_modules.mac/',
        '/node_modules.linux/',
        '/src/test-helpers'
    ],
    testRegex: '(src/test/|(\\.|/)(test|spec|steps))\\.(jsx?|tsx?)$',
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    }
};
//# sourceMappingURL=jest.config.js.map