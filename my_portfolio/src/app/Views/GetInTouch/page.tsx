/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import '../../Styles/index.css';
import { useEffect, useState } from "react";
import supabase from '@/app/supabaseClient';
import Cookie from 'js-cookie';
import CommentInput from '../components/comment';
import Cookies from 'js-cookie';

export type MsUser = {
    iduser: number;
    username: string;
};

export type Comment = {
    idcomment: number;
    iduser: number;
    desc: string;
    idpost: number;
    msuser: MsUser;
};

export type Post = {
    idpost: number;
    titlepost: string;
    descpost: string;
    ispin: boolean;
    msuser: MsUser;
    mscomment: Comment[];
};

export default function Page() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [groupedComments, setGroupedComments] = useState<{ [idpost: number]: Comment[] }>({});
    const [expandedComments, setExpandedComments] = useState<{ [idpost: number]: boolean }>({});
    const [newTitle, setNewTitle] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [newContent, setNewContent] = useState("");
    const [showModalLogin, setShowModalLogin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const userId = Cookie.get("userId");
    const iduser = Number(userId) || 0;

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
            const { data: postsData, error } = await supabase
                .from('MsCommunity')
                .select(`
                    idpost, titlepost, descpost, ispin,
                    msuser(iduser, username),
                    MsComment(
                        idComment, iduser, desc, idpost,
                        msuser(iduser, username)
                    )
                `)
                .order('ispin', { ascending: false });

            if (error) {
                console.error('Fetch error:', error);
                return;
            }

            if (!postsData) return;

            const transformed: Post[] = postsData.map((row: any) => ({
                idpost: row.idpost,
                titlepost: row.titlepost,
                descpost: row.descpost,
                ispin: row.ispin,
                msuser: row.msuser ?? { iduser: 0, username: "Unknown" },
                mscomment: (row.MsComment ?? []).map((comment: any) => ({
                    idcomment: comment.idcomment,
                    iduser: comment.iduser,
                    desc: comment.desc,
                    idpost: comment.idpost,
                    msuser: comment.msuser ?? { iduser: 0, username: "Anonymous" },
                })),
            }));

            setPosts(transformed);

            const grouped = transformed.reduce((acc, post) => {
                acc[post.idpost] = post.mscomment ?? [];
                return acc;
            }, {} as { [idpost: number]: Comment[] });

            setGroupedComments(grouped);
        };

    const toggleExpand = (postId: number) => {
        setExpandedComments((prev) => ({
            ...prev,
            [postId]: !prev[postId],
        }));
    };

    const handleAddPost = async () => {
        if(!newTitle || !newContent) return;
        if(iduser == 0) return setShowModalLogin(true);

        const {} = await supabase
            .from("MsCommunity")
            .insert([{
                titlepost: newTitle,
                descpost: newContent,
                ispin: 0,
                idUser: Number(userId),
            }])

        setShowModal(false);
        setNewTitle('');
        setNewContent('');
        fetchPosts();
    }

    const handleAddPostAnon = async () => {
        if(!newTitle || !newContent) return;

        const {} = await supabase
            .from("MsCommunity")
            .insert([{
                titlepost: newTitle,
                descpost: newContent,
                ispin: 0,
                idUser: 0,
            }])
        
        setShowModalLogin(false);
        setShowModal(false);
        setNewTitle('');
        setNewContent('');
        fetchPosts();
    }

    function generateRandomDigits(base: string) {
        const match = base.match(/^anonymous(\d+)$/);
        if (match) return "";
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    useEffect(() => {
        const userId = Cookies.get('userId');
        setIsLoggedIn(!!userId);
    }, []);

    const handleLogout = () => {
        Cookies.remove('userId');
        setIsLoggedIn(false);
        window.location.reload();
    };


    return (
        <div className="p-4 w-2/3 m-auto mt-10">
            <div className="flex justify-between mb-4">
                <button onClick={() => setShowModal(true)} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">+ Add Post</button>
                {isLoggedIn ? (
                    <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">
                        Logout
                    </button>
                ) : (
                    <a href="/Views/Login" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
                        Login
                    </a>
            )}
            </div>
            <div className='containerCom'>
                {posts.map((post) => {
                const comments = groupedComments[post.idpost] || [];
                const isExpanded = expandedComments[post.idpost];

                return (
                    <div key={post.idpost} className="mb-6 border p-4 rounded">
                        <h2 className="text-xl font-bold">{post.titlepost}</h2>
                        <p className="text-white">{post.descpost}</p>
                        <p className="text-sm text-gray-500">
                            Posted by:{" "}
                            {post.msuser?.username?.startsWith("Anonymous")
                                ? `${post.msuser.username}@${generateRandomDigits(post.msuser.username)}`
                                : post.msuser?.username ?? "Unknown User"}
                        </p>

                        <h3 className="mt-4 font-semibold">Comments:</h3>
                        <ul className="ml-4 list-disc">
                            {(isExpanded ? comments : comments.slice(0, 1)).map((comment) => (
                                <li key={comment.idcomment}>
                                    <span className="font-medium">{comment.msuser?.username?.startsWith("Anonymous")? `${comment.msuser.username}@${generateRandomDigits(comment.msuser.username)}` : comment.msuser?.username ?? "Unknwon User"} :</span>{" "}
                                    {comment.desc}
                                </li>
                            ))}
                        </ul>

                        {comments.length > 1 && (
                            <button
                                onClick={() => toggleExpand(post.idpost)}
                                className="text-blue-500 text-sm mt-2 cursor-pointer"
                            >
                                {isExpanded ? '< -- Hide Comment -- >' : '< -- See All Comment -- >'}
                            </button>
                        )}
                        <br />
                        <CommentInput postId={post.idpost} onCommentAdded={() => fetchPosts()}></CommentInput>
                    </div>
                );
            })}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-gray-900/50 flex justify-center items-center modals">
                    <div className="bg-white/90 text-black rounded-lg p-6 w-96">
                        <h2 className="text-xl font-bold mb-4">Add New Post</h2>
                        <input
                            type="text"
                            placeholder="Post Title"
                            className="w-full mb-3 p-2 border rounded"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                        />
                        <textarea
                            placeholder="Post Content"
                            className="w-full p-2 border rounded resize-none"
                            rows={4}
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                        />
                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={() => setShowModal(false)} className="px-3 py-1 border rounded">Cancel</button>
                            <button onClick={handleAddPost} className="bg-blue-600 text-white px-3 py-1 rounded">Submit</button>
                        </div>
                    </div>
                </div>
            )}

            {showModalLogin && (
                <div className="fixed inset-1 bg-gray-900/99 flex justify-center items-center">
                    <div className='items-center'>
                        <h1 className='m-auto flex'>Looks like you are guest</h1><br />
                        <button onClick={handleAddPostAnon} className="bg-blue-600 text-white px-3 py-1 rounded">Stay Anonymous</button> &nbsp; OR &nbsp; <a href='/Views/Login' className='bg-blue-600 text-white px-3 py-1 rounded'>Login</a>
                    </div>
                </div>
            )}

        </div>
    );
}
