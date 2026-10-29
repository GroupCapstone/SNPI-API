import { model, Schema } from 'mongoose';

import type { IEmployeeSkill, IRoleSkillRequirement, ISkill } from './skill.types';

const skillSchema = new Schema<ISkill>(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      minlength: 2,
      maxlength: 50,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    category: {
      type: String,
      enum: [
        'pedagogy',
        'technical',
        'leadership',
        'administration',
        'communication',
        'language',
        'domain',
        'general',
      ],
      default: 'general',
      required: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

skillSchema.index({ code: 1, isDeleted: 1 }, { unique: true });
skillSchema.index({ name: 'text', description: 'text' });

export const SkillModel = model<ISkill>('Skill', skillSchema);

const roleSkillRequirementSchema = new Schema<IRoleSkillRequirement>(
  {
    roleId: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
      index: true,
    },
    skillId: {
      type: Schema.Types.ObjectId,
      ref: 'Skill',
      required: true,
      index: true,
    },
    requiredLevel: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: true,
    },
    isRequired: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

roleSkillRequirementSchema.index({ roleId: 1, skillId: 1, isDeleted: 1 }, { unique: true });

export const RoleSkillRequirementModel = model<IRoleSkillRequirement>(
  'RoleSkillRequirement',
  roleSkillRequirementSchema,
);

const employeeSkillSchema = new Schema<IEmployeeSkill>(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
      index: true,
    },
    skillId: {
      type: Schema.Types.ObjectId,
      ref: 'Skill',
      required: true,
      index: true,
    },
    proficiencyLevel: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: true,
    },
    yearsExperience: {
      type: Number,
      min: 0,
      max: 60,
      default: 0,
    },
    evidenceDocument: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    evidenceUrl: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    expiryDate: {
      type: Date,
      default: null,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'expired', 'rejected'],
      default: 'pending',
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

employeeSkillSchema.index({ employeeId: 1, skillId: 1, isDeleted: 1 }, { unique: true });

export const EmployeeSkillModel = model<IEmployeeSkill>('EmployeeSkill', employeeSkillSchema);
