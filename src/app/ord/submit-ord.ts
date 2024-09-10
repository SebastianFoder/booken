import { ObjectId } from "mongodb";
import { IOrdFinal } from "../api/ord/ord-schema";
import axios from "axios";

export async function submitOrd(finalOrd: IOrdFinal): Promise<boolean> {
    "use server";
    try {
        // Map the tags to only include their IDs
        const ordData = {
            ...finalOrd,
            tags: finalOrd.tags.map(tag => new ObjectId(tag._id)),
        };

        const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/ord`, ordData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200 || response.status === 201) {
            return true;
        } else {
            console.error('Failed to create ord:', response);
            return false;
        }
    } catch (error) {
        console.error('Error creating ord:', error);
        return false;
    }
}