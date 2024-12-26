import { useEffect, useRef, useState } from 'react';
import { Post, Reaction, PostReactionsCount } from '../../../interfaces';
import { SmileSVG } from '../../svg';

interface ReactionBoxProps {
    post: Post;
    toggleReaction: (reaction: Reaction) => void;
}

function ReactionBox({ post, toggleReaction }: ReactionBoxProps): JSX.Element {
    const [visible, setVisible] = useState<boolean>(false);
    const reactionBoxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (reactionBoxRef.current && !reactionBoxRef.current.contains(event.target as Node)) {
                setVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="post-page__post-meta-right" onClick={() => setVisible(!visible)}>
            <SmileSVG />
            <span>reaction</span>
            <div className={`post-page__reaction-box ${visible ? 'visible' : ''}`} ref={reactionBoxRef}>
                {post.reactions && post.reactions.map((reaction: PostReactionsCount) => (
                    <div className="post-page__add-reaction" key={reaction.reaction.ID}
                        onClick={() => toggleReaction(reaction.reaction)}
                    >
                        <span>{reaction.reaction.emoji}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ReactionBox;