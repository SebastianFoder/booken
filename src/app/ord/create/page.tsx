import AuthPageGateway from "@/app/lib/authPageGateway";
import ClientSideOrd from "./clientSideOrd";
import { Metadata } from "next";

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
        <AuthPageGateway authLevel={1}>
            <main>
                <section>
                    <article>
                        <h1>Opret Ord</h1>
                    </article>
                    <article>
                        <ClientSideOrd />
                    </article>
                </section>
            </main>
        </AuthPageGateway>
    )
}