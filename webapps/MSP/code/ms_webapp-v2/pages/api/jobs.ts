import { faker } from "@faker-js/faker";
import range from "lodash/range";
import includes from "lodash/includes";
import type { NextApiRequest, NextApiResponse } from "next";

import { Job } from "../../@types/Job";

const seedData: Job[] = range(1, 1000).map((i) => ({
  id: i,
  title: faker.name.jobTitle(),
  employmentType: faker.random.arrayElement([
    "part-time",
    "full-time",
    "contract",
  ]),
  location: `${faker.address.cityName()}, ${faker.address.state()}`,
  companyName: faker.company.companyName(),
  publishedOn: faker.date.past().toISOString(),
  viewCount: faker.datatype.number({ min: 5, max: 200 }),
  appliedCount: faker.datatype.number({ min: 5, max: 200 }),
  status: faker.random.arrayElement(["published", "unpublished", "archived"]),
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
      data: data,
      totalCount: count,
      currentPage: page,
      lastPage: Math.ceil(count / perPage),
    },
  });
};
