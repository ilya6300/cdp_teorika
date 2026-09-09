import { getDeviceInfo, isValidDeviceType } from "../../utils/device.js";
import { normalizeDomainHost } from "../../utils/domain.js";

export const buildCollectorBody = (overrides = {}) => {
  const { device_type } = getDeviceInfo();

  if (!isValidDeviceType(device_type)) {
    console.error("collector: device_type отсутствует, запрос заблокирован");
    return null;
  }

  return {
    domain_url: normalizeDomainHost(window.location.hostname),
    device_type,
    ...overrides,
  };
};
