'use client';

import { useState, useEffect, MouseEventHandler } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import Select from 'react-select';
import axios from 'axios';
import useSWR, { mutate } from 'swr';
import Tag from "../tags/tag";
import * as chroma from 'chroma.ts';
import { TagSchema } from "../api/tags/tag-schema";
import { IOrdFinal } from "../api/ord/ord-schema";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

async function handleSubmit(finalOrd: IOrdFinal, submit: (ord: IOrdFinal) => Promise<boolean>, router: AppRouterInstance){
    if (!finalOrd.ord || !finalOrd.definition || finalOrd.tags.length === 0) {
        return false;
    }
    if (await submit(finalOrd)) {
        mutate(`${process.env.NEXT_PUBLIC_URL}/api/ord`);
        if (finalOrd._id.length > 0) {
            mutate(`${process.env.NEXT_PUBLIC_URL}/api/ord/${finalOrd._id}`);
        }
        const referrer = document.referrer;
        const isFromOrd = referrer.includes('/ord');

        if (isFromOrd) {
            router.back();
        } else {
            // Fall back to /ord if not from the expected route
            router.push('/ord');
        }
        router.push('/ord');
    }
    return false;
};

// Fetcher function for useSWR
const fetcher = (url: string) => axios.get(url).then(res => res.data);

interface OrdFormProps {
    initialOrd?: IOrdFinal;
    submit: (ord: IOrdFinal) => Promise<boolean>;
}

export default function OrdForm({ initialOrd, submit }: OrdFormProps) {
    const [ord, setOrd] = useState<string>(initialOrd?.ord || '');
    const [definition, setDefinition] = useState<string>(initialOrd?.definition || '');
    const [selectedTags, setSelectedTags] = useState<Array<{ value: string; label: string; tag: string; primary_color: string; secondary_color: string }>>([]);
    const router = useRouter();
    // Use SWR to fetch tags
    const { data: tagsData, error, isLoading } = useSWR<{
        tags: TagSchema[]
    }>(`${process.env.NEXT_PUBLIC_URL}/api/tags`, fetcher, {
        revalidateOnFocus: false,
        revalidateOnMount: true,
        refreshWhenHidden: false,
        revalidateIfStale: false,
        refreshInterval: 0,
    });

    // Transform the fetched tags data into the format required by react-select
    const tagsOptions = tagsData?.tags.map((tag: TagSchema) => ({
        value: tag._id,
        label: tag.tag,
        tag: tag.tag,
        primary_color: tag.primary_color,
        secondary_color: tag.secondary_color,
    })) || [];

    // Pre-fill the tags if initialOrd is provided
    useEffect(() => {
        if (initialOrd && tagsData) {
            const initialTags = initialOrd.tags.map(tag => {
                const foundTag = tagsOptions.find((option: any) => option.value === tag._id);
                return foundTag ? foundTag : null;
            }).filter(Boolean) as Array<{ value: string; label: string; tag: string; primary_color: string; secondary_color: string }>;

            setSelectedTags(initialTags);
        }
    }, [initialOrd, tagsData]);

    const handleTagsChange = (selectedOptions: any) => {
        setSelectedTags(selectedOptions || []);
    };

    if (error) {
        return <div>Error loading tags...</div>;
    }

    if (isLoading) {
        return <div>Loading tags...</div>;
    }

    return (
        <form className="ord-form" method="POST">
            <div className="container">
                <div className="form-group">
                    <label htmlFor="ord">Ord</label>
                    <input
                        type="text"
                        name="ord"
                        id="ord"
                        value={ord}
                        onChange={(e) => setOrd(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="definition">Definition</label>
                    <ReactQuill
                        value={definition}
                        onChange={setDefinition}
                        theme="snow"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="tags">Tags</label>
                    <Select
                        isMulti
                        name="tags"
                        options={tagsOptions}
                        value={selectedTags}
                        onChange={handleTagsChange}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder="Search or select tags"
                        isLoading={!tagsData && !error} // Show loading state
                    />
                </div>
                <div className="form-group">
                    <label>Selected Tags:</label>
                    <div className="selected-tags">
                        {selectedTags.map((tag, index) => (
                            <Tag
                                key={index}
                                tag={tag.tag}
                                primary_color={chroma.color(tag.primary_color)}
                                secondary_color={chroma.color(tag.secondary_color)}
                            />
                        ))}
                    </div>
                </div>
                <div className="form-group">
                    <button className="btn" onClick={(e) => {
                        e.preventDefault(),
                        handleSubmit({
                            _id: initialOrd?._id || '',
                            ord,
                            definition,
                            tags: selectedTags.map(tag => ({ _id: tag.value, tag: tag.tag, primary_color: tag.primary_color, secondary_color: tag.secondary_color }))
                        }, submit, router)}}>Gem</button>
                </div>
            </div>
        </form>
    );
}
