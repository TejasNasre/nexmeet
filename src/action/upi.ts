function UPI(amount, merchant_upi, merchant_name, size) {
  if (amount.map) {
    return amount.map(function (amount2) {
      return UPI(amount2, merchant_upi, merchant_name, size);
    });
  }

  const googleChart = `https://chart.googleapis.com/chart?cht=qr&choe=UTF-8`;
  const upiData = `upi://pay?pn=${merchant_name}&pa=${merchant_upi}&am=${amount}`;
  return `${googleChart}&chs=${size}x${size}&chl=${encodeURIComponent(upiData)}`;
}

export default UPI;
