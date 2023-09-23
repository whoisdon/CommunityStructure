import { MySQLDriver, QuickDB } from 'quick.db';

const mysqlDriver = new MySQLDriver({
   host: "",
   user: "",
   password: "",
   database: "",
});

const connectToMySQL = async () => {
    await mysqlDriver.connect();
    const mysql = new QuickDB({ driver: mysqlDriver });

    return mysql;
}

export default connectToMySQL();
