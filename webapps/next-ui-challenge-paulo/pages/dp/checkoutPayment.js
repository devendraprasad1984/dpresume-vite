import React from "react";
import Payments from "../../components/payment";

const CheckoutPayment = (props) => {
  return (
    <>
      <Payments/>
    </>
  );
};
//
// export async function getStaticProps(context) {
//   const { req, res } = context;
//   const data = await getFromApiAsync(config.endpoints.checkout);
//   return {
//     props: {
//       data,
//     },
//   };
// }

export default CheckoutPayment;
