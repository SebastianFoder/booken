'use client';

import useSWR from 'swr';
import axios from 'axios';
import { TagSchema } from "../api/tags/tag-schema";
import Link from "next/link";
import Tag from "./tag";
import { faPlus, faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import * as chroma from "chroma.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from 'react';
import AuthGateway from '../lib/authGateway';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function TagsTable() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [dontShowAgain, setDontShowAgain] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [tagToDelete, setTagToDelete] = useState<string | null>(null);

    useEffect(() => {
        const savedDontShowAgain = localStorage.getItem('dontShowDeletePrompt');
        setDontShowAgain(savedDontShowAgain === 'true');
    }, []);

    // Fetch tags with pagination
    const { data, error, isLoading, mutate } = useSWR<{
        tags: TagSchema[];
        totalPages: number;
        totalCount: number;
    }>(`/api/tags?page=${page}&limit=${limit}`, fetcher,{
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        refreshInterval: 0,
        revalidateIfStale: true
    });

    const { totalPages, tags, totalCount } = data || { totalPages: 0, tags: [], totalCount: 0 };

    const confirmDelete = (tagId: string) => {
        if (dontShowAgain) {
            deleteTag(tagId);
        } else {
            setTagToDelete(tagId);
            setShowModal(true);
        }
    };

    const deleteTag = async (tagId: string) => {
        try {
            await axios.delete(`/api/tags/${tagId}`);
            mutate();
        } catch (error) {
            console.error('Failed to delete the tag:', error);
        } finally {
            setShowModal(false);
            setTagToDelete(null);
        }
    };

    const handleDeleteConfirm = () => {
        if (tagToDelete) {
            deleteTag(tagToDelete);
        }
    };

    const handleDontShowAgainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setDontShowAgain(checked);
        localStorage.setItem('dontShowDeletePrompt', checked.toString());
    };

    if (error) {
        console.error('Error fetching tags:', error);
        return <p>Error fetching tags.</p>;
    }

    if (isLoading) {
        return <h5>Loading...</h5>;
    }

    return (
        <>
            <table className='tag-table' border={1} rules="rows">
                <thead>
                    <tr>
                        <th>Tag</th>
                        <th>Farve</th>
                        <AuthGateway authLevel={1}>
                            <th>
                                <Link href="/tags/create">
                                    <FontAwesomeIcon icon={faPlus} /> Opret
                                </Link>
                            </th>
                        </AuthGateway>
                    </tr>
                </thead>
                <tbody>
                    {tags.length > 0 ? (
                        tags.map((tag) => (
                            <tr key={tag._id}>
                                <td>{tag.tag}</td>
                                <td>
                                    <Tag tag="" primary_color={chroma.color(tag.primary_color)} secondary_color={chroma.color(tag.secondary_color)} />
                                </td>
                                <AuthGateway authLevel={1}>
                                    <td>
                                        <div className="tag-operations">
                                            <Link href={`/tags/${tag._id}/edit`}>
                                                <FontAwesomeIcon icon={faPenToSquare} />
                                            </Link>
                                            <button onClick={() => confirmDelete(tag._id)}>
                                                <FontAwesomeIcon icon={faTrashCan} />
                                            </button>
                                        </div>
                                    </td>
                                </AuthGateway>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3}>No tags available.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            
            {/* Pagination Controls */}
            <div className="page-control">                
                <div className="items">
                    <label htmlFor="itemsPerPage" style={{ marginRight: '10px' }}>Items per page:</label>
                    <select
                        id="itemsPerPage"
                        value={limit}
                        onChange={(e) => {
                            setLimit(parseInt(e.target.value, 10));
                            setPage(1); // Reset to the first page when limit changes
                        }}
                        style={{ marginRight: '20px' }}
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
                <div className="page-navigation">
                    <button 
                        onClick={() => setPage(prev => Math.max(prev - 1, 1))} 
                        disabled={page === 1}
                        style={{ marginRight: '10px' }}
                    >
                        Previous
                    </button>
                    <span>Page {page} of {totalPages}</span>
                    <button 
                        onClick={() => setPage(prev => (totalPages > prev ? prev + 1 : prev))} 
                        disabled={page === totalPages}
                        style={{ marginLeft: '10px' }}
                    >
                        Next
                    </button>
                </div>
                
            </div>

            {/* Delete Confirmation Modal */}
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
                            <button className='btn btn-green' onClick={handleDeleteConfirm}>Yes</button>
                            <button className='btn btn-red' onClick={() => setShowModal(false)}>No</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
