import { IOrdFinal } from "@/app/api/ord/ord-schema";
import axios from "axios";
import 'react-quill/dist/quill.snow.css';
import DOMPurify from "isomorphic-dompurify";
import Tag from "@/app/tags/tag";
import * as chroma from "chroma.ts";
import { TagSchema } from "@/app/api/tags/tag-schema";
import ReadButton from "./reader";

async function getOrd(id: number): Promise<IOrdFinal> {
    const res = await axios.get(`http://localhost:3000/api/ord/${id}`, {
        params: {
            _: new Date().getTime() // Cache busting
        }
    });

    return res.data;
}

export default async function OrdetPage({ params } : { params: { id: number } }) {
    const ord = await getOrd(params.id);
    const sanitizedHTML = DOMPurify.sanitize(ord.definition);

    const plainText = sanitizedHTML
        .replace(/<[^\/][^>]*>/g, '')    // Remove start tags
        .replace(/<\/[^>]+>/g, '. ');   // Replace closing tags with ". "
    console.log(plainText);
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