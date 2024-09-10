import * as chroma from 'chroma.ts';

export interface TagProps {
    tag: string;
    primary_color: chroma.Color;
    secondary_color: chroma.Color;
    onClick?: () => void;
}

export default function Tag({ tag, primary_color, secondary_color, onClick }: TagProps) {
    return (
        <div onClick={onClick} className={`tag ${onClick ? 'cursor-pointer' : ''}`} style={{ backgroundColor: primary_color.css(), borderColor: secondary_color.css()}}>
            <span style={{color: secondary_color.css()}}>{tag}</span>
        </div>
    )

}