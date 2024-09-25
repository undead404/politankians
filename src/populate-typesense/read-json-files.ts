import fs from 'fs-extra';
import path from 'path';

// Generator function to yield JSON data from files in a directory
export default async function* readJSONFiles(directory: string) {
  const files = await fs.readdir(directory);
  const jsonFiles = files.filter((file) => path.extname(file) === '.json');

  for (const file of jsonFiles) {
    const filePath = path.join(directory, file);
    const jsonData = await fs.readJson(filePath);
    yield { fileName: file, data: jsonData };
  }
}
