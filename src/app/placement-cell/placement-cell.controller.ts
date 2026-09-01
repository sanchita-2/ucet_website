import type { Request, Response, NextFunction } from "express";
import { placementCellService } from "./placement-cell.service.js";

export class PlacementCellController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await placementCellService.create(req.body);
      res.status(201).json({
        success: true,
        message: "Placement cell created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { branchId, academicYearId, coordinatorId, isActive, page, limit } =
        req.query;

      const result = await placementCellService.getAll({
        branchId: typeof branchId === "string" ? branchId : undefined,
        academicYearId:
          typeof academicYearId === "string" ? academicYearId : undefined,
        coordinatorId:
          typeof coordinatorId === "string" ? coordinatorId : undefined,
        isActive:
          isActive === "true" ? true : isActive === "false" ? false : undefined,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
      });

      res.status(200).json({
        success: true,
        message: "Placement cells retrieved successfully",
        data: result.items,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const result = await placementCellService.getById(id);
      res.status(200).json({
        success: true,
        message: "Placement cell retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const result = await placementCellService.update(id, req.body);
      res.status(200).json({
        success: true,
        message: "Placement cell updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async toggleStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = req.params.id as string;
      const result = await placementCellService.toggleStatus(id);
      res.status(200).json({
        success: true,
        message: `Placement cell is now ${result.isActive ? "active" : "inactive"}`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      await placementCellService.delete(id);
      res.status(200).json({
        success: true,
        message: "Placement cell deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const placementCellController =
  new PlacementCellController();