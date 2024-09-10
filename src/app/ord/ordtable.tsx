'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { faPlus, faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { IOrdFinal } from "../api/ord/ord-schema";
import useSWR from "swr";
import Tag from "../tags/tag";
import * as chroma from "chroma.ts";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { TagSchema } from "../api/tags/tag-schema";
import Select from "react-select";

const fetcher = (url: string) => axios.get(url).then(res => res.data);

interface OrdTableProps {
    page: number;
    limit: number;
    ordSearch: string;
    selectedTags: string[];  // Updated to an array of strings
    tagsData: TagSchema[];
    fallback: {
        ord: IOrdFinal[];
        totalPages: number;
        totalCount: number;
    };
}

export default function OrdTable({ page, limit, ordSearch: initialOrdSearch, selectedTags: initialSelectedTags, fallback, tagsData}: OrdTableProps) {
    const router = useRouter();
    const ordSearchOG = initialOrdSearch || '';
    const selectedTagsOG = initialSelectedTags || [];
    const [ordSearch, setOrdSearch] = useState(initialOrdSearch || '');
    const [selectedTags, setSelectedTags] = useState(
        (initialSelectedTags || []).map(tag => ({ value: tag, label: tagsData.find(t => t._id === tag)?.tag || tag }))
    );
    const tags = useRef<{
        value: string;
        label: string
    }[]>(tagsData.map(tag => ({ value: tag._id, label: tag.tag }))).current;
    const [dontShowAgain, setDontShowAgain] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [ordToDelete, setOrdToDelete] = useState<string | null>(null);
    
    const { data, error, mutate } = useSWR<{
        ord: IOrdFinal[];
        totalPages: number;
        totalCount: number;
    }>(`http://localhost:3000/api/ord?page=${page}&limit=${limit}&ord=${ordSearchOG}&tags=${selectedTagsOG.join(',')}`, fetcher, {
        fallbackData: fallback,
        refreshInterval: 0,
        revalidateOnMount: true,
        revalidateIfStale: true,
        revalidateOnFocus: false,
    });

    useEffect(() => {
        const savedDontShowAgain = localStorage.getItem('dontShowDeletePrompt');
        setDontShowAgain(savedDontShowAgain === 'true');
    }, []);

    // Handle the delete operation
    const handleDeleteConfirm = async (ordId?: string) => {
        try {
            const response = await axios.delete(`http://localhost:3000/api/ord/${ordId || ordToDelete}`);
            if (response.status !== 200 && response.status !== 201) throw new Error('Failed to delete');
            mutate();            
            if(showModal) setShowModal(false);
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleOrdSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOrdSearch(event.target.value);
    };

    const applyFilters = (tags?: {
        value: string;
        label: string;
    }[]) => {
        const coolTags = tags || selectedTags;
        const selectedTagValues = coolTags.map(tag => tag.value);
        setSelectedTags(coolTags);
        router.push(`/ord?page=${page}&limit=${limit}&ord=${ordSearch}&tags=${selectedTagValues.join(',')}`);
    };

    const handleTagClick = (tagId: string) => {
        const tagOption = tags.find(tag => tag.value === tagId);
        console.log(tagOption);

        if (tagOption) {
            applyFilters(selectedTags.some(tag => tag.value === tagOption.value)
            ? selectedTags
            : [...selectedTags, tagOption]);
        }
    };


    const handleTagChange = (selectedOptions: any) => {
        applyFilters(selectedOptions);
    };

    // Handle the page change
    const handlePageChange = (newPage: number) => {
        const selectedTagValues = selectedTags.map(tag => tag.value);
        router.push(`/ord?page=${newPage}&limit=${limit}&ord=${ordSearch}&tags=${selectedTagValues.join(',')}`);
    };

    // Handle the limit change
    const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newLimit = parseInt(event.target.value, 10);
        const selectedTagValues = selectedTags.map(tag => tag.value);
        router.push(`/ord?page=${page}&limit=${newLimit}&ord=${ordSearch}&tags=${selectedTagValues.join(',')}`);
    };


    const handleDontShowAgainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setDontShowAgain(checked);
        localStorage.setItem('dontShowDeletePrompt', checked.toString());
    };

    const confirmDelete = (ordId: string) => {
        if (dontShowAgain) {
            handleDeleteConfirm(ordId);
        } else {
            setOrdToDelete(ordId);
            setShowModal(true);
        }
    };

    if (error) return <h5>Error...</h5>;

    return (
        <>
            <div className="ord-search">
                <input
                    type="text"
                    placeholder="Search ord..."
                    value={ordSearch}
                    onChange={handleOrdSearchChange}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            applyFilters();
                        }
                    }}
                />
                <Select
                    options={tags}
                    value={selectedTags}
                    onChange={handleTagChange}
                    isMulti
                    placeholder="Filter by tags"
                    isClearable
                    className="basic-multi-select"
                    classNamePrefix="select"
                    styles={{
                        container: (provided) => ({ ...provided, marginRight: '10px', width: '300px' }),
                    }}
                />
                <button onClick={() => applyFilters()} className="btn btn-orange">Filtrer</button>
            </div>
            <table border={1} rules="rows" className="ord-table">
                <thead>
                    <tr>
                        <th>Ord</th>
                        <th>Tags</th>
                        <th>
                            <Link href="/ord/create">
                                <FontAwesomeIcon icon={faPlus} /> Opret
                            </Link>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data?.ord.map((ord, index) => (
                        <tr key={index}>
                            <td>
                                <Link href={`/ord/${ord._id}`}>
                                    {ord.ord}
                                </Link>
                            </td>
                            <td>
                                {ord.tags.map((tag, tagIndex) => (
                                    <Tag
                                        onClick={() => handleTagClick(tag._id)}
                                        key={tagIndex}
                                        tag={tag.tag}
                                        primary_color={chroma.color(tag.primary_color)}
                                        secondary_color={chroma.color(tag.secondary_color)}
                                    />
                                ))}
                            </td>
                            <td>
                                <div className="tag-operations">
                                    <Link href={`/ord/${ord._id}/edit`}>
                                        <FontAwesomeIcon icon={faPenToSquare} />
                                    </Link>
                                    <button onClick={() => confirmDelete(ord._id)}>
                                        <FontAwesomeIcon icon={faTrashCan} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                <label htmlFor="limit-select" style={{ marginRight: '10px' }}>Items per page:</label>
                <select
                    id="limit-select"
                    value={limit}
                    onChange={handleLimitChange}
                    style={{ marginRight: '20px' }}
                >
                    {[10, 25, 50, 100].map(limitOption => (
                        <option key={limitOption} value={limitOption}>
                            {limitOption}
                        </option>
                    ))}
                </select>
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                    style={{ marginRight: '10px' }}
                >
                    Previous
                </button>
                <span>Page {page} of {data?.totalPages || 1}</span>
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= (data?.totalPages || 1)}
                    style={{ marginLeft: '10px' }}
                >
                    Next
                </button>
            </div>
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Confirm Delete</h2>
                        <p>Are you sure you want to delete this tag?</p>
                        <label>
                            <input 
                                type="checkbox" 
                                checked={dontShowAgain} 
                                onChange={handleDontShowAgainChange} 
                            />
                            Don&apos;t show this again
                        </label>
                        <div className="modal-actions">
                            <button className='btn btn-green' onClick={() => handleDeleteConfirm()}>Yes</button>
                            <button className='btn btn-red' onClick={() => setShowModal(false)}>No</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}