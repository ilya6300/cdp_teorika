export const isValidDeviceType = (value) => {
  if (value === null || value === undefined) {
    return false;
  }
  return String(value).trim() !== "";
};

export const getDeviceInfo = () => {
  const userAgent = navigator.userAgent;
  if (!userAgent || String(userAgent).trim() === "") {
    return { device_type: "", description: "" };
  }

  const isMobile =
    /mobile|iphone|ipad|android|blackberry|iemobile|opera mini/i.test(
      userAgent.toLowerCase(),
    );

  return {
    device_type: isMobile ? "Mobile" : "PC",
    description: userAgent,
  };
};
