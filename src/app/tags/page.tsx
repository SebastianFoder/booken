import { Suspense } from "react";
import TagsTable from "./tagsTable";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Booken | Tags',
    description: 'See all tags in the dictionary',
    openGraph: {
        title: 'Booken | Tags',
        description: 'See all tags in the dictionary',
    },
};

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
