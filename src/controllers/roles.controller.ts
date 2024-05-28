import { Request, Response } from "express";

import {
  approveVendorRequest,
  rejectVendorRequest,
} from "../services/rolesService";
// Approve Vendor's Request and Change Role
export const approveVendor = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const result = await approveVendorRequest(userId);
    res.status(result.status).json({ message: result.message });
  } catch (error:any) {
    res.status(500).json({ message: "Internal Server Error", error:error.message });
  }
};

// Reject Vendor's Request
export const rejectVendor = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const result = await rejectVendorRequest(userId);
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};
