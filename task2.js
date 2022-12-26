import csv from 'csvtojson';
import fs from 'fs';
import { pipeline } from 'stream';

const CSV_File_Path = './table.csv';
const TXT_File_Path = './table.txt';

pipeline(
    fs.createReadStream(CSV_File_Path),
    csv(),
    fs.createWriteStream(TXT_File_Path),
    (err) => {
        if (err) {
            console.error('Failed', err);
        } else {
            console.log('Succeeded');
        }
    }
);
