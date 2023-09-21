import { JestConfigWithTsJest, pathsToModuleNameMapper } from 'ts-jest'
import { compilerOptions } from './tsconfig.json'

const configJest: JestConfigWithTsJest = {
    bail: true,
    clearMocks: true,
    coverageProvider: "v8",
    preset: "ts-jest",
    testMatch: ["**/*.spec.ts"],
};

export default configJest;