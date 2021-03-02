let math = require('mathjs');
const { convertArrayToCSV } = require('convert-array-to-csv');
const fs = require('fs');

const ALPHA = 0.01;
const MAXITERATIONS = 500;
const STEP_SIZE = 0.0001;
const TOL = 0.001;


let objectiveFunc1 = function([a, b, c, d, e, f]) {
  return Math.pow(a,2) + Math.pow(b,2) + Math.pow(c,2) + Math.pow(d,2) +Math.pow(e,2) + Math.pow(f,2);
}
var values = [];
let theta = math.matrix([1, 1, 1, 1, 1, 1]);

theta = gradientDescentMulti(objectiveFunc1, theta,ALPHA, MAXITERATIONS)
console.log(theta);
function gradientDescentMulti(objectiveFunc, theta, ALPHA, MAXITERATIONS) {
  let dsda, dsdb;
  let gradient = math.matrix([1,1,1,1,1,1]);
  let i = 0;
  while (math.norm(gradient, 2) > TOL && i < MAXITERATIONS) {
    // Gradient Calculation
    dsda = centralDifference(objectiveFunc, theta, 0);
    dsdb = centralDifference(objectiveFunc, theta, 1);
    dsdc = centralDifference(objectiveFunc, theta, 2);
    dsdd = centralDifference(objectiveFunc, theta, 3);
    dsde = centralDifference(objectiveFunc, theta, 4);
    dsdf = centralDifference(objectiveFunc, theta, 5);
    gradient = math.matrix([dsda, dsdb, dsdc, dsdd, dsde, dsdf]);
    // gradient = math.multiply(theta,2)

    theta = math.evaluate('theta - ALPHA * gradient', {
      theta,
      ALPHA,
      gradient,
    });
    i++;
    // console.log(theta);
    // Save data
    var saddness = objectiveFunc(theta._data);

    values.push([...theta._data, saddness]);
  }
  console.log(`Optimization is finished after ${i} steps`);
  return theta;
}

function centralDifference(objectiveFunc, theta, index){
  let forwardValues = [...theta._data];
  forwardValues[index] += STEP_SIZE;
  let backvardValues = [...theta._data];
  backvardValues[index] -= STEP_SIZE;
  return (objectiveFunc(forwardValues) - objectiveFunc(backvardValues))/(2*STEP_SIZE)
}

// Convert saved data to CSV
const header = ['a', 'b', 'c', 'd','e','f', 'saddness'];
const csvFromArrayOfArrays = convertArrayToCSV(values, {header, separator:","})
fs.writeFile('result.csv', csvFromArrayOfArrays, function (err) {
  if (err) return console.log(err);
  console.log('CSV File Created.');
});
