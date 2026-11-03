import { Types } from 'mongoose';

import type { IArchitectureEvaluation } from './architecture-assessment.model';
import { ArchitectureEvaluationModel } from './architecture-assessment.model';
import type {
  AssessmentCheckItem,
  EvaluationFilters,
} from './architecture-assessment.types';

export class ArchitectureAssessmentRepository {
  public async createEvaluation(
    data: Partial<IArchitectureEvaluation>,
  ): Promise<IArchitectureEvaluation> {
    return ArchitectureEvaluationModel.create(data);
  }

  public async findById(id: string): Promise<IArchitectureEvaluation | null> {
    if (Types.ObjectId.isValid(id)) {
      return ArchitectureEvaluationModel.findById(id).lean();
    }
    return null;
  }

  public async findWithFilters(
    filters: EvaluationFilters,
  ): Promise<{ data: IArchitectureEvaluation[]; total: number }> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};

    if (filters.targetName) {
      query.targetName = { $regex: filters.targetName, $options: 'i' };
    }
    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.tier) {
      query.tier = filters.tier;
    }

    const [data, total] = await Promise.all([
      ArchitectureEvaluationModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ArchitectureEvaluationModel.countDocuments(query),
    ]);

    return {
      data: data as unknown as IArchitectureEvaluation[],
      total,
    };
  }

  public async updateEvaluation(
    id: string,
    update: Partial<IArchitectureEvaluation>,
  ): Promise<IArchitectureEvaluation | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return ArchitectureEvaluationModel.findByIdAndUpdate(id, update, {
      new: true,
    }).lean();
  }

  public async updateCheckItem(
    id: string,
    checkId: string,
    update: Partial<AssessmentCheckItem>,
  ): Promise<IArchitectureEvaluation | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const updateFields: Record<string, unknown> = {};
    if (update.status !== undefined) {
      updateFields['items.$.status'] = update.status;
    }
    if (update.score !== undefined) {
      updateFields['items.$.score'] = update.score;
    }
    if (update.evidence !== undefined) {
      updateFields['items.$.evidence'] = update.evidence;
    }
    if (update.remediation !== undefined) {
      updateFields['items.$.remediation'] = update.remediation;
    }
    updateFields['items.$.verifiedAt'] = new Date().toISOString();

    return ArchitectureEvaluationModel.findOneAndUpdate(
      { _id: id, 'items.checkId': checkId },
      { $set: updateFields },
      { new: true },
    ).lean();
  }

  public async getLatestEvaluation(
    targetName = 'SNP-SMS-Monorepo',
  ): Promise<IArchitectureEvaluation | null> {
    return ArchitectureEvaluationModel.findOne({
      targetName,
      status: 'COMPLETED',
    })
      .sort({ createdAt: -1 })
      .lean();
  }
}
