import fs from 'fs';
import path from 'path';
import authUser from "../data/authUser.json";
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import { js2xml } from 'xml-js';
import csv from 'csv-parser';
import { Parser } from 'xml2js';

export const getAuthToken = async ({ request }, baseURL: string) => {
    const response = await request.post(`${baseURL}/auth`, {
        headers: {
            'Content-Type': 'application/json'
        },
        data: authUser
    });
    const responseJson = await response.json();
    console.log(responseJson.token);
    return responseJson.token;
};

export const writeResponseToFile = (responseJson: any) => {
    const dataFolderPath = path.join(__dirname, '..', 'data');
    const responseFilePath = path.join(dataFolderPath, 'response.json');
    fs.writeFileSync(responseFilePath, JSON.stringify(responseJson, null, 2));
};

export const getRandomBookingId = () => {
    const responseFilePath = path.join(__dirname, '..', 'data', 'response.json');
    const responseJson = JSON.parse(fs.readFileSync(responseFilePath, 'utf-8'));
    const randomIndex = Math.floor(Math.random() * responseJson.length);
    return responseJson[randomIndex].bookingid;
};
export const readXmlFile = async (filePath: string) => {
    const xmlData = fs.readFileSync(path.join(__dirname, filePath), 'utf8');
    const parser = new Parser();
    // const parser = new xml2js.Parser();
    const jsonData = await parser.parseStringPromise(xmlData);
    return jsonData;
};

export const jsonToXml = (jsonObj: any) => {
    const options = { compact: true, ignoreComment: false, spaces: 4 };
    const xml = js2xml(jsonObj, options);
    return xml;
};

export const writeCsvFile = async (data: any[], filePath: string) => {
    const header = Object.keys(data[0]).map(id => ({ id, title: id }));
    const csvWriter = createCsvWriter({ path: filePath, header });

    await csvWriter.writeRecords(data);
};

export const readCsvFile = (filePath: string) => {
    const data: any[] = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row: any) => data.push(row))
            .on('end', () => resolve(data))
            .on('error', reject);
    });
};