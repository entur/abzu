beforeAll(() => {
    // Setting up custom coverage tool
    const branchCounts = {
        "selectKeyValuesDataSource": 4,
        "rolesReducer": 4,
        "getSearchPolygon": 2,
        "reportReducer": 5,
        "extractCoordinates": 5,
        "getEnvColor": 4,
        "getMarkersForMap" : 4,
    }

    global.branchCoverage = {}

    for (let [funcName, branchCount] of Object.entries(branchCounts)) {
        global.branchCoverage[funcName] = Array(branchCount).fill(false);
    }

    global.markBranchHit = (functionName, branchID) => {
        global.branchCoverage[functionName][branchID] = true;
    }
});

afterAll(() => {
    // Output results of custom coverage tool
    const calcCoverage = branchHits => branchHits.filter(hit => hit).length / branchHits.length;
    console.log("Custom Coverage Tool Results:")
    const coverageReport = Object.entries(global.branchCoverage).map(entry => ({
        "Function" : entry[0],
        "Branch Coverage" : `${calcCoverage(entry[1]) * 100}%`
    }));
    console.table(coverageReport);
});