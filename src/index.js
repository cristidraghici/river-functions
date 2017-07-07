import chalk from 'chalk'
import {size, each} from 'lodash'

const log = () => {
    console.log(arguments);
}

/**
 * Convert an object to an array
 */
const obj2array = (obj) => {
    var out = [],
        keys = Object.keys(obj),
        i,
        len = keys.length;

    keys.sort();

    for (i = 0; i < len; i++) {
        out.push(obj[keys[i]]);
    }

    return out;
};

const exec = (tasks, callback) => {
    const len = size(tasks);
    let done = 0;
    let status = true;
    let results = {};
    let errors = {};

    const complete = () => {
        done = done + 1;

        if (done === len) {
            callback.call(this, status, obj2array(results), obj2array(errors));
        }
    }

    const yes = (task_id, output) => {
        // Store the output
        results[task_id] = output;
        errors[task_id] = false;

        // Check if all tasks are done
        complete.call(this);
    }

    const no = (task_id, error) => {
        // Store the error
        errors[task_id] = error;
        // Change the status of the whole execution to false
        status = false;

        // Check if all tasks are done
        complete.call(this);
    }

    const defaultCallback = (status, results, errors) => {
        if (size(results) > 0) {
            log(chalk.green('>>> Results (' + size(results) + ') >>> '), results, chalk.green('>>> END of results.'));
        }
        if (size(errors) > 0) {
            log(chalk.red('>>> Errors (' + size(errors) + ') >>> '), results, chalk.red('>>> END of errors.'));
        }
    }

    // Add a callback, if none specified on main function call
    if (!callback) {
        const callback = defaultCallback;
    }

    // Go through each task
    each(tasks, (task, task_id) => {
        task.call(this, (err, data) => {
            if (err) {
                return no.call(this, task_id, err);
            }

            yes.call(this, task_id, data)
        });
    });
}

export default exec
