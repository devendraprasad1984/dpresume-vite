import { capitalize, range, includes } from "lodash";
import { faker } from "@faker-js/faker";
import type { NextApiRequest, NextApiResponse } from "next";

import { Topic } from "../../@types/Topic";

const seedData: Topic[] = range(1, 1000).map((i) => ({
  id: i,
  name: capitalize(faker.company.bs()),
  privacy: faker.random.arrayElement(["public", "private"]),
  createdOn: faker.date.past().toISOString(),
  expireOn: faker.date.past().toISOString(),
  company: faker.company.companyName(),
  memberCount: faker.datatype.number({ min: 5, max: 200 }),
  status: faker.random.arrayElement(["active", "archived", "expired"]),
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
    data = data.filter((item) => includes(item.name, q));
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
