let math = require('mathjs');
const { convertArrayToCSV } = require('convert-array-to-csv');
const fs = require('fs');

const ALPHA = 0.0001;
const ITERATIONS = 80000;
const STEP_SIZE = 0.0001;
const TOL = 0.001;


let objectiveFunc1 = function(a, b, c, d, e, f) {
  return Math.pow(a,2) + Math.pow(b,2) + Math.pow(c,2) + Math.pow(d,2) +Math.pow(e,2) + Math.pow(f,2);
}
var values = [];
let theta = math.matrix([1, 1, 1, 1, 1, 1]);

theta = gradientDescentMulti(objectiveFunc1, theta,ALPHA,ITERATIONS)
console.log(theta);
function gradientDescentMulti(objectiveFunc, theta, ALPHA, ITERATIONS) {
  let dsda, dsdb;
  let gradient = math.matrix([1,1,1,1,1,1]);
  let i = 0;
  while (math.norm(gradient, 2) > TOL && i < ITERATIONS) {
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
    var saddness = objectiveFunc(theta._data[0],
                                  theta._data[1],
                                  theta._data[2],
                                  theta._data[3],
                                  theta._data[4],
                                  theta._data[5],
                                  );

    values.push([...theta._data, saddness]);
  }
  console.log(`Optimization is finished after ${i} steps`);
  return theta;
}

function centralDifference(objectiveFunc, theta, index){
  let aF, bF, cF, dF, eF, fF;
  let aB, bB, cB, dB, eB, fB;
  let forwardValues = [...theta._data];
  forwardValues[index] += STEP_SIZE;
  [aF, bF, cF, dF, eF, fF] = forwardValues;
  let backvardValues = [...theta._data];
  backvardValues[index] -= STEP_SIZE;
  [aB, bB, cB, dB, eB, dB] = backvardValues;
  return (objectiveFunc(aF, bF, cF, dF, eF, fF) - objectiveFunc(aB, bB, cB, dB, eB, dB))/(2*STEP_SIZE)
}

// Convert saved data to CSV
const header = ['a', 'b', 'c', 'd','e','f', 'saddness'];
const csvFromArrayOfArrays = convertArrayToCSV(values, {header, separator:","})
fs.writeFile('result.csv', csvFromArrayOfArrays, function (err) {
  if (err) return console.log(err);
  console.log('CSV File Created.');
});
