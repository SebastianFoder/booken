import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { ITag, TagSchema } from "./tag-schema";

// Base configuration
const config = {
  apiKey: process.env.DB_API_KEY,
  endPoint: process.env.DB_END_POINT,
  dataSource: process.env.DB_SOURCE,
  database: process.env.DB_NAME,
  collection: "tags",
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

const createRequestDataPipeline = (pipeline: any[]) => {
  return {
      dataSource: config.dataSource,
      database: config.database,
      collection: config.collection,
      pipeline,
  };
}

// GET all Tags with pagination
export async function GET(req: NextRequest): Promise<NextResponse<{ tags: TagSchema[], totalPages: number, totalCount: number }>> {
  const url = new URL(req.url);
  const dataPipeline = [];
  const limit = parseInt(url.searchParams.get("limit") || "-1", 10);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const skip = (page - 1) * limit;
  
  dataPipeline.push({$sort: { insensitive: 1 }})
  if(limit >= 0) {
    dataPipeline.push({ $skip: skip });
    dataPipeline.push({ $limit: limit });
  }
  // Aggregation pipeline
  const pipeline = [
      { 
        $project: {
            tag: 1,
            primary_color: 1,
            secondary_color: 1,
            insensitive: { "$toLower": "$tag" }
        }
    },
      {
          $facet: {
              metadata: [
                  { $count: "totalCount" }
              ],
              data: dataPipeline
          }
      },
      {
          $project: {
              totalCount: { $arrayElemAt: ["$metadata.totalCount", 0] },
              tags: "$data"
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
          tags: TagSchema[];
          totalCount: number;
      };

      const totalCount = data.totalCount || 0;
      const totalPages = Math.ceil(data.totalCount / limit);

      return NextResponse.json({
          tags: data.tags,
          totalPages,
          totalCount
      });

  } catch (error) {
      return NextResponse.json({ tags: [], totalPages: 0, totalCount: 0 });
  }
}

// POST (create) a new Tag
export async function POST(req: NextRequest): Promise<NextResponse<{ success: boolean, insertedId?: string, error?: string }>> {
  try {
      // Extract data from the request body
      const body: ITag = await req.json();

      // Create request data using the helper function
      const requestData = createRequestData(
        {
          document: {
            tag: body.tag,
            primary_color: body.primary_color,
            secondary_color: body.secondary_color,
          }
        }
      );

      // Send the request to insert the new document
      const response = await axios.post(config.endPoint + "/action/insertOne", requestData, {
          headers: {
              "Content-Type": "application/json",
              "Access-Control-Request-Headers": "*",
              "api-key": config.apiKey,
          },
      });

      const data = response.data;

      // Log the inserted document ID and return a success response
      console.log('Inserted Document ID:', data.insertedId);
      return NextResponse.json({ success: true, insertedId: data.insertedId });

  } catch (error) {
      console.error(error);

      // Return an error response
      return NextResponse.json({ error: "Failed to insert data", success: false }, { status: 500 });
  }
}
