import Vendor from "../database/models/vendor";

export const saveVendor = async (data: any) => {
  const { userId, storeName, address, TIN, bankAccount, paymentDetails } = data;

  const insertVendor = await Vendor.create({
    userId: userId,
    storeName: storeName,
    address: address,
    TIN: TIN,
    bankAccount: bankAccount,
    paymentDetails,
  });

  return insertVendor;
};

export const deleteVendorById = async (vendorId: any) => {
  const vendor = await Vendor.findByPk(vendorId);
  if (!vendor) {
    throw new Error("Vendor not found");
  }
  await vendor.destroy();
};

export const updateVendor = async (vendor: any) => {
  try {
    await vendor.save();
    return vendor;
  } catch (error) {
    throw new Error("Error updating vendor");
  }
};
