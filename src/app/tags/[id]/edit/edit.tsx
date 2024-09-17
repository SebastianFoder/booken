'use client'

import axios from "axios";
import useSWR, {mutate} from "swr";
import TagForm from "../../tagForm";
import { TagSchema } from "@/app/api/tags/tag-schema";

async function EditTagSubmit(tag: TagSchema) : Promise<boolean>{
    if(tag.tag.length > 0){

        const token = localStorage.getItem('token');
        if (!token) throw new Error('No auth token found');

        const response = await axios.patch(`${process.env.NEXT_PUBLIC_URL}/api/tags/${tag._id}`, tag,{
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.status === 200 || response.status === 201;
    }
    return false;    
}

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function EditTag({id} : {id: string}){
    const { data: tag, error, isLoading } = useSWR<TagSchema>(`${process.env.NEXT_PUBLIC_URL}/api/tags/${id}`, fetcher, {
        revalidateOnFocus: false,
        revalidateOnMount: true,
        refreshWhenHidden: false,
        revalidateIfStale: true,
        refreshInterval: 0,
    });

    if(error){
        console.error('Error fetching tag:', error);
        return <p>Error fetching tag.</p>;
    }

    if(isLoading){
        return <h5>Loading...</h5>;
    }

    

    return(
        <TagForm tag={tag} submit={EditTagSubmit} />
    )

}