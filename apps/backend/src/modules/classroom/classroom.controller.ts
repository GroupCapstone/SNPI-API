import type { NextFunction, Response } from 'express';

import { getAuthorizedBranchFilter } from '../../middleware/branch-access';
import { sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { ClassroomModel } from './classroom.model';

export class ClassroomController {
  public getClassrooms = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = request.user!;
      const branchId = request.query.branchId as string | undefined;

      const query: Record<string, unknown> = {
        isDeleted: false,
        status: 'active',
        ...getAuthorizedBranchFilter(user.branchAccess, branchId),
      };

      const classrooms = await ClassroomModel.find(query)
        .populate('branchId', 'branchCode branchNameEn')
        .sort({ code: 1 })
        .exec();

      sendSuccess(response, classrooms, 'Classrooms retrieved successfully');
    } catch (error) {
      next(error);
    }
  };
}
