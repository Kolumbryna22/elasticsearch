const faker = require('faker');
let users = [];

class User {
  constructor (data) {
    this.id = data?.id || 'new';
    this.firstName = data?.firstName || '';
    this.lastName = data?.lastName || '';
    this.jobTitle = data?.jobTitle || '';
  }
}

for (let id = 1; id <= 1000; id++) {
  users.push(new User({
    id,
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    jobTitle: faker.name.jobTitle()
  }))
}

module.exports = users;
