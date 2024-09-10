import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { IOrd, IOrdFinal, OrdSchema } from "../ord-schema";

// Base configuration
const config = {
    apiKey: process.env.DB_API_KEY,
    endPoint: process.env.DB_END_POINT,
    dataSource: process.env.DB_SOURCE,
    database: process.env.DB_NAME,
    collection: "ords",
};

// Helper function to create a common request structure
const createRequestDataPipeline = (pipeline: any[]) => {
    return {
        dataSource: config.dataSource,
        database: config.database,
        collection: config.collection,
        pipeline,
    };
};

const createRequestData = (requestData?: any) => {
    return {
        dataSource: config.dataSource,
        database: config.database,
        collection: config.collection,
        ...requestData,
    };
};


// GET: Fetch a single Ord by ID, including associated tags
export async function GET(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse<IOrdFinal | { error: string }>> {
    const { id } = params;

    if (!id) {
        return NextResponse.json({ error: "ID parameter is missing" }, { status: 400 });
    }

    // Aggregation pipeline to fetch the ord with associated tags
    const pipeline = [
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
                }
            }
        },
        {
            $match: { _id: { $oid: id } } // Filter by ObjectId
        },
        {
            $lookup: {
                from: "tags",           // The tags collection
                localField: "tags",      // The field in ords that contains tag IDs
                foreignField: "_id",     // The field in tags that contains the tag ID
                as: "tags"               // The output field to store the joined tags
            }
        },
        {
            $project: {
                ord: 1,
                definition: 1,
                tags: 1,
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

        const data = response.data.documents[0];

        if (data) {
            // Return the fetched ord with tags populated
            return NextResponse.json(data as IOrdFinal);
        } else {
            return NextResponse.json({ error: "Document not found" }, { status: 404 });
        }

    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}

// PATCH: Update a specific Ord by ID
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse<OrdSchema | { error: string }>> {
    const { id } = params;

    if (!id) {
        return NextResponse.json({ error: "ID parameter is missing" }, { status: 400 });
    }

    const body: IOrd = await req.json();

    const requestData = createRequestData({
        filter: { _id: { $oid: id } },
        update: {
            $set: {
                ord: body.ord,
                definition: body.definition,
                tags: body.tags, // Update tags as an array of ObjectIds
            }
        }
    });

    try {
        const response = await axios.post(config.endPoint + "/action/updateOne", requestData, {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Request-Headers": "*",
                "api-key": config.apiKey,
            },
        });

        if (response.data.modifiedCount > 0) {
            // Fetch the updated document to return it
            const updatedDocumentResponse = await axios.post(config.endPoint + "/action/findOne", { ...requestData, update: undefined }, {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Request-Headers": "*",
                    "api-key": config.apiKey,
                },
            });

            const updatedDocument = updatedDocumentResponse.data.document;

            return NextResponse.json(updatedDocument as OrdSchema);
        } else {
            return NextResponse.json({ error: "Document not found or no changes made" }, { status: 404 });
        }

    } catch (error) {
        console.error('Error updating document:', error);
        return NextResponse.json({ error: "Failed to update document" }, { status: 500 });
    }
}

// DELETE: Remove a specific Ord by ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse<{ message: string } | { error: string }>> {
    const { id } = params;

    if (!id) {
        return NextResponse.json({ error: "ID parameter is missing" }, { status: 400 });
    }

    const requestData = createRequestData({
        filter: { _id: { $oid: id } },
    });

    try {
        const response = await axios.post(config.endPoint + "/action/deleteOne", requestData, {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Request-Headers": "*",
                "api-key": config.apiKey,
            },
        });

        if (response.data.deletedCount > 0) {
            return NextResponse.json({ message: "Document successfully deleted" });
        } else {
            return NextResponse.json({ error: "Document not found" }, { status: 404 });
        }

    } catch (error) {
        console.error('Error deleting document:', error);
        return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
    }
}