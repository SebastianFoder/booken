import axios from 'axios';
import { TagSchema } from '@/app/api/tags/tag-schema';
import TagForm from '../tagForm';

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