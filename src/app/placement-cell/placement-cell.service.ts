import { db } from "../../db/index.js";
import { placementCells } from "../../db/schema.js";
import { eq, and, sql, desc, count } from "drizzle-orm";
import type {
  CreatePlacementCellInput,
  UpdatePlacementCellInput,
} from "./placement-cell.validation.js";

export interface ListPlacementCellFilter {
  branchId?: string | undefined;
  academicYearId?: string | undefined;
  coordinatorId?: string | undefined;
  isActive?: boolean | undefined;
  page?: number | undefined;
  limit?: number | undefined;
}

export class PlacementCellService {
  async create(data: CreatePlacementCellInput) {
    const existing = await db.query.placementCells.findFirst({
      where: and(
        eq(placementCells.coordinatorId, data.coordinatorId),
        eq(placementCells.branchId, data.branchId),
        eq(placementCells.academicYearId, data.academicYearId),
      ),
    });

    if (existing) {
      const error: any = new Error(
        "A placement cell with this coordinator, branch, and academic year already exists",
      );
      error.statusCode = 409;
      throw error;
    }

    const [created] = await db
      .insert(placementCells)
      .values({
        coordinatorId: data.coordinatorId,
        branchId: data.branchId,
        academicYearId: data.academicYearId,
        isActive: data.isActive ?? true,
      })
      .returning();

    if (!created) {
      const error: any = new Error(
        "Failed to create placement cell",
      );
      error.statusCode = 500;
      throw error;
    }

    return this.getById(created.id);
  }

  async getAll(filter: ListPlacementCellFilter) {
    const page = filter.page && filter.page > 0 ? filter.page : 1;
    const limit = filter.limit && filter.limit > 0 ? filter.limit : 10;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (filter.branchId) {
      conditions.push(eq(placementCells.branchId, filter.branchId));
    }

    if (filter.academicYearId) {
      conditions.push(eq(placementCells.academicYearId, filter.academicYearId));
    }

    if (filter.coordinatorId) {
      conditions.push(eq(placementCells.coordinatorId, filter.coordinatorId));
    }

    if (filter.isActive !== undefined) {
      conditions.push(eq(placementCells.isActive, filter.isActive));
    }

    const whereClause =
      conditions.length > 0 ? and(...conditions) : undefined;

    const items = await db.query.placementCells.findMany({
      where: whereClause,
      with: {
        coordinator: true,
        branch: true,
        academicYear: true,
      },
      limit,
      offset,
      orderBy: [desc(placementCells.createdAt)],
    });

    const [countResult] = await db
      .select({
        total: count(),
      })
      .from(placementCells)
      .where(whereClause);

    const total = countResult?.total ?? 0;

    return {
      items,
      pagination: {
        page,
        limit,
        totalCount: Number(total),
        totalPages: Math.ceil(Number(total) / limit),
      },
    };
  }

  async getById(id: string) {
    const record = await db.query.placementCells.findFirst({
      where: eq(placementCells.id, id),
      with: {
        coordinator: true,
        branch: true,
        academicYear: true,
      },
    });

    if (!record) {
      const error: any = new Error("Placement cell not found");
      error.statusCode = 404;
      throw error;
    }

    return record;
  }

  async update(id: string, data: UpdatePlacementCellInput) {
    const current = await this.getById(id);

    if (data.coordinatorId || data.branchId || data.academicYearId) {
      const coordinatorId =
        data.coordinatorId ?? current.coordinatorId;

      const branchId =
        data.branchId ?? current.branchId;

      const academicYearId =
        data.academicYearId ?? current.academicYearId;

      const conflict = await db.query.placementCells.findFirst({
        where: and(
          eq(placementCells.coordinatorId, coordinatorId),
          eq(placementCells.branchId, branchId),
          eq(placementCells.academicYearId, academicYearId),
          sql`${placementCells.id} != ${id}`,
        ),
      });

      if (conflict) {
        const error: any = new Error(
          "Another placement cell already exists for this coordinator, branch, and academic year",
        );
        error.statusCode = 409;
        throw error;
      }
    }

    const [updated] = await db
      .update(placementCells)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(placementCells.id, id))
      .returning();

    if (!updated) {
      const error: any = new Error(
        "Placement cell not found",
      );
      error.statusCode = 404;
      throw error;
    }

    return this.getById(updated.id);
  }

  async toggleStatus(id: string) {
    const current = await this.getById(id);

    const [updated] = await db
      .update(placementCells)
      .set({
        isActive: !current.isActive,
        updatedAt: new Date(),
      })
      .where(eq(placementCells.id, id))
      .returning();

    if (!updated) {
      const error: any = new Error(
        "Placement cell not found",
      );
      error.statusCode = 404;
      throw error;
    }

    return updated;
  }

  async delete(id: string) {
    await this.getById(id);

    await db
      .delete(placementCells)
      .where(eq(placementCells.id, id));

    return true;
  }
}

export const placementCellService = new PlacementCellService();