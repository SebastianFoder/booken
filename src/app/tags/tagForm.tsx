'use client';

import * as chroma from 'chroma.ts';
import Tag from './tag';
import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { faPalette } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TagSchema } from '../api/tags/tag-schema';
import { mutate } from 'swr';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

interface ITagFormProps{
    tag?: TagSchema;
    submit: (tag: TagSchema) => Promise<boolean>;
}

async function submitTag({tag, submit}: ITagFormProps, {setDisabled, router}: {
setDisabled: Dispatch<SetStateAction<boolean>>,
router: AppRouterInstance
}) {
    if(!tag || tag.tag.length === 0){
        setDisabled(false);
        return false;
    } else{
        if(await submit(tag)){
            mutate(`${process.env.NEXT_PUBLIC_URL}/api/tags`);
            if(tag._id.length > 0){
                mutate(`${process.env.NEXT_PUBLIC_URL}/api/tags/${tag._id}`);
            }           
            router.push('/tags');
            setDisabled(false);
        }
    }
}

export default function TagForm(
    {tag, submit}: ITagFormProps
){
    const [ primary_color, setPrimary_color] = useState<chroma.Color>(chroma.color(tag?.primary_color || chroma.random()));    
    const [ secondary_color, setSecondary_color] = useState<chroma.Color>(chroma.color(tag?.secondary_color || chroma.random()));
    const [ tagStr, setTagStr ] = useState<string>(tag?.tag || '');
    const [ disabled, setDisabled ] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        if(primary_color.hsl()[2] > 0.9){
            setSecondary_color(primary_color.darker(4));
        }
        else if(primary_color.hsl()[2] < 0.15){
            setSecondary_color(primary_color.brighter(4));
        }
        else{
            setSecondary_color(primary_color.hsl()[2] > 0.5 ? primary_color.darker(2) : primary_color.brighter(2));
        }
    }, [primary_color]);   



    return(
        <form className="tag" method='POST'>
            <div className="form-group">
                <label htmlFor="tag">Tag</label>
                <input placeholder='tag name...' type="text" value={tagStr} onChange={(e) => setTagStr(
                    e.target.value.length > 15 ? tagStr : e.target.value
                )} name="tag" id="tag" />
            </div>
            <div className="form-group">
                <label htmlFor="farve">Farve</label>
                <div className="example-tag">
                    <div className="color-picker">
                        <input type="color" name="farve" id="farve" value={primary_color.hex()} onChange={(e) => setPrimary_color(chroma.color(e.target.value))} />
                        <div className="visualizer" style={{backgroundColor: primary_color.css(), borderColor: secondary_color.css()}}>
                            <FontAwesomeIcon icon={faPalette} style={{color: secondary_color.css()}} />
                        </div>
                    </div>
                    
                    <Tag tag={tagStr} primary_color={primary_color} secondary_color={secondary_color}/>
                </div>
            </div>
            <div className="form-group">
                <button onClick={async (e) => (
                    e.preventDefault(),
                    setDisabled(true),
                    await submitTag({
                        tag: {
                            _id: tag?._id || '',
                            tag: tagStr,
                            primary_color: primary_color.hex(),
                            secondary_color: secondary_color.hex()
                        },
                        submit
                    }, {setDisabled, router})
                    )} className="btn" type="submit" disabled={disabled}>Gem</button>
            </div>
        </form>   
    )
}