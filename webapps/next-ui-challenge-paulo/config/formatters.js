export const euroCurrencyFormatter = (num) => {
  let formatter = new Intl.NumberFormat('en-EU',{
    style: 'currency',
    currency: 'EUR'
  })
  return formatter.format(num)
  // return num.toLocaleString('en-EU',{
  //   style: 'currency',
  //   currency: 'EUR'
  // })
}

export const usdCurrencyFormatter = (num) => {
  let formatter = new Intl.NumberFormat('en-US',{
    style: 'currency',
    currency: 'USD'
  })
  return formatter.format(num)
}

