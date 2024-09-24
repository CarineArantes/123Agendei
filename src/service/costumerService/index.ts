import * as SQLite from 'expo-sqlite';

export class CostumerService {

    async createCostumerService() {
        const db = await SQLite.openDatabaseAsync('databaseName');
        
    }

}