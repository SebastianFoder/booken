import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { IOrd, IOrdFinal, OrdSchema } from "./ord-schema";
import HasAuth from "@/app/lib/hasAuth";

// Base configuration
const config = {
    apiKey: process.env.DB_API_KEY,
    endPoint: process.env.DB_END_POINT,
    dataSource: process.env.DB_SOURCE,
    database: process.env.DB_NAME,
    collection: "ords",
};

// Function to create request data pipeline
const createRequestDataPipeline = (pipeline: any[]) => {
    return JSON.stringify({
        collection: 'ords',
        dataSource: config.dataSource,
        pipeline,
        database: config.database,
    });
};

// Helper function to create a common request structure
const createRequestData = (requestData?: any,pipeline?: any[]) => {
    return {
        dataSource: config.dataSource,
        database: config.database,
        collection: config.collection,
        ...requestData,
        pipeline,
    };
};

export async function GET(req: NextRequest): Promise<NextResponse<{ ord: IOrdFinal[], totalPages: number, totalCount: number }>> {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "50", 10);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const skip = (page - 1) * limit;

    // Extract search query and tags from query parameters
    const searchQuery = url.searchParams.get("ord")?.toLowerCase() || ""; // Case insensitive search
    const tagsParam = url.searchParams.get("tags");
    const searchTags = tagsParam ? tagsParam.split(',') : [];

    // Aggregation pipeline
    const pipeline = [
        // Convert tags from string to ObjectId
        {
            $project: {
                ord: 1,
                definition: 1,
                tags: {
                    $map: {
                        input: '$tags',
                        as: 'tag',
                        in: { $toObjectId: '$$tag' },
                    }
                },
                insensitive: { "$toLower": "$ord" },
            }
        },
        // Lookup to populate the tags field
        {
            $lookup: {
                from: "tags",
                localField: "tags",
                foreignField: "_id",
                as: "tags"
            }
        },
        // Optionally match documents by ord and/or tags
        {
            $match: {
                ...(searchQuery ? { insensitive: { $regex: searchQuery, $options: "i" } } : {}),
                ...(searchTags.length > 0 ? { "tags._id": { $all: searchTags.map(tag => ({ $oid: tag })) } } : {})
            }
        },
        // Sort alphabetically by the "ord" field
        { 
            $sort: { insensitive: 1 } // 1 for ascending order, -1 for descending order
        },
        // Pagination and metadata aggregation
        {
            $facet: {
                metadata: [
                    { $count: "totalCount" }
                ],
                data: [
                    { $skip: skip },
                    { $limit: limit }
                ]
            }
        },
        // Project the final result
        {
            $project: {
                totalCount: { $arrayElemAt: ["$metadata.totalCount", 0] },
                ord: "$data"
            }
        }
    ];

    const requestData = createRequestDataPipeline(pipeline);

    try {
        const response = await axios.post(config.endPoint + "/action/aggregate", requestData, {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Request-Headers": "*",
                "api-key": config.apiKey,
            },
        });

        const data = response.data.documents[0] as {
            ord: IOrdFinal[];
            totalCount: number;
        };

        const totalCount = data.totalCount || 0;
        const totalPages = Math.ceil(totalCount / limit);

        return NextResponse.json({
            ord: data.ord,
            totalPages,
            totalCount
        });

    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ ord: [], totalPages: 0, totalCount: 0 });
    }
}

// POST (create) a new Ord
export async function POST(req: NextRequest) {
    try {
        const auth = HasAuth(req, 1);
        if (!auth.hasAuth) {
            return NextResponse.json({ error: "Unauthorized", success: false }, { status: 401 });
        }
        const body = await req.json();
        const newOrd: IOrd = body;

        // Construct the request data for inserting a new Ord
        const requestData = createRequestData({
            document: {
                ord: newOrd.ord,
                definition: newOrd.definition,
                tags: newOrd.tags, // Tags should be an array of ObjectIds
            }
        });

        // Perform the insert operation
        const response = await axios.post(config.endPoint + "/action/insertOne", requestData, {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Request-Headers": "*",
                "api-key": config.apiKey,
            },
        });

        // Extract the inserted ID from the response
        const data = response.data as {
            insertedId: string;
        };

        // Return the newly created Ord with the inserted ID
        const createdOrd: OrdSchema = { ...newOrd, _id: data.insertedId };
        return NextResponse.json(createdOrd);

    } catch (error) {
        console.error('Error inserting data:', error);
        return NextResponse.json(null);
    }
}