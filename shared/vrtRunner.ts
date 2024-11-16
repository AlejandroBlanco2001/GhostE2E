import * as fs from "fs";
import * as path from "path";

const compareImages = require("resemblejs/compareImages");

export interface ScenarioInformation {
  name: string;
  path: string;
  step: number;
  report: string;
}

// Helper function to ensure directories exist
function ensureDirSync(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Helper function to save base64 data as an image
function saveBase64Image(base64Data: string, filePath: string) {
  const data = base64Data.replace(/^data:image\/\w+;base64,/, "");
  fs.writeFileSync(filePath, data, { encoding: "base64" });
}

// Helper function to compare images and generate a diff
async function compareAndGenerateDiff(
  oldImagePath: string,
  newImagePath: string,
  diffImagePath: string
): Promise<{ mismatchPercentage: string; diffBuffer: Buffer }> {
  try {
    const result = await compareImages(
      fs.readFileSync(oldImagePath),
      fs.readFileSync(newImagePath),
      {
        output: {
          errorColor: { red: 255, green: 0, blue: 255 },
          errorType: "movement",
          largeImageThreshold: 1200,
        },
        scaleToSameSize: true,
        ignore: "antialiasing",
      }
    );

    fs.writeFileSync(diffImagePath, result.getBuffer());
    return {
      mismatchPercentage: result.misMatchPercentage,
      diffBuffer: result.getBuffer(),
    };
  } catch (error) {
    console.error(`Error comparing images:`, error);
    throw error;
  }
}

// Helper function to generate HTML report
function generateHTMLReport(content: string): string {
  return `
    <html>
      <head>
        <title>Image Comparison Report</title>
        <style>
          body { font-family: Arial, sans-serif; }
          h1 { color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          table, th, td { border: 1px solid #ddd; }
          th, td { padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .pass { color: green; }
          .fail { color: red; }
          .image-container { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .image-container div { width: 30%; }
          .image-container img { width: 100%; border: 1px solid #ddd; }
          .details { display: flex; justify-content: space-between; }
        </style>
      </head>
      <body>
        <h1>Image Comparison Report</h1>
        ${content}
      </body>
    </html>
  `;
}

// Main function to process image comparison
async function compareImagesWithResemblejs() {
  const screenshotsDir1 = "screenshots/kraken/4.5";
  const screenshotsDir2 = "screenshots/kraken/5.96.0";

  if (!fs.existsSync(screenshotsDir1) || !fs.existsSync(screenshotsDir2)) {
    console.error("One or both screenshot directories do not exist.");
    return;
  }

  const toProcessOld = fs.readFileSync(
    path.join(screenshotsDir1, "toProcess.json"),
    "utf8"
  );
  const toProcessNew = fs.readFileSync(
    path.join(screenshotsDir2, "toProcess.json"),
    "utf8"
  );

  const oldScenarios = JSON.parse(toProcessOld);
  const newScenarios = JSON.parse(toProcessNew);

  const vctReportDir = "vctReport";
  const outputImagesDir = path.join(vctReportDir, "outputImages");
  ensureDirSync(vctReportDir);
  ensureDirSync(outputImagesDir);

  let htmlContent = "";

  for (let i = 0; i < oldScenarios.length; i++) {
    const oldScenario: ScenarioInformation = oldScenarios[i];
    const newScenario: ScenarioInformation = newScenarios[i];

    if (oldScenario.name !== newScenario.name) {
      console.error("The scenarios do not match.");
      return;
    }

    const oldReport = fs.readFileSync(oldScenario.report, "utf8");
    const newReport = fs.readFileSync(newScenario.report, "utf8");

    const oldReportJSON = JSON.parse(oldReport);
    const newReportJSON = JSON.parse(newReport);

    const element = oldReportJSON[0].elements[0];
    const newElement = newReportJSON[0].elements[0];

    const id = element.name.replace(/ /g, "_");

    if (element?.steps) {
      for (let j = 0; j < element.steps.length; j++) {
        const oldSteps = element.steps[j];
        const newSteps = newElement.steps[j];

        if (oldSteps?.embeddings?.length) {
          const oldBase64Data = oldSteps.embeddings[0].data;
          const newBase64Data = newSteps.embeddings[0].data;

          const outputDirOld = path.join(outputImagesDir, "4.5", id);
          const outputDirNew = path.join(outputImagesDir, "5.96.0", id);
          const outputDirDiff = path.join(outputImagesDir, "diffs", id);

          ensureDirSync(outputDirOld);
          ensureDirSync(outputDirNew);
          ensureDirSync(outputDirDiff);

          const imageNameOld = `image_${j}_${Date.now()}.png`;
          const imageNameNew = `image_${j}_${Date.now()}.png`;
          const imageNameDiff = `diff_${j}_${Date.now()}.png`;

          const fullOldPath = path.join(outputDirOld, imageNameOld);
          const fullNewPath = path.join(outputDirNew, imageNameNew);
          const fullDiffPath = path.join(outputDirDiff, imageNameDiff);

          saveBase64Image(oldBase64Data, fullOldPath);
          saveBase64Image(newBase64Data, fullNewPath);

          try {
            const { mismatchPercentage, diffBuffer } =
              await compareAndGenerateDiff(
                fullOldPath,
                fullNewPath,
                fullDiffPath
              );

            const resultClass = mismatchPercentage === "0" ? "pass" : "fail";

            htmlContent += `
              <div class="image-container">
                <div>
                  <h3>Old Image</h3>
                  <img src="${path.join(
                    "outputImages",
                    "4.5",
                    id,
                    imageNameOld
                  )}" alt="Old Image"/>
                </div>
                <div>
                  <h3>New Image</h3>
                  <img src="${path.join(
                    "outputImages",
                    "5.96.0",
                    id,
                    imageNameNew
                  )}" alt="New Image"/>
                </div>
                <div>
                  <h3>Diff Image</h3>
                  <img src="${path.join(
                    "outputImages",
                    "diffs",
                    id,
                    imageNameDiff
                  )}" alt="Diff Image"/>
                </div>
              </div>
              <div class="details">
                <div><strong>ID:</strong> ${id}</div>
                <div><strong>Step:</strong> ${j}</div>
                <div><strong>Mismatch Percentage:</strong> ${mismatchPercentage}</div>
                <div><strong>Result:</strong> <span class="${resultClass}">${resultClass}</span></div>
              </div>
              <hr>
            `;
          } catch (error) {
            console.error(`Error comparing images for ${id} step ${j}:`, error);
          }
        }
      }
    }
  }

  const finalHtml = generateHTMLReport(htmlContent);

  // Save the final HTML report
  fs.writeFileSync(path.join(vctReportDir, "index.html"), finalHtml);
  console.log("HTML report generated: vctReport/index.html");

  const deleteExtraImages = (dirPath: string) => {
    if (fs.existsSync(dirPath)) {
      // Read all files and subdirectories in the directory
      fs.readdirSync(dirPath).forEach((file) => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
          // If it's a directory, recursively delete its contents
          deleteExtraImages(fullPath);
        } else {
          // If it's a file, delete it
          fs.unlinkSync(fullPath);
        }
      });

      // Delete the directory itself
      fs.rmdirSync(dirPath);
    }
  };

  console.log("Cleaning up extra images...");

  // Get the parent directory and build the path to the outputImages folder
  const extraFiles = path.join(__dirname, "..", "outputImages");

  // Delete the "4.5" subdirectory within "outputImages"
  deleteExtraImages(path.join(extraFiles, "4.5"));
}

compareImagesWithResemblejs();
