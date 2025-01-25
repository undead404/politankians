const fs = require('fs');
const csv = require('csv-parser');

const inputFile = 'input.csv'; // Replace with your input file path
const outputFile = 'output.csv'; // Replace with your output file path

function splitName(name) {
  let givenName = '';
  let middleName = '';
  const parts = name.split(' ');
  for (let index = 0; index < parts.length; index++) {
    const part = parts[index];
    if (!givenName || part.startsWith('(') || index < parts.length - 1) {
      givenName += ` ${part}`;
    } else {
      middleName = part;
    }
  }
  return [givenName, middleName];
}

async function processCSV() {
  const data = [];

  try {
    await new Promise((resolve, reject) => {
      fs.createReadStream(inputFile)
        .pipe(csv())
        .on('data', (row) => {
          data.push(row);
        })
        .on('end', resolve)
        .on('error', reject);
    });

    const result = [];

    // Modify the data array here as needed
    data.forEach((row, index) => {
      const act = index + 1;
      const date = row['Дата народження'];
      const givenName = row["Ім'я дитини"];
      const surname = row['Прізвище'];
      const origin = row['Звідки батьки'];
      const note = row['Примітка'];
      const father = row['Батько дитини'];
      const mother = row['Мати дитини'];
      result.push({
          Акт: act,
          "Дата події": date,
          "Прізвище": surname,
          "Ім'я": givenName,
          "По батькові": "",
      })
    });

    // Save the modified data to the output CSV file
    const csvString = data
      .map((row) => Object.values(row).join(','))
      .join('\n');
    await fs.promises.writeFile(outputFile, csvString, 'utf8');

    console.log('CSV file processed successfully');
  } catch (error) {
    console.error('Error processing CSV:', error);
  }
}

processCSV();
