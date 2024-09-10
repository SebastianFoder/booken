'use client';

import axios from 'axios';
import { IOrdFinal } from "@/app/api/ord/ord-schema";
import OrdForm from "../../ordform";
import useSWR from "swr";

const fetcher = (url: string) => axios.get(url).then(res => res.data);


const handleSubmit = async (finalOrd: IOrdFinal) => {
    try {
        const patchData = {
            ord: finalOrd.ord,
            definition: finalOrd.definition,
            tags: finalOrd.tags.map(tag => tag._id),
        }
        const response = await axios.patch(`http://localhost:3000/api/ord/${finalOrd._id}`, patchData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.status === 200 || response.status === 201;
    } catch (error) {
        return false;
    }
};

export default function EditOrdPage({ id }: { id: string }){
    const { data: ord, error, isLoading } = useSWR<IOrdFinal>(`/api/ord/${id}`, fetcher, {
        revalidateOnFocus: false,
        revalidateOnMount: true,
        refreshWhenHidden: false,
        revalidateIfStale: false,
        refreshInterval: 0,
    });

    if(error){
        console.error('Error fetching ord:', error);
        return <p>Error fetching ord.</p>;
    }

    if(isLoading){
        return <h5>Loading...</h5>;
    }    

    return(
        <OrdForm submit={handleSubmit} initialOrd={ord} />
    )
}