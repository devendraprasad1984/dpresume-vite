import React from "react";
import ItemsEMIsMarketPlace from "../components/itemsEMIsMarketPlace";

export default function ({data, ssr_title}) {
  return (
      <ItemsEMIsMarketPlace/>
  );
}
//
// export async function getStaticProps() {
//   const data = await getFromApiAsync(config.endpoints.home);
//   return {
//     revalidate: config.revalidateTime,
//     props: {
//       data,
//     },
//   };
// }
