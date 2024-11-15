import { spawnSync } from "child_process";
import * as fs from "fs";
import { VERSION } from "./config";

export function runKraken() {
  const featuresDir = "./features";
  // Get all the files in the features directory
  let files = fs
    .readdirSync(featuresDir)
    .filter((f) => f.endsWith(".feature") || f.endsWith(".commented"));
  files = files.map((f) => f.replace(".commented", "")).sort();

  console.log("-".repeat(80));
  console.log(`Running Kraken tests for ${files.length} files`);
  console.log("-".repeat(80));

  if (files.length === 0) {
    console.error("No feature files found");
    process.exit(1);
  }

  let attempts = 0;
  let currentFileIndex = 0;

  while (currentFileIndex < files.length) {
    const file = files[currentFileIndex];

    if (!file) {
      console.error("Invalid file encountered. Skipping...");
      currentFileIndex++;
      continue;
    }

    console.log("-".repeat(80));
    console.log(`Running Kraken test for: ${file}`);
    console.log(`Files remaining: ${files.slice(currentFileIndex + 1)}`);
    console.log("-".repeat(80));

    if (files.includes("Version -") && VERSION !== "5.96.0") {
      console.log("Skipping Version - feature file");
      currentFileIndex++;
    }

    // Leave only the current file
    leaveOnlyOneFile(featuresDir, file);

    // Compile kraken source
    const compileRes = spawnSync("npm", ["run", "kraken-compile"], {
      stdio: "inherit",
    });
    if (compileRes.status !== 0) {
      console.error("Kraken compilation failed");
      process.exit(1);
    }

    // Run Kraken test
    const testRes = spawnSync("npx", ["kraken-node", "run"], {
      stdio: "inherit",
    });

    if (testRes.status === 0) {
      console.log(`Kraken test ${file} passed`);
      currentFileIndex++;
      attempts = 0; // Reset attempts on success
    } else {
      attempts++;
      console.log(
        `Kraken test ${file} failed, retrying (Attempt ${attempts}/3)`
      );
      if (attempts > 3) {
        console.error(`Kraken test ${file} failed 3 times. Aborting.`);
        process.exit(1);
      }
    }
  }

  console.log("All Kraken tests completed successfully.");
}

function leaveOnlyOneFile(dir: string, fname: string) {
  // Find the file that starts with the file name
  let files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".feature") || f.endsWith(".commented"));
  let onlyfile = files.find((f) => f == fname || f == fname + ".commented");
  if (!onlyfile) {
    console.error(`Could not find file ${fname} in ${dir}`);
    process.exit(1);
  }

  // Rename the file, it might have the '.commented' suffix, which this call removes
  fs.renameSync(`${dir}/${onlyfile}`, `${dir}/${fname}`);

  // Leave only the files that need renaming
  files = files.filter(
    (f) => !f.startsWith(fname) && !f.endsWith(".commented")
  );

  // Rename the rest of the files to add the commented
  files.forEach((f) => {
    fs.renameSync(`${dir}/${f}`, `${dir}/${f}.commented`);
  });
}

runKraken();
