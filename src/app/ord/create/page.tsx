import OrdForm from "../ordform";
import { submitOrd } from "../submit-ord";

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