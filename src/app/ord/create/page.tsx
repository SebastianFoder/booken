import AuthPageGateway from "@/app/lib/authPageGateway";
import OrdForm from "../ordform";
import type { Metadata } from 'next';
import { IOrdFinal } from "@/app/api/ord/ord-schema";
import { ObjectId } from "mongodb";
import axios from "axios";

export const metadata: Metadata = {
    title: 'Booken | Create Ord',
    description: 'Create a new ord in the dictionary',
    openGraph: {
        title: 'Booken | Create Ord',
        description: 'Create a new ord in the dictionary',
    },
};

export async function submitOrd(finalOrd: IOrdFinal): Promise<boolean> {
    "use server";
    try {

        const token = localStorage.getItem('token');
        if (!token) throw new Error('No auth token found');

        // Map the tags to only include their IDs
        const ordData = {
            ...finalOrd,
            tags: finalOrd.tags.map(tag => new ObjectId(tag._id)),
        };

        const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/ord`, ordData, {
            headers: {
                'Authorization': `Bearer ${token}`,
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
        <AuthPageGateway authLevel={1}>
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
        </AuthPageGateway>
    )
}