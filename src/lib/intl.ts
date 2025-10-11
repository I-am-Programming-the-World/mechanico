export const nf = new Intl.NumberFormat('fa-IR')
export const cf = new Intl.NumberFormat('fa-IR', { style: 'currency', currency: 'IRR', maximumFractionDigits: 0 })

export const formatNumberFa = (n: number) => nf.format(n)
export const formatCurrencyFa = (n: number) => cf.format(n)
