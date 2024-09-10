import { Suspense } from "react";
import EditTag from "./edit";

export default function EditTagPage({ params }: { params: { id: string}}){
    return(
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
    )

}