//importing dependancies
const inquirer = require("inquirer"); 
const fs = require("fs"); 
const { Triangle, Square, Circle } = require("./lib/shapes"); 

function generateSVG(answers) {
  let svgString = `<svg version="1.1" width="300" height="200" xmlns="http://www.w3.org/2000/svg"><g>`;
  let shapeChoice;

  // updates the string based off the selecting options
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

  // Add text to the SVG string
  svgString += `<text x="150" y="130" text-anchor="middle" font-size="40" fill="${answers.textColor}">${answers.text}</text></g></svg>`;

  // return the string
  return { svgString, shapeChoice };
}

function writeToFile(fileName, answers) {
  const filePath = `./examples/${fileName}`;
  const { svgString, shapeChoice } = generateSVG(answers);
  // Write the SVG string to the specified path
  fs.promises.writeFile(filePath, svgString)
    .then(() => console.log(`Generated ${filePath}`))
    .catch((err) => console.log(err));
}

function promptUser() {
  // Prompt the user with questions
  inquirer
    .prompt([
      { type: "input", message: "Text for logo (up to 3 characters)", name: "text" },
      { type: "input", message: "Text color (color or hex)", name: "textColor" },
      { type: "list", message: "Shape for the logo", choices: ["Triangle", "Square", "Circle"], name: "shape" },
      { type: "input", message: "Shape color (color or hex)", name: "shapeBackgroundColor" },
    ])
    .then((answers) => {
      // Check if the entered text is 3 or less chars
      if (answers.text.length > 3) {
        console.log("Error: Text should be up to three characters.");
        //reprompt if not
        promptUser();
      } else {
        //writes file
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

// initializes
promptUser();
