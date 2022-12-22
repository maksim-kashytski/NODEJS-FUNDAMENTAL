import { writeFile } from 'node:fs/promises';
import { appendFile } from 'node:fs';
import csv from 'csvtojson';

const CSV_File_Path = './table.csv';
const TXT_File_Path = './table.txt';

const errorHandler = (e) => {
    if (e) console.error(e.message);
};

const transpliteCSVtoTXT = async () => {
    await writeFile(TXT_File_Path, '')
        .catch(errorHandler)
        .finally(() => console.log('The text file is prepared for writing'));

    csv({ output: 'line' })
            .fromFile(CSV_File_Path)
            .subscribe(
                (csvLine) => appendFile(TXT_File_Path, csvLine + '\n', errorHandler),
                errorHandler,
                () => console.log('Successful')
            );
};

transpliteCSVtoTXT();
