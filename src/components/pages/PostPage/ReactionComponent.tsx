import { Reaction } from '../../../interfaces';

interface ReactionComponentProps {
    reaction: Reaction;
    onToggleReaction: (reaction: Reaction) => void;
    reactionCounts: Map<string, number>;
    userReactions: Set<string>;
}

function ReactionComponent({
    reaction,
    onToggleReaction,
    reactionCounts,
    userReactions
}: ReactionComponentProps): JSX.Element {
    const _toggleReaction = (): void => {
        onToggleReaction(reaction);
    };

    return (
        <div className={`post-page__reaction-wrapper ${reactionCounts.get(reaction.emoji) && reactionCounts.get(reaction.emoji)! > 0 ? 'visible' : ''}`}>
            <div className={`post-page__reaction ${userReactions.has(reaction.emoji) ? 'selected' : ''}`} onClick={_toggleReaction}>
                <span>{reaction.emoji}</span>
                <span>{reactionCounts.get(reaction.emoji)}</span>
            </div>
        </div>
    );
}

export default ReactionComponent;