import river from '../src/index'
import {each} from 'lodash'

// Log the errors
const log = console.log;

// Demo function to execute asynchronously
const asyncFunction = (data, callback) => {
    const err = Math.floor((Math.random() * 10) + 1) === 1; // random between 1 and 10. If 1, error is true

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

// Execute the river
river(functionsRiver, (status, results, errors) => {
    if (status === false) {
        return log('Error encountered: ', errors);
    }

    // Close the job
    log('Successful execution: ', results);
});
