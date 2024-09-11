import axios from 'axios';
import { TagSchema } from '@/app/api/tags/tag-schema';
import TagForm from '../tagForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Booken | Create Tag',
    description: 'Create a new tag in the dictionary',
    openGraph: {
        title: 'Booken | Create Tag',
        description: 'Create a new tag in the dictionary',
    },
};

async function AddTag(tag: TagSchema) : Promise<boolean>{
    'use server';
    if(tag.tag.length > 0){
        const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/tags`, tag);
        return response.status === 200;
    }
    return false;    
}

export default function CreateTag(){ 
    return(
        <main>
            <section>
                <article>
                    <h1>Opret Tag</h1>
                    <TagForm submit={AddTag}/>
                </article>
            </section>
        </main>        
    )
}