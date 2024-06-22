
const { generateCoverageReport } = require("./coverageData")

module.exports = async () => {
    console.log("Custom Coverage Tool Results:")
    console.table(generateCoverageReport());
}