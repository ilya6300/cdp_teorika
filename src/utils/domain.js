export const normalizeDomainHost = (hostname) => {
  return hostname.toLowerCase().replace(/^www\./, "");
};

export const getCollectorHeaders = () => ({
  "Content-Type": "application/json",
});
