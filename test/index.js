import {each} from 'lodash'
import chalk from 'chalk'
import river from '../src/index'

// Log the errors
const log = console.log;

// Demo function to execute asynchronously
const asyncFunction = (data, callback) => {
    const err = Math.floor((Math.random() * 10) + 1) >= 9; // random between 1 and 10. If greater than or equal to 9, error

    log('>>> Running function for: ' + data.name + '. Error: ' + String(err));

    if (err) {
        return callback(err);
    }

    return callback(null, data);
}

// Function to add to the river queue
const addToRiver = (datafn) => {
    return (riverTaskDoneCallback) => {
        asyncFunction(datafn, riverTaskDoneCallback);
    }
}

// Demo records
const records = [
    {
        name: 'Item 1',
        value: 'Value 1'
    }, {
        name: 'Item 2',
        value: 'Value 2'
    }, {
        name: 'Item 3',
        value: 'Value 3'
    }
];

// Go through each of the records and store them in the river array
const functionsRiver = [];

each(records, (item, idx) => {
    functionsRiver.push(addToRiver(item));
});

// Show the build warning
log(chalk.green('>>> Please run "npm run build" to test on the latest development version.'));

// Execute the river
river(functionsRiver, (status, results, errors) => {
    if (status === false) {
        log(chalk.red('>>> Error encountered: '));
        return log(errors);
    }

    // Close the job
    log(chalk.green('>>> Successful execution: '));
    log(results);
});
