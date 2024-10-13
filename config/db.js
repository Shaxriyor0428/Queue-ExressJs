import psql from "pg"; 
const { Pool } = psql; 

import config from "config";

const pool = new Pool({
  user: config.get("db_username"),
  password: config.get("db_password"),
  database: config.get("db_name"),
  host: config.get("db_host"),
  port: config.get("db_port"),
});

export default pool;
