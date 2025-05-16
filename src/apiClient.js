/*
 * Contains all functions for api requests to the server.
 */
// const baseURL = 'http://localhost:3005';  
const baseURL = '/api'

// Basic logger
function log(setLog, message, type = 'INFO', category = 'Camera') {
  setLog(prev => [
    {
      date: new Date(),
      message,
      category,
      type,
    },
    ...prev,
  ]);
}

// Creates a POST request.
export function buildPostPayload(data) {
  return {
    method: 'POST',
    body: JSON.stringify(data),
    cache: 'no-cache',
    headers: new Headers({
      'content-type': 'application/json',
    }),
  };
}

// export makes this available for import from other files, e.g. App.js
// async makes it so we can use "await" inside. It also makes it return a Promise.
export async function getTemperature(setLog) {
  // if we got this page from localhost:3001, this will request localhost:3001/temperature
  // await is kind of like a dotted line where the interpreter snips the function in two.
  // Everything that would execute after the await keyword is shelved until the network
  // request completes.
  log(setLog, 'Req getTemp', 'INFO', 'Camera');
  // const response = await fetch(`${baseURL}/getTemperature`);
  // The same applies here - we make another dotted line between trying to read the response
  // body as JSON and the remainder of the function
  // const data = await response.json();

  let data;

  try {
    const response = await fetch(`${baseURL}/getTemperature`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    data = await response.json();
    log(setLog, `Res getTemp: ${data.temperature}°C`, 'INFO', 'Camera');
  } catch (error) {
    log(setLog, 'Could not get temperature', 'ERROR', 'Camera');
  }

  // Remember that async makes this return a Promise. This return statement "resolves" the
  // promise. If some other part of our code awaits getTemperature(), it will resume after
  // after this return statement.
  return JSON.stringify(data);
  // return await response.json()
}

export async function initialize(setLog) {
  log(setLog, 'Req initialize', 'ACTION', 'System');

  try {
    const response = await fetch(`${baseURL}/initialize`);
    if (response.status !== 200) {
      log(setLog, `Initialization failed: ${response.status}`, 'ERROR', 'Camera');
      return false;
    }

    const data = await response.json();
    log(setLog, 'Res Initialization successful', 'ACTION', 'Camera');
    return JSON.stringify(data);
  } catch (error) {
    log(setLog, `Initialize error: ${error.message}`, 'ERROR', 'Camera');
    return false;
  }
}

export async function shutdown(setLog) {
  log(setLog, 'Req shutdown', 'ACTION', 'Camera');
  try {
    const response = await fetch(`${baseURL}/shutdown`);
    if (!response.ok) {
      log(setLog, `Shutdown failed: HTTP ${response.status}`, 'ERROR', 'Camera');
      return false;
    }

    const data = await response.json();
    log(setLog, 'Res Shutdown successful', 'ACTION', 'Camera');
    return JSON.stringify(data);
  } catch (error) {
    log(setLog, `Shutdown error: ${error.message}`, 'ERROR', 'Camera');
    return false;
  }
}

export async function setTemperature(input, setLog) {
  log(setLog, `Req setTemperature: ${input} °C`, 'ACTION', 'Camera');

  try {
    const response = await fetch(`${baseURL}/setTemperature`, {
      method: 'POST',
      body: JSON.stringify({ temperature: input.toString() }),
      cache: 'no-cache',
      headers: new Headers({
        'content-type': 'application/json',
      }),
    });

    if (!response.ok) {
      log(setLog, `setTemperature failed: HTTP ${response.status}`, 'ERROR', 'Camera');
      return false;
    }

    const data = await response.json();
    log(setLog, 'Res setTemperature: success', 'ACTION', 'Camera');
    return JSON.stringify(data);
  } catch (error) {
    log(setLog, `setTemperature error: ${error.message}`, 'ERROR', 'Camera');
    return false;
  }
}

export async function capture(input, setLog) {
  const parsedInput = JSON.parse(input);
  const { exptime, exptype, imgtype, filtype } = parsedInput;
  log(setLog, `Capture: ${exptime}s ${exptype}, ${imgtype}, ${filtype}`, 'ACTION', 'Camera');
  const response = await fetch(`${baseURL}/capture`, {
    method: 'POST',
    body: JSON.stringify(input),
    cache: 'no-cache',
    headers: new Headers({
      'content-type': 'application/json',
    }),
  });

  const data = await response.json();

  return data;
}

export async function abort() {
  const response = await fetch('/api/abort');
  const data = await response.json();
  return data;
}

export async function setFilter(input) {
  console.log("started")
  const response = await fetch(`${baseURL}/setFilter`, {
    method: 'POST',
    body: JSON.stringify(input),
    cache: 'no-cache',
    headers: new Headers({
      'content-type': 'application/json',
    }),
  });

  const data = await response.json();

  console.log("successful");

  return data;
}

export async function getStatusTEC() {
  const response = await fetch(`${baseURL}/getStatusTEC`);

  const data = await response.json();

  return data;
}

export async function getStatus() {
  const response = await fetch(`${baseURL}/getStatus`);
  const data = await response.json();
  return JSON.stringify(data);
}

export async function getFilterWheel() {
  const response = await fetch(`${baseURL}/getFilterWheel`);
  const data = await response.json();
  return data;
}

export async function setFilterWheel(filter) {
  const payload = buildPostPayload({ filter });
  console.log(payload);
  const response = await fetch(`${baseURL}/setFilterWheel`, payload);
  const data = await response.json();
  return data;
}

export async function homeFilterWheel() {
  const response = await fetch(`${baseURL}/homeFilterWheel`);
  const data = await response.json();
  return data;
}

export async function getWeatherData() {
  const response = await fetch(`${baseURL}/getWeatherData`);
  const data = await response.json();
  console.log(data);
  return data;
}