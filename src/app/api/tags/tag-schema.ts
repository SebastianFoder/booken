export interface TagSchema extends ITag {
    _id: string;
}

export interface ITag {
    tag: string;
    primary_color: string;
    secondary_color: string;
}