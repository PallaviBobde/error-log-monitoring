const fs = require("fs");

// clear data from output.txt if there's existing data
fs.writeFile("output.txt", "", () => {});

// Define a data structure to store log entries
let logEntries = [];

// Function to parse input commands
function parseCommand(command) {
  const choice = command.trim().split(" ");
  const partsToAdd = choice[1].trim().split(";");
  const operation = parseInt(choice[0]);

  switch (operation) {
    case 1: {
      const [timestamp, logType, severity] = partsToAdd;
      logEntries.push({
        timestamp: parseInt(timestamp),
        logType,
        severity: Number(severity),
      });
      writeToOutput("No output");
      break;
    }
    case 2: {
      const logTypeMean = choice[1];
      computeMeanSeverityByLogType(logTypeMean);
      break;
    }

    case 3: {
      const direction = choice[1];
      const timestampBeforeAfter = choice[2];
      computeMeanSeverityBeforeAfter(direction, timestampBeforeAfter);
      break;
    }

    case 4: {
      const directionLogType = choice[1];
      const logType = choice[2];
      const timestampBeforeAfterLogType = choice[3];
      computeMeanSeverityBeforeAfterLogType(
        directionLogType,
        logType,
        parseInt(timestampBeforeAfterLogType)
      );
      break;
    }

    default:
      console.log(`Invalid operation: ${operation}`);
  }
}

// Function to compute mean severity of a log type
function computeMeanSeverityByLogType(logType) {
  const filteredEntries = logEntries.filter(
    (entry) => entry.logType === logType
  );
  const totalSeverity = filteredEntries.reduce(
    (sum, entry) => sum + entry.severity,
    0
  );
  const meanSeverity = totalSeverity / filteredEntries.length;
  writeToOutput(`Mean: ${meanSeverity}`);
}

// Function to compute mean severity before or after a timestamp
function computeMeanSeverityBeforeAfter(direction, timestamp) {
  let filteredEntries = [];
  if (direction === "BEFORE") {
    filteredEntries = logEntries.filter((entry) => entry.timestamp < timestamp);
  } else if (direction === "AFTER") {
    filteredEntries = logEntries.filter((entry) => entry.timestamp > timestamp);
  }

  console.log();

  const totalSeverity = filteredEntries.reduce(
    (sum, entry) => sum + entry.severity,
    0
  );
  const meanSeverity =
    filteredEntries.length === 0
      ? (0).toFixed(1)
      : totalSeverity / filteredEntries.length;
  writeToOutput(`Mean: ${meanSeverity}`);
}

// Function to compute mean severity before or after a timestamp for a specific log type
function computeMeanSeverityBeforeAfterLogType(direction, logType, timestamp) {
  let filteredEntries = [];
  if (direction === "BEFORE") {
    filteredEntries = logEntries.filter(
      (entry) => entry.logType === logType && entry.timestamp < timestamp
    );
  } else if (direction === "AFTER") {
    filteredEntries = logEntries.filter(
      (entry) => entry.logType === logType && entry.timestamp > timestamp
    );
  }
  const totalSeverity = filteredEntries.reduce(
    (sum, entry) => sum + entry.severity,
    0
  );
  const meanSeverity =
    filteredEntries.length === 0
      ? (0).toFixed(1)
      : Number(totalSeverity / filteredEntries.length).toFixed(6);
  writeToOutput(`Mean: ${meanSeverity}`);
}

// Function to write output to file
function writeToOutput(data) {
  fs.appendFileSync("output.txt", `${data}\n`);
}

// Read input file and process commands
fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading input file:", err);
    return;
  }

  const commands = data.split("\n");
  commands.forEach(parseCommand);
});
