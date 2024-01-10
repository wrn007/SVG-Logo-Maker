const inquirer = require("inquirer");
const fs = require("fs");
const { Triangle, Square, Circle } = require("./lib/shapes");

function generateSVG(answers) {
  let svgString = `<svg version="1.1" width="300" height="200" xmlns="http://www.w3.org/2000/svg">
                    <g>`;
  let shapeChoice;

  if (answers.shape === "Triangle") {
    shapeChoice = new Triangle();
    svgString += `<polygon points="150, 18 244, 182 56, 182" fill="${answers.shapeBackgroundColor}"/>`;
  } else if (answers.shape === "Square") {
    shapeChoice = new Square();
    svgString += `<rect x="73" y="40" width="160" height="160" fill="${answers.shapeBackgroundColor}"/>`;
  } else {
    shapeChoice = new Circle();
    svgString += `<circle cx="150" cy="115" r="80" fill="${answers.shapeBackgroundColor}"/>`;
  }

  svgString += `<text x="150" y="130" text-anchor="middle" font-size="40" fill="${answers.textColor}">${answers.text}</text>
               </g>
               </svg>`;

  return { svgString, shapeChoice };
}

function writeToFile(fileName, answers) {

    const filePath = `./examples/${fileName}`;
  const { svgString, shapeChoice } = generateSVG(answers);

  fs.promises.writeFile(filePath, svgString)
    .then(() => console.log(`Generated ${filePath}`))
    .catch((err) => console.log(err));
}


function promptUser() {
  inquirer
    .prompt([
      {
        type: "input",
        message:
          "What text would you like your logo to display? (Enter up to three characters)",
        name: "text",
      },
      {
        type: "input",
        message:
          "Choose text color (Enter color keyword OR a hexadecimal number)",
        name: "textColor",
      },
      {
        type: "list",
        message: "What shape would you like the logo to render?",
        choices: ["Triangle", "Square", "Circle"],
        name: "shape",
      },
      {
        type: "input",
        message:
          "Choose shapes color (Enter color keyword OR a hexadecimal number)",
        name: "shapeBackgroundColor",
      },
    ])
    .then((answers) => {
      if (answers.text.length > 3) {
        console.log("Error: Text should be up to three characters.");
        promptUser();
      } else {
        writeToFile("logo.svg", answers);
      }
    })
    .catch((err) => {
      if (err.isTtyError) {
        console.error("Error: Unable to render prompts in this environment.");
      } else {
        console.error(err.message);
      }
    });
}

promptUser();