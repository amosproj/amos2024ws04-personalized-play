import { onCall, onRequest } from 'firebase-functions/https';

/**
 * HTTP Function: helloWorldHTTP
 *
 * This function responds to standard HTTP requests.
 * - It is defined using `onRequest`, which allows it to handle any HTTP method
 *   (GET, POST, etc.).
 * - Useful for creating RESTful APIs where clients can directly send requests
 *   and receive responses.
 *
 * Usage:
 * - The function can be accessed via a URL after deployment.
 * - Example of a GET request using fetch in the frontend:
 *
 *   fetch('https://<YOUR_PROJECT_ID>.cloudfunctions.net/helloWorldHTTP')
 *     .then(response => response.text())
 *     .then(data => console.log(data)); // Logs: "Hello World!"
 *
 * Note: Suitable for applications that need to interact with various HTTP methods
 *       or require direct access to a URL.
 */
const helloWorldHTTP = onRequest(async (_req, res) => {
  res.status(200).send('Hello World!');
});

/**
 * Callable Function: helloWorld
 *
 * This function is designed for use with Firebase's callable function mechanism.
 * - It is defined using `onCall`, which allows you to invoke it directly from
 *   the client-side SDK.
 * - Provides a simple way to pass data to the function and receive structured
 *   responses without dealing with HTTP requests directly.
 *
 * Usage:
 * - Call the function from the frontend using Firebase SDK:
 *
 *   import { getFunctions, httpsCallable } from "firebase/functions";
 *
 *   const functions = getFunctions();
 *   const callHelloWorld = httpsCallable(functions, 'helloWorld');
 *   callHelloWorld().then((result) => {
 *     console.log(result.data.message); // Logs: "Hello World!"
 *   });
 *
 * Note: Ideal for cases where you need to interact with Firebase services, handle
 *       authentication seamlessly, or manage data more easily.
 */
const helloWorld = onCall(async (_request) => {
  return { message: 'Hello World!' };
});

export { helloWorldHTTP, helloWorld };
