import Vendor from "../database/models/vendor";
import User from "../database/models/user";

export const approveVendorRequest = async (userId: string) => {
  const vendor = Vendor.findOne({ where: { userId: userId } });
  if (!vendor) {
    return { message: "Vendor Request Not Found", status: 404 };
  } else {
    await Vendor.update({ status: "approved" }, { where: { userId: userId } });
    await User.update({ role: "vendor" }, { where: { userId: userId } });

    return { message: "Vendor Request Approved", status: 200 };
  }
};

export const rejectVendorRequest = async (userId: string) => {
  const vendor = Vendor.findOne({ where: { userId: userId } });
  if (!vendor) {
    return { message: "Vendor Request Not Found", status: 404 };
  } else {
    await Vendor.update({ status: "rejected" }, { where: { userId: userId } });
    await User.update({ role: "buyer" }, { where: { userId: userId } });

    return { message: "Vendor Request Rejected", status: 200 };
  }
};
