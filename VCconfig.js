const Config = {
    dbUrl: `${process.env.DBURL}`,
    dbName: `${process.env.DBNAME}`,
    serviceURL: `${process.env.SERVICEURL||"http://localhost"}`,
    servicePort: `${process.env.PORT||80}`,
    truePort: '',
}
module.exports = Config;