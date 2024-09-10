import EditOrdPage from "./edit";

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
