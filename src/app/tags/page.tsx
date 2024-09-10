import { Suspense } from "react";
import TagsTable from "./tagsTable";

export default async function TagsPage() {
    return (
        <main>
            <section>
                <article>
                    <h1>Tags</h1>
                </article>
                <article>
                    <Suspense fallback={<h5>Loading...</h5>}>
                      <TagsTable />
                    </Suspense>
                </article>
            </section>
        </main>
    );
}
