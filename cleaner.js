const fs = require('fs');
const path = require('path');

/**
 * deletes a file or a directory but recursively
 * 
 * @param {fs.PathLike} filePath the file path
 */
function deleteRecursively(filePath) {
    if (!fs.existsSync(filePath))
        return;

    // if the path is a file just delete
    if (fs.lstatSync(filePath).isFile())
        return fs.unlinkSync(filePath);

    // otherwise read the dir
    const files = fs.readdirSync(filePath);
    // and tries to delete recursively
    for (const file of files) {
        const currentPath = path.join(filePath, file);
        
        if (fs.lstatSync(currentPath).isDirectory())
            deleteRecursively(currentPath);
        else
            fs.unlinkSync(currentPath);
    }
    
    fs.rmdirSync(filePath);
}

deleteRecursively('./dist');
setTimeout(() => {}, 1_000);