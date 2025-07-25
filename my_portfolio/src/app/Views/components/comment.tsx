'use client';

import { useState } from 'react';
import Cookie from 'js-cookie';
import supabase from '@/app/supabaseClient';
import Cookies from 'js-cookie';

export default function CommentInput({ postId, onCommentAdded }: { postId: number, onCommentAdded: () => void }) {
    const [commentText, setCommentText] = useState('');

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();

            let iduser;

            if(!Cookies){
                iduser = 0;
            }else{
                iduser = Cookie.get("userId");
            }

            if (commentText.trim() === '') return;

            const { error } = await supabase
                .from('MsComment')
                .insert({
                    iduser,
                    idpost: postId,
                    desc: commentText.trim(),
                });

            if (!error) {
                setCommentText('');
                onCommentAdded();
            } else {
                console.error('Error adding comment:', error.message);
            }
        }
    };

    return (
        <textarea
            className="bg-gray-600 resize-none h-15 w-3/4 rounded mt-5 content-center pl-5 overflow-hidden"
            placeholder="Add Comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={handleKeyDown}
        />
    );
}