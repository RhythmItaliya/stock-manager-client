import { faker } from '@faker-js/faker'

export const users = Array.from({ length: 20 }, () => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  return {
    id: faker.string.uuid(),
    username: faker.internet.username({ firstName }).toLocaleLowerCase(),
    createdBy: faker.internet.username({ lastName }).toLocaleLowerCase(),
    email: faker.internet.email({ firstName }).toLocaleLowerCase(),
    status: faker.helpers.arrayElement(['active', 'inactive', 'suspended']),
    role: faker.helpers.arrayElement([
      'super-admin',
      'sub-admin',
      'manager',
      'user',
    ]),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }
})
