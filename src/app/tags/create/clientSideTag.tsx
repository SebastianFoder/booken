'use client';

import { TagSchema } from "@/app/api/tags/tag-schema";
import TagForm from "../tagForm";
import axios from "axios";
import AuthPageGateway from "@/app/lib/authPageGateway";

async function AddTag(tag: TagSchema) : Promise<boolean>{
    if(tag.tag.length > 0){

        const token = localStorage.getItem('token');
        if (!token) throw new Error('No auth token found');

        const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/tags`, tag, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.status === 200;
    }
    return false;    
}


export default function ClientSideTag(){
    return(
        <AuthPageGateway authLevel={1}>
            <main>
                <section>
                    <article>
                        <h1>Opret Tag</h1>
                        <TagForm submit={AddTag}/>

                    </article>
                </section>
            </main>     
        </AuthPageGateway>   
    )
}