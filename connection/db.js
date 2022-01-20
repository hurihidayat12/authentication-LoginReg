//import postgresql pool

const {Pool} = require('pg');

//setting connection database
const dbPool = new Pool({
    database: 'personal_artikel_b30',
    port: 5432,
    user: 'admin',
    password: 'admin12'
});

module.exports = dbPool;