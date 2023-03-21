import path from 'path';

const mainFolder = require.main as NodeJS.Module

export default path.dirname(mainFolder.filename);