

/**
 * Check if the code is executed in a server context
 * @returns 
 */
export default function isProduction() {
    // process.client is defined in browser and not in server  
    return process.env.NODE_ENV === 'production' 
  }