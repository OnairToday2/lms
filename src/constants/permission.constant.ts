export enum ERolesFunctions {
  CREATE_TASK = "CREATE_TASK",
  VIEW_TASK = "VIEW_TASK",
}

export type TRoleCondition = (ERolesFunctions | { $or: TRoleCondition })[];
