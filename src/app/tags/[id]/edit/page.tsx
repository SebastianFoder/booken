import { Suspense } from "react";
import EditTag from "./edit";
import type { Metadata } from 'next';
import AuthPageGateway from "@/app/lib/authPageGateway";

export const metadata: Metadata = {
    title: 'Booken | Edit Tag',
    description: 'Edit a tag in the dictionary',
    openGraph: {
        title: 'Booken | Edit Tag',
        description: 'Edit a tag in the dictionary',
    },
};


export default function EditTagPage({ params }: { params: { id: string}}){
    return(
        <AuthPageGateway authLevel={1}>
            <main>
                <section>
                    <article>
                        <h1>Edit Tag</h1>
                        <Suspense fallback={<h5>Loading...</h5>}>
                            <EditTag id={params.id}/>
                        </Suspense>
                    </article>
                </section>
            </main>
        </AuthPageGateway>
    )

}