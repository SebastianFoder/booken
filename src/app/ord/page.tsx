import OrdTable from './ordtable';
import axios from 'axios';
import { IOrdFinal } from '../api/ord/ord-schema';
import { TagSchema } from '../api/tags/tag-schema';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Booken | Ord',
    description: 'See all the ord in the dictionary',
    openGraph: {
        title: 'Booken | Ord',
        description: 'See all the ord in the dictionary',
    },
};

async function getOrd({ page = 1, limit = 50, ord = '', tags = [] }: { page?: number, limit?: number, ord?: string, tags?: string[] } = {}): Promise<{
    ord: IOrdFinal[];
    totalPages: number;
    totalCount: number;
}> {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/ord`, {
        params: {
            page,
            limit,
            ord,
            tags: tags.join(','),  // Convert array to comma-separated string
            _: new Date().getTime() // Cache busting
        }
    });

    return res.data;
}

async function getTags(): Promise<{
    tags: TagSchema[]
}>{
    const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/tags`, {
        params: {
            _: new Date().getTime() // Cache busting
        }
    });

    return res.data;
}

interface Props {
    searchParams?: { [key: string]: string | undefined };
}

export default async function OrdPage({ searchParams }: Props) {
    const page = parseInt(searchParams?.page || '1', 10);
    const limit = parseInt(searchParams?.limit || '50', 10);
    const ord = searchParams?.ord || '';
    const tags = searchParams?.tags ? searchParams.tags.split(',') : [];
    const tagsData = (await getTags()).tags;

    const fallback = await getOrd({ page, limit, ord, tags });

    return (
        <main>
            <section>
                <article>
                    <h1>Ord</h1>
                </article>
                <article>
                    <OrdTable 
                        page={page} 
                        limit={limit} 
                        ordSearch={ord} 
                        selectedTags={tags} 
                        tagsData={tagsData}
                        fallback={fallback} 
                    />
                </article>
            </section>
        </main>
    );
}