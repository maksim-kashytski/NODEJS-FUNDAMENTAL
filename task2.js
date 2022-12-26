import csv from 'csvtojson';
import fs from 'fs';
import { pipeline } from 'stream';

const CSV_File_Path = './table.csv';
const TXT_File_Path = './table.txt';

const readStream = fs.createReadStream(CSV_File_Path);
const writeStream = fs.createWriteStream(TXT_File_Path);

const errorHandler = (err) => {
    if (err) {
        console.error('Failed', err);
    } else {
        console.log('Succeeded');
    }
};

pipeline(readStream, csv(), writeStream, errorHandler);
