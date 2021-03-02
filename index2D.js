let math = require('mathjs');

const ALPHA = 0.1;
const MAXITERATIONS = 200;
const STEP_SIZE = 0.1;
const TOL = 0.000001;


let objectiveFunc1 = function(a, b) {
  return Math.pow(a,2) + Math.pow(b,2);
}

let theta = math.matrix([1, 1]);

theta = gradientDescentMulti(objectiveFunc1, theta,ALPHA,MAXITERATIONS)
console.log(theta);
function gradientDescentMulti(objectiveFunc1, theta, ALPHA, MAXITERATIONS) {
  let dsda, dsdb;
  let gradient = math.matrix([1,1]);
  let i = 0;
  while (math.norm(gradient, 2) > TOL && i < MAXITERATIONS) {
    // Gradient Calculation
    dsda = centralDifference(objectiveFunc1, theta, 0);
    dsdb = centralDifference(objectiveFunc1, theta, 1);
    gradient = math.matrix([dsda, dsdb]);
    // let gradient = math.multiply(theta, 2);


    theta = math.evaluate('theta - ALPHA * gradient', {
      theta,
      ALPHA,
      gradient,
    });
    i++;
    // console.log(theta);
  }
  console.log(`Optimization is finished after ${i} steps`);
  return theta;
}

function centralDifference(objectiveFunc, theta, index){
  let aF, bF, aB, bB;
  let forwardValues = [...theta._data];
  forwardValues[index] += STEP_SIZE;
  [aF, bF] = forwardValues;
  let backvardValues = [...theta._data];
  backvardValues[index] -= STEP_SIZE;
  [aB, bB] = backvardValues;
  return (objectiveFunc(aF, bF) - objectiveFunc(aB, bB))/(2*STEP_SIZE)
}
