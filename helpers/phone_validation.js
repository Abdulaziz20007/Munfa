const validatePhone = (phone) => {
  if (!phone) {
    return {
      isValid: false,
      message: "Telefon raqam kiritilishi kerak",
    };
  }

  if (!phone.match(/^\d{9}$/)) {
    return {
      isValid: false,
      message: "Telefon raqam 9 xonali bo'lishi kerak",
    };
  }

  const operators = [
    "90",
    "91",
    "93",
    "94",
    "95",
    "97",
    "98",
    "99",
    "33",
    "20",
    "50",
    "77",
    "88",
  ];

  if (!operators.includes(phone.slice(0, 2))) {
    return {
      isValid: false,
      message: "Telefon raqam operatori noto'g'ri",
    };
  }

  return {
    isValid: true,
  };
};

module.exports = { validatePhone };
