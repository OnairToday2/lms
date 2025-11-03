export enum ClassRoomRuntimeStatus {
    All = "all",
    Ongoing = "ongoing",
    Today = "today",
    Upcoming = "upcoming",
    Past = "past",
    Draft = "draft",
}

export enum ClassRoomType {
    All = "all",
    Single = "single",
    Multiple = "multiple"
}

export enum ClassSessionMode {
    All = "all",
    Online = "online",
    Offline = "offline",
}

export enum ClassRoomStatus {
    All = "all",
    Daft = "draft",
    Publish = "publish",
    Active = "active",
    Pending = "pending",
    Deactive = "deactive",
    Deleted = "deleted",
};

export interface ClassRoomFilters {
    type: ClassRoomType;
    sessionMode: ClassSessionMode;
    search: string;
    startDate?: string | null;
    endDate?: string | null;
    runtimeStatus: ClassRoomRuntimeStatus;
    status: ClassRoomStatus;
}
