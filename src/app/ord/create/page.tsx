import { IOrdFinal } from "@/app/api/ord/ord-schema";
import OrdForm from "../ordform";
import axios from "axios";
import { ObjectId } from "mongodb";

export async function submitOrd(finalOrd: IOrdFinal): Promise<boolean> {
    'use server';
    try {
        // Map the tags to only include their IDs
        const ordData = {
            ...finalOrd,
            tags: finalOrd.tags.map(tag => new ObjectId(tag._id)),
        };

        const response = await axios.post(`http://localhost:3000/api/ord`, ordData, {
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

export default function CreateOrd(){
    return(
        <main>
            <section>
                <article>
                    <h1>Opret Ord</h1>
                </article>
                <article>
                    <OrdForm submit={submitOrd} />
                </article>
            </section>
        </main>
    )
}