import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as timezone from '../src/utils/timezone.json';

const prisma = new PrismaClient();

async function main() {
  /* ---------------- Managers --------------- */

  console.log(`Seeding Managers !!`);
  const initial = await prisma.managers.create({
    data: {
      mgr_name: faker.person.firstName(),
      role: 'manager',
      phone: faker.phone.number({ style: 'international' }),
    },
  });

  const { id } = initial;
  /* ---------------- Leads --------------- */
  console.log(`Seeding Leads !!`);
  const leadCount = 50;
  const leads = [];
  for (let i = 0; i < leadCount; i++) {
    const newLead = await prisma.leads.create({
      data: {
        lead_name: faker.person.fullName(),
        rest_name: faker.company.name(),
        rest_addr1: faker.location.streetAddress(),
        rest_addr2: faker.location.secondaryAddress(),
        mgr_id: id,
        lead_status: false,
        phone: faker.phone.number({ style: 'international' }),
        orders_placed: faker.number.int({ min: 0, max: 10 }),
        orders_done: faker.number.int({ min: 0, max: 10 }),
        call_freq: i % 2 === 0 ? 'weekly' : 'daily',
      },
    });
    leads.push(newLead['id']);
  }
  /* ---------------- Contacts --------------- */

  console.log(`Seeding Contacts !!`);
  const contactPerLead = 3;
  for (const lead of leads) {
    for (let j = 0; j < contactPerLead; j++)
      await prisma.contacts.create({
        data: {
          lead_id: lead,
          cnct_name: faker.person.fullName(),
          cnct_role: 'procurement',
          cnct_info: faker.lorem.sentence(),
          phone: faker.phone.number({ style: 'international' }),
        },
      });
  }

  /*---------------- Time Zones --------------- */
  console.log(`Seeding Timezones !!`);
  for (const [key, value] of Object.entries(timezone))
    await prisma.timeZones.create({
      data: {
        timezone: key,
        time_diff: value,
      },
    });
}

main()
  .then(() => {
    console.log(`Seeding Completed`);
  })
  .catch(() => {
    prisma.$disconnect();
  })
  .finally(() => prisma.$disconnect());
