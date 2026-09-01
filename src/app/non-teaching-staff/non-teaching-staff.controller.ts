import type { Request, Response, NextFunction } from "express";
import { NonTeachingStaffService } from "./non-teaching-staff.service.js";

const staffService = new NonTeachingStaffService();

export const createStaff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await staffService.createStaff(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getStaffList = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await staffService.getAllStaff();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getStaffDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Fixed: Ensure id is a string and exists
    if (!id || typeof id !== "string") {
      res.status(400).json({ success: false, message: "Valid ID is required" });
      return;
    }

    const result = await staffService.getStaffById(id);
    if (!result) {
      res.status(404).json({ success: false, message: "Staff not found" });
      return;
    }
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const updateStaff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Fixed: Ensure id is a string and exists
    if (!id || typeof id !== "string") {
      res.status(400).json({ success: false, message: "Valid ID is required" });
      return;
    }

    const result = await staffService.updateStaff(id, req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const deleteStaff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Fixed: Ensure id is a string and exists
    if (!id || typeof id !== "string") {
      res.status(400).json({ success: false, message: "Valid ID is required" });
      return;
    }

    await staffService.deleteStaff(id);
    res.status(200).json({ success: true, message: "Staff deleted successfully" });
  } catch (error) {
    next(error);
  }
};