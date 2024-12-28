import { faker } from "@faker-js/faker";
import range from "lodash/range";
import includes from "lodash/includes";
import type { NextApiRequest, NextApiResponse } from "next";

import { Session } from "../../@types/Session";

const seedData: Session[] = range(1, 1000).map((i) => ({
  id: i,
  creator: faker.name.findName(),
  title: faker.lorem.sentence(),
  date: faker.date.past().toISOString(),
  topic: faker.lorem.sentence(),
  companyName: faker.company.companyName(),
  attendeeCount: faker.datatype.number({ min: 5, max: 200 }),
  status: faker.random.arrayElement(["upcoming", "ongoing", "past"]),
}));

export default (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;
  const { q } = query;
  let { perPage = 50, page = 1 } = query;
  let data = seedData;

  perPage = +perPage;
  page = +page;

  // Filter
  if (q) {
    data = data.filter((item) => includes(item.title, q));
  }

  // Store count
  const count = data.length;

  // Paginate
  data = data.slice((page - 1) * perPage, page * perPage);

  res.status(200).json({
    result: {
      data,
      totalCount: count,
      currentPage: page,
      lastPage: Math.ceil(count / perPage),
    },
  });
};
