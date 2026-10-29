# SNP-SMS Permission Model — Complete Reference

Permissions follow the standard `module.action.scope` format:

| Module         | Action   | Scope          | Code                             | Description                              |
| :------------- | :------- | :------------- | :------------------------------- | :--------------------------------------- |
| **School**     | `view`   | `all_branches` | `school.view.all_branches`       | View top-level school profile            |
| **School**     | `create` | `all_branches` | `school.create.all_branches`     | Create school organization profile       |
| **School**     | `edit`   | `all_branches` | `school.edit.all_branches`       | Modify school profile details            |
| **School**     | `delete` | `all_branches` | `school.delete.all_branches`     | Deactivate school organization           |
| **Branch**     | `view`   | `own_branch`   | `branch.view.own_branch`         | View user's assigned branch              |
| **Branch**     | `view`   | `all_branches` | `branch.view.all_branches`       | View all branches school-wide            |
| **Branch**     | `create` | `all_branches` | `branch.create.all_branches`     | Register new campus branch               |
| **Branch**     | `edit`   | `own_branch`   | `branch.edit.own_branch`         | Modify assigned branch profile           |
| **Branch**     | `edit`   | `all_branches` | `branch.edit.all_branches`       | Modify any branch profile                |
| **Branch**     | `delete` | `all_branches` | `branch.delete.all_branches`     | Close/deactivate branch                  |
| **Department** | `view`   | `own_branch`   | `department.view.own_branch`     | View departments in assigned branch      |
| **Department** | `view`   | `all_branches` | `department.view.all_branches`   | View departments across all branches     |
| **Department** | `create` | `own_branch`   | `department.create.own_branch`   | Add department in assigned branch        |
| **Department** | `create` | `all_branches` | `department.create.all_branches` | Add department in any branch             |
| **Department** | `edit`   | `own_branch`   | `department.edit.own_branch`     | Modify department in assigned branch     |
| **Department** | `edit`   | `all_branches` | `department.edit.all_branches`   | Modify department in any branch          |
| **Department** | `delete` | `own_branch`   | `department.delete.own_branch`   | Deactivate department in assigned branch |
| **Department** | `delete` | `all_branches` | `department.delete.all_branches` | Deactivate department in any branch      |
| **Position**   | `view`   | `own_branch`   | `position.view.own_branch`       | View positions in assigned branch        |
| **Position**   | `view`   | `all_branches` | `position.view.all_branches`     | View positions across all branches       |
| **Position**   | `create` | `own_branch`   | `position.create.own_branch`     | Create position in assigned branch       |
| **Position**   | `create` | `all_branches` | `position.create.all_branches`   | Create position in any branch            |
| **Position**   | `edit`   | `own_branch`   | `position.edit.own_branch`       | Modify position in assigned branch       |
| **Position**   | `edit`   | `all_branches` | `position.edit.all_branches`     | Modify position in any branch            |
| **Position**   | `delete` | `own_branch`   | `position.delete.own_branch`     | Deactivate position in assigned branch   |
| **Position**   | `delete` | `all_branches` | `position.delete.all_branches`   | Deactivate position in any branch        |
| **Program**    | `view`   | `own_branch`   | `program.view.own_branch`        | View programs in assigned branch         |
| **Program**    | `view`   | `all_branches` | `program.view.all_branches`      | View programs school-wide                |
| **Program**    | `create` | `all_branches` | `program.create.all_branches`    | Create school-wide program               |
| **Program**    | `edit`   | `all_branches` | `program.edit.all_branches`      | Update school-wide program               |
| **Program**    | `delete` | `all_branches` | `program.delete.all_branches`    | Archive program                          |
| **Level**      | `view`   | `own_branch`   | `level.view.own_branch`          | View program levels                      |
| **Level**      | `create` | `all_branches` | `level.create.all_branches`      | Create program level                     |
| **Level**      | `edit`   | `all_branches` | `level.edit.all_branches`        | Update level sequence and details        |
| **Level**      | `delete` | `all_branches` | `level.delete.all_branches`      | Archive level                            |
| **Subject**    | `view`   | `own_branch`   | `subject.view.own_branch`        | View subject catalog                     |
| **Subject**    | `create` | `all_branches` | `subject.create.all_branches`    | Create subject                           |
| **Subject**    | `edit`   | `all_branches` | `subject.edit.all_branches`      | Edit subject                             |
| **Subject**    | `delete` | `all_branches` | `subject.delete.all_branches`    | Archive subject                          |
| **Study Mode** | `view`   | `all_branches` | `study_mode.view.all_branches`   | View school-wide study modes             |
| **Study Mode** | `create` | `all_branches` | `study_mode.create.all_branches` | Create a study mode                      |
| **Study Mode** | `edit`   | `all_branches` | `study_mode.edit.all_branches`   | Edit a study mode                        |
| **Study Mode** | `delete` | `all_branches` | `study_mode.delete.all_branches` | Archive a study mode                     |
| **Class**      | `view`   | `own_branch`   | `class.view.own_branch`          | View classes in assigned branch          |
| **Class**      | `view`   | `all_branches` | `class.view.all_branches`        | View classes across all branches         |
| **Class**      | `create` | `own_branch`   | `class.create.own_branch`        | Schedule class in assigned branch        |
| **Class**      | `create` | `all_branches` | `class.create.all_branches`      | Schedule class in any branch             |
| **Class**      | `edit`   | `own_branch`   | `class.edit.own_branch`          | Update class in assigned branch          |
| **Class**      | `edit`   | `all_branches` | `class.edit.all_branches`        | Update class across all branches         |
| **Class**      | `delete` | `own_branch`   | `class.delete.own_branch`        | Cancel / archive class                   |
| **Audit**      | `view`   | `own_branch`   | `audit.view.own_branch`          | View branch audit logs                   |
| **Audit**      | `view`   | `all_branches` | `audit.view.all_branches`        | View school-wide audit logs              |

## RBAC route and attendance corrections (2026-09-07)

- Teachers may cancel pending leave requests only for their currently assigned classes and accessible branches. Approval and rejection continue to require branch-wide attendance edit permission. The review endpoint is covered with signed JWT tests; the test-only default administrator is explicitly disabled in those requests.
- Attendance saving uses the authenticated user's school and the selected authorized class's branch and academic year. Teachers obtain filter labels from class data; administrative branch and academic-year lookups are disabled without the corresponding view permission. Missing class context disables saving. The shared academic context also skips unauthorized year and period lookups.
- Department heads can open Employees and Departments with their department-scoped view permissions. Backend department isolation still applies; employee creation and editing still require branch-level permissions. Other administrative navigation does not infer department access.
- `/academic-periods/rollover` accepts branch or all-branch rollover view permissions, independently of academic-period setup access.
- Regression coverage checks every visible navigation link for all 13 canonical roles, teacher attendance payloads with populated and plain references, and leave cancellation boundaries.

These changes do not synchronize persisted roles or remove the existing test-environment authentication fallback. The new leave security tests explicitly avoid that fallback. Deployment of canonical role changes still requires the existing role synchronization process.

Academic rules and historical corrections use dedicated canonical permissions. Academic officers manage rules in their branch and request corrections; directors have institution-wide view, management, review, and apply permissions. Historical correction routes therefore cannot be reached through unrelated program or class permissions.
