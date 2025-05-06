// JavaScript does one thing at a time which makes writing it make sense. You call a function, you open a stack frame, the function finishes running, the stack frame closes and it picks up where it left off in the previous stack frame, in order, no BS. This is the Call Stack which follows a LIFO structure (last in first out) it makes sense and creates a reational world of order and peace. 

// All this gets bat shit crazy when you start doing async stuff and setTimeouts / setIntervals etc that's all time-dependent because internet / JavaScript has to be able to do literally everything. Network calls take unpredictable amounts of time, also file system interactions because JavaScript has to not just be for browsers (node). So now you call a function, it starts running, but then it calls another function that takes 50-50,000ms to finish. So the first function can't finish until the second one does. 

// So then the Event Loop becomes a thing we need which keeps track of all the functions that are waiting to run. If / when the callstack is empty the Event Loop checks to see if any idle callbacks are ready to run based on something like a setTimeout or a resolved Promise. Because of the single-threadedness these still have to have an order, so they form a queue based on the order they've resolved in. So that order is tracked and managed by the Task Queue following a FIFO structure (first in first out). 

// So we have both LIFO behavior in the Call Stack and FIFO behavior in the Task Queue and the Event Loop mediating between the two, isn't that great and super simple to keep track of? (not really) And all of this doesn't have anything directly to do with the Heap and the Stack which is a whole other much less confusing topic that is not just an insane JavaScript thing and is not something that you have to worry about in JS because it automatically manages and garbage collects heap memory for you.

// So we want time-dependent behavior that doesn't block all our normal JS code that makes our cool website work. We define a function that will run when some network request that we initiated in our code resolves and get it into the Task Queue. It waits until the Call Stack is empty (maybe from the last resolved network request) and then the Event Loop picks it up and runs it. We can manage this with callbacks, but that leads to callback hell which is a nightmare. So we have Promises which are just a less-ugly / less headache-inducing way to do the same thing.

// In short this is all the internet's fault (imho). JavaScript had to accomodate the insane messiness that is millions of computers being connected to eachother passing network requests around that constantly had to be able to fail or take 120+ seconds to resolve. Internet crazy, JavaScript crazy, JavaScript developers crazy. 

// With all that said it's insane and awesome that any of this works and is basically easy to write code for. Stringing .thens is way nicer than nesting callbacks and async / await is super intuitive / simple to use unless you make the mistake of thinking about it. Cool stuff, here're some random mini-examples. Work in progress. 

// Rando Examples ----------------------------------------------------------------

// Sequential Execution (Promises)
fetchData()
    .then(data => processData(data))
    .then(processedData => displayData(processedData))
    .catch(error => console.error(error));

// Parallel Execution (Promises)
Promise.all([fetchData(), fetchUserProfile()])
    .then(([data, userProfile]) => {
    // Both fetches happen simultaneously, and we process them together.
        return processData(data, userProfile);
    })
    .then(processedData => displayData(processedData))
    .catch(error => console.error(error));

// Sequential Execution
const fetchDataAndProcess = async () => {
    try {
        const data = await fetchData();
        const processedData = await processData(data);
        displayData(processedData);
    } catch (error) {
        console.error(error);  
    }
}
  
// Parallel Execution 
const fetchDataAndProfile = async () => {
    try {
        const [data, userProfile] = await Promise.all([fetchData(), fetchUserProfile()]);
        const processedData = await processData(data, userProfile);
        displayData(processedData);
    } catch (error) {
        console.error(error);
    }
}

// But what (the hell) is callback hell? ----------------------------------------------------------------

// Pretend we're fetching data
const fetchData = (callback) => {
    setTimeout(() => {
      console.log("Data fetched");
      callback(null, { id: 1, name: "John" }); // Pass data to the next step
    }, 1000);
  }
  
// Pretend we're processing something
const processData = (data, callback) => {
    setTimeout(() => {
        console.log("Data processed:", data);
        callback(null, { ...data, status: "processed" });
    }, 1000);
}
  
// Pretend we're saving
const saveData = (data, callback) => {
    setTimeout(() => {
        console.log("Data saved:", data);
        callback(null, "Success!");
    }, 1000);
}

// Callback Hell (deeply nested cbs)
fetchData((err, data) => {
    if (err) {
        console.error("Error fetching data:", err);
    } else {
        processData(data, (err, processedData) => {
        if (err) {
            console.error("Error processing data:", err);
        } else {
            saveData(processedData, (err, result) => {
            if (err) {
                console.error("Error saving data:", err);
            } else {
                console.log(result);
            }
            });
        }
        });
    }
});

// The Same Thing 3 Ways --------------------------------------------------------

// Callbacks
const fetchData2 = (callback) => {
    setTimeout(() => {
        console.log("Fetched data");
        callback(null, { id: 1, name: "Alice" });
    }, 1000);
};

const processData2 = (data, callback) => {
    setTimeout(() => {
        console.log("Processed data");
        callback(null, { ...data, processed: true });
    }, 1000);
};

const saveData2 = (data, callback) => {
    setTimeout(() => {
        console.log("Saved data");
        callback(null, "Success");
    }, 1000);
};

fetchData2((err, data) => {
    if (err) return console.error(err);
    processData2(data, (err, processed) => {
        if (err) return console.error(err);
        saveData2(processed, (err, result) => {
            if (err) return console.error(err);
            console.log(result);
        });
    });
});


// Promises
const fetchData3 = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Fetched data");
            resolve({ id: 1, name: "Alice" });
        }, 1000);
    });
};

const processData3 = (data) => {
    return new Promise((resolve) => {
    setTimeout(() => {
        console.log("Processed data");
        resolve({ ...data, processed: true });
    }, 1000);
    });
};

const saveData3 = (data) => {
    return new Promise((resolve) => {
    setTimeout(() => {
        console.log("Saved data");
        resolve("Success");
    }, 1000);
    });
};

fetchData3()
    .then(processData3)
    .then(saveData3)
    .then(console.log)
    .catch(console.error);


// Async / Await
const fetchData4 = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
        console.log("Fetched data");
        resolve({ id: 1, name: "Alice" });
        }, 1000);
    });
};

const processData4 = (data) => {
    return new Promise((resolve) => {
        setTimeout(() => {
        console.log("Processed data");
        resolve({ ...data, processed: true });
        }, 1000);
    });
};

const saveData4 = (data) => {
    return new Promise((resolve) => {
        setTimeout(() => {
        console.log("Saved data");
        resolve("Success");
        }, 1000);
    });
};

// Using async/await
const handleData = async () => {
    try {
        const data = await fetchData4();
        const processed = await processData4(data);
        const result = await saveData4(processed);
        console.log(result);
    } catch (err) {
        console.error(err);
    }
};

handleData();
  