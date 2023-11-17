module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleDirectories: [
        'node_modules',
        '<rootDir>',
    ],
    setupFilesAfterEnv: ['./jest.setup.js']
};
