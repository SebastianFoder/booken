import EditOrdPage from "./edit";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Booken | Edit Ord',
    description: 'Edit a ord in the dictionary',
    openGraph: {
        title: 'Booken | Edit Ord',
        description: 'Edit a ord in the dictionary',
    },
};


export default function EditOrd({ params }: { params: { id: string}}) {
    console.log('id:', params.id);
    return (
        <main>
            <section>
                <article>
                    <h1>Edit Ord</h1>
                </article>
                <article>
                    <EditOrdPage id={params.id} />
                </article>
            </section>
        </main>
    );
}
