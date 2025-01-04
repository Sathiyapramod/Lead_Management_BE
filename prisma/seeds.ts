import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as timezone from '../src/utils/timezone.json';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  /* ---------------- Managers --------------- */

  console.log(`Seeding Managers !!`);
  const initial = await prisma.managers.create({
    data: {
      mgr_name: faker.person.firstName(),
      role: 'manager',
      phone: process.env.TWILIO_PHONE_NUMBER,
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
        lead_status: i % 2 === 0 ? false : true,
        phone: faker.phone.number({ style: 'international' }),
        orders_placed: 0,
        orders_done: 0,
        call_freq: i % 2 === 0 ? 'weekly' : 'daily',
        last_call_date: faker.date.between({
          from: '2024-12-01',
          to: Date.now(),
        }),
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

  /*---------------- Orders --------------- */
  console.log(`Seeding Orders !!`);
  const ordersPerLead = 30;
  for (const lead of leads) {
    for (let j = 0; j < ordersPerLead; j++) {
      const placed_on = faker.date.between({
        from: '2024-01-01',
        to: Date.now(),
      });

      let closed_on = null,
        isApproved = false,
        approved_on = null;

      if (j % 3 === 0) {
        closed_on = new Date(placed_on);
        approved_on = new Date(placed_on);
        closed_on.setDate(closed_on.getDate() + 3);
        approved_on.setDate(closed_on.getDate() + 4);
        isApproved = true;
      } else if (j % 7 === 0) {
        closed_on = new Date(placed_on);
        approved_on = new Date(placed_on);
        closed_on.setDate(closed_on.getDate() + 7);
        approved_on.setDate(closed_on.getDate() + 8);
        isApproved = true;
      } else if (j % 4 === 0) {
        closed_on = new Date(placed_on);
        approved_on = new Date(placed_on);
        closed_on.setDate(closed_on.getDate() + 14);
        approved_on.setDate(closed_on.getDate() + 15);
        isApproved = true;
      }

      await prisma.orders.create({
        data: {
          lead_id: lead,
          order_value: faker.number.int({ min: 100000, max: 500000 }),
          placed_on,
          closed_on,
          approved_on,
          isCreated: true,
          isApproved,
        },
      });
      await prisma.leads.update({
        where: { id: lead },
        data: {
          orders_placed: {
            increment: 1,
          },
        },
      });
    }
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
    console.log(`Seeding Completed ✅`);
  })
  .catch((err) => {
    console.log(`🚧 Error 🛑`, err);
    prisma.$disconnect();
  })
  .finally(() => prisma.$disconnect());
