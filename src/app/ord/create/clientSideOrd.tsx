"use client";

import { IOrdFinal } from "@/app/api/ord/ord-schema";
import axios from "axios";
import OrdForm from "../ordform";

export async function submitOrd(finalOrd: IOrdFinal): Promise<boolean> {
    try {

        const token = localStorage.getItem('token');
        if (!token) throw new Error('No auth token found');

        // Map the tags to only include their IDs
        const ordData = {
            ...finalOrd,
            tags: finalOrd.tags,
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
            return false;
        }
    } catch (error) {
        return false;
    }
}


export default function ClientSideOrd(){
    return <OrdForm submit={submitOrd} />

}
