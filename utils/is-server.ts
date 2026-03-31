

/**
 * Check if the code is executed in a server context
 * @returns 
 */
export default function isServer() {
  // process.client is defined in browser and not in server  
  return !process.client 
}