// Detect if we are running a 'build' or 'generate' command
const isBuildingOrGenerating = process.argv.some(arg =>
  ['build', 'generate'].includes(arg)
);

export default isBuildingOrGenerating;