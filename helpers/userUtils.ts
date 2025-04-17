import * as fs from 'fs';
import * as path from 'path';
import { UserData } from '../types/user';

export const getRandomUser = async (): Promise<UserData> => {
    // Wait for 3 seconds
    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await wait(3000);
    
    const userDataPath = path.join(process.cwd(), 'data', 'userData.json');
    const registeredUsers = JSON.parse(fs.readFileSync(userDataPath, 'utf8')).registeredUsers;
    const randomIndex = Math.floor(Math.random() * registeredUsers.length);
    console.log(`Selecting user at index ${randomIndex} from ${registeredUsers.length} users`);
    return registeredUsers[randomIndex];
};