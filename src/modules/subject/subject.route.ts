import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { SubjectController } from './subject.controller';
import { createSubjectSchema, querySubjectSchema, updateSubjectSchema } from './subject.validation';

const router = Router();
const controller = new SubjectController();

router.use(authenticate);
router.use(requireAuth);

router.get(
  '/',
  authorize(
    'subject.view.assigned_subject',
    'subject.view.own_branch',
    'subject.view.all_branches',
  ),
  validate(querySubjectSchema),
  controller.getSubjects,
);

router.get(
  '/:id',
  authorize(
    'subject.view.assigned_subject',
    'subject.view.own_branch',
    'subject.view.all_branches',
  ),
  controller.getSubjectById,
);

router.post(
  '/',
  authorize('subject.create.all_branches'),
  validate(createSubjectSchema),
  controller.createSubject,
);

router.patch(
  '/:id',
  authorize('subject.edit.all_branches'),
  validate(updateSubjectSchema),
  controller.updateSubject,
);

router.delete('/:id', authorize('subject.delete.all_branches'), controller.deleteSubject);

export const subjectRouter = router;
