import OrdForm from "../ordform";
import { submitOrd } from "../submit-ord";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Booken | Create Ord',
    description: 'Create a new ord in the dictionary',
    openGraph: {
        title: 'Booken | Create Ord',
        description: 'Create a new ord in the dictionary',
    },
};

export default function CreateOrd(){
    return(
        <main>
            <section>
                <article>
                    <h1>Opret Ord</h1>
                </article>
                <article>
                    <OrdForm submit={submitOrd} />
                </article>
            </section>
        </main>
    )
}