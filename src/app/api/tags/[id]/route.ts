import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { ITag, TagSchema } from "../tag-schema";
import HasAuth from "@/app/lib/hasAuth";

const apiKey = process.env.DB_API_KEY;
const endPoint = process.env.DB_END_POINT;
const dataSource = process.env.DB_SOURCE;
const database = process.env.DB_NAME;
const collection = "tags";

// GET
export async function GET(req: Request, { params }: { params: { id: string } }): Promise<NextResponse<TagSchema | { error: string }>> {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "ID parameter is missing" }, { status: 400 });
  }

  const requestData = {
    dataSource,
    database,
    collection,
    filter: { _id: { $oid: id } }  // Filter by ObjectId
  };

  try {
    const response = await axios.post(`${endPoint}/action/findOne`, requestData, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Request-Headers": "*",
        "api-key": apiKey,
      },
    });

    const data = response.data;

    if (data.document) {
      return NextResponse.json(data.document as TagSchema);
    } else {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

// PATCH
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse<TagSchema | { error: string }>> {
  const auth = HasAuth(req, 1);
  if (!auth.hasAuth) {
      return NextResponse.json({ error: "Unauthorized", success: false }, { status: 401 });
  }
  
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "ID parameter is missing" }, { status: 400 });
  }

  const body: ITag = await req.json();

  const requestData = {
    dataSource,
    database,
    collection,
    filter: { _id: { $oid: id } },
    update: {
      $set: {
        tag: body.tag,
        primary_color: body.primary_color,
        secondary_color: body.secondary_color,
      }
    }
  };

  try {
    const response = await axios.post(`${endPoint}/action/updateOne`, requestData, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Request-Headers": "*",
        "api-key": apiKey,
      },
    });

    if (response.data.modifiedCount > 0) {
      // Fetch the updated document to return it
      const updatedDocumentResponse = await axios.post(`${endPoint}/action/findOne`, { ...requestData, update: undefined }, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Request-Headers": "*",
          "api-key": apiKey,
        },
      });

      const updatedDocument = updatedDocumentResponse.data.document;

      return NextResponse.json(updatedDocument as TagSchema);
    } else {
      return NextResponse.json({ error: "Document not found or no changes made" }, { status: 404 });
    }

  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json({ error: "Failed to update document" }, { status: 500 });
  }
}


// DELETE
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse<{ success: boolean } | { error: string }>> {
  
  const auth = HasAuth(req, 1);
  if (!auth.hasAuth) {
      return NextResponse.json({ error: "Unauthorized", success: false }, { status: 401 });
  }
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "ID parameter is missing" }, { status: 400 });
  }

  const requestData = {
    dataSource,
    database,
    collection: 'tags', // Assuming you're deleting from 'tags' collection
    filter: { _id: { $oid: id } },  // Filter by ObjectId
  };

  try {
    // Delete the tag document from the 'tags' collection
    const deleteResponse = await axios.post(`${endPoint}/action/deleteOne`, requestData, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Request-Headers": "*",
        "api-key": apiKey,
      },
    });

    if (deleteResponse.data.deletedCount > 0) {
      // Now remove references to the deleted tag from the 'ord' table
      const updateOrdRequest = {
        dataSource,
        database,
        collection: 'ords', // The collection where 'tags' are referenced
        filter: { tags: id }, // Find documents that reference the deleted tag
        update: { $pull: { tags: id } }, // Remove the deleted tag from the 'tags' array
      };

      await axios.post(`${endPoint}/action/updateMany`, updateOrdRequest, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Request-Headers": "*",
          "api-key": apiKey,
        },
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Tag not found or could not be deleted" }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting tag or updating ord references:', error);
    return NextResponse.json({ error: "Failed to delete tag and update references" }, { status: 500 });
  }
}