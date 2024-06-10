import Product from "../database/models/product";
import Vendor from "../database/models/vendor";

export const checkVendorModifyPermission = async (
  tokenData: any,
  vendorId: number
) => {
  if (tokenData.role !== "vendor") {
    return {
      allowed: false,
      message: "You are not allowed to perfom this action",
      status: 403,
    };
  }
  const vendorExist = await Vendor.findByPk(vendorId);
  if (!vendorExist) {
    return {
      allowed: false,
      message: "You are not allowed to perfom this action ",
      status: 403,
    };
  }
  const vendorProduct = await Product.findOne({ where: { vendorId } });
  if (!vendorProduct) {
    return {
      allowed: false,
      message: "You are not allowed to perfom this action ",
      status: 403,
    };
  }

  return { allowed: true };
};

export const checkVendorPermission = async (
  tokenData: any,
  vendorId: string
) => {
  if (tokenData.role !== "vendor") {
    return {
      allowed: false,
      message: "You are not allowed to perfom this action",
      status: 403,
    };
  }
  const checkVendor = await Vendor.findByPk(vendorId);
  if (!checkVendor) {
    return {
      allowed: false,
      message: "You are not allowed to perfom this action",
      status: 403,
    };
  }
  return { allowed: true };
};
