import { TagSchema } from "../tags/tag-schema";

export interface OrdSchema extends IOrd {
    _id: string;
}

export interface IOrd {
    ord: string;
    definition: string;
    tags: Array<TagSchema['_id']>;
}

export interface IOrdFinal {
    _id: string;
    ord: string;
    definition: string;
    tags: Array<TagSchema>;
}