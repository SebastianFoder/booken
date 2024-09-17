import type { Metadata } from 'next';
import ClientSideTag from './clientSideTag';
import AuthPageGateway from '@/app/lib/authPageGateway';

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
        <AuthPageGateway authLevel={1}>
            <ClientSideTag />
        </AuthPageGateway>
    )
}