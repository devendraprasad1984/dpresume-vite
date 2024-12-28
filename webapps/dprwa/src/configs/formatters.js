const currencyBase = {
  INR: { locale: "en-IN", currency: "INR" },
  US: { locale: "en-US", currency: "USD" },
  EUR: { locale: "en-EU", currency: "EUR" },
};

// return num.toLocaleString('en-EU',{
//   style: 'currency',
//   currency: 'EUR'
// })

const formatter = (locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  });
};

export const formatCurrency = (num) => {
  let base = "INR";
  const { locale, currency } = currencyBase[base];
  return formatter(locale, currency).format(Math.abs(num));
};
