import type { Metadata } from 'next';
import ClientSideTag from './clientSideTag';

export const metadata: Metadata = {
    title: 'Booken | Create Tag',
    description: 'Create a new tag in the dictionary',
    openGraph: {
        title: 'Booken | Create Tag',
        description: 'Create a new tag in the dictionary',
    },
};

export default function CreateTag(){ 
    return(
        <ClientSideTag />
    )
}