const fs = require('fs');

const coverageStateFile = './src/test/instrumentation/coverageState.json';

// Setting up custom coverage tool
const branchCounts = {
    "selectKeyValuesDataSource": 4,
    "rolesReducer": 4,
    "getSearchPolygon": 2,
    "reportReducer": 5,
    "extractCoordinates": 5,
    "getEnvColor": 4,
    "getMarkersForMap": 4,
}

const writeCoverage = branchCoverage => {
    const branchCoverageJSON = JSON.stringify(branchCoverage);
    fs.writeFileSync(coverageStateFile, branchCoverageJSON);
}

const readCoverage = () => JSON.parse(fs.readFileSync(coverageStateFile, 'utf8'));

export const setupBranchCoverage = () => {
    let branchCoverage = {};
    for (let [funcName, branchCount] of Object.entries(branchCounts)) {
        branchCoverage[funcName] = Array(branchCount).fill(false);
    }
    writeCoverage(branchCoverage);
}

export const markBranchHit = (functionName, branchID) => {
    /*if (Object.keys(branchCoverage).length === 0) {
        setupBranchCoverage();
        console.error(branchCoverage)
    }*/
    let branchCoverage = readCoverage();
    branchCoverage[functionName][branchID] = true;
    writeCoverage(branchCoverage);
}

const calcCoverage = branchHits => branchHits.filter(hit => hit).length / branchHits.length;

export const generateCoverageReport = () => Object.entries(readCoverage()).map(entry => ({
    "Function": entry[0],
    "Branch Coverage": `${calcCoverage(entry[1]) * 100}%`
}));