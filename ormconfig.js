module.exports = {
    type: 'postgres',
    host: 'ruby.db.elephantsql.com',
    port: 5432,
    username: 'ozpgrccu',
    password: '6Lxq629JgUhdJmxtN9PyrJzO1aoWflBw',
    database: 'ozpgrccu',
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/migrations/*.js'],
    cli: {
      migrationsDir: 'src/migrations',
    },
}