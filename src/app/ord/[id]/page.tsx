import { IOrdFinal } from "@/app/api/ord/ord-schema";
import axios from "axios";
import 'react-quill/dist/quill.snow.css';
import DOMPurify from "isomorphic-dompurify";
import Tag from "@/app/tags/tag";
import * as chroma from "chroma.ts";
import ReadButton from "./reader";
import type { Metadata } from 'next';

// Create a dynamic metadata function
export async function generateMetadata({ params }: { params: { id: number } }): Promise<Metadata> {
    const ord = await getOrd(params.id);
    const sanitizedHTML = DOMPurify.sanitize(ord.definition);
    const plainText = sanitizedHTML
        .replace(/<[^\/][^>]*>/g, '')
        .replace(/<\/[^>]+>/g, '. ');


    // You can dynamically set the metadata based on the fetched data
    return {
        title: `Booken | ${ord.ord}`,
        description: plainText.substring(0, 150), // Shorten the definition for description
        openGraph: {
            title: `Booken | ${ord.ord}`,
            description: plainText.substring(0, 150),
        },
    };
}


async function getOrd(id: number): Promise<IOrdFinal> {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/ord/${id}`);

    return res.data;
}

export default async function OrdetPage({ params } : { params: { id: number } }) {
    const ord = await getOrd(params.id);
    const sanitizedHTML = DOMPurify.sanitize(ord.definition);

    const plainText = sanitizedHTML
        .replace(/<[^\/][^>]*>/g, '')    // Remove start tags
        .replace(/<\/[^>]+>/g, '. ');   // Replace closing tags with ". "
    return(
        <main>
            <section className="ord-show">
                <article className="ord-info">
                    <h1>{ord.ord}</h1>
                    <div className="ord-tags">
                        {ord.tags.map(tag => (
                            <Tag key={tag._id} tag={tag.tag} primary_color={chroma.color(tag.primary_color)} secondary_color={chroma.color(tag.secondary_color)} />
                        ))}
                    </div>
                </article>
                <article className="ord-definition">
                    <ReadButton text={plainText}/>
                    <div className="ql-editor" dangerouslySetInnerHTML={{ __html: sanitizedHTML}} />
                </article>
            </section>
        </main>
    )
}