import { useSelector, useDispatch } from "react-redux"
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Input } from '@chakra-ui/react'
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
} from '@chakra-ui/react'
import {
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    SliderMark,
} from '@chakra-ui/react'
import { Button, ButtonGroup } from '@chakra-ui/react'

import { Statement } from "~~/types/model/Statement"
import { createStatement, getCurrentStatement, setCurrentStatement } from "../../store/statementSlice"


export default function CreateStatement(){
    const router = useRouter()
    let [name, setName] = useState('')
    let [statement, setStatement] = useState('')
    let [veracity, setVeracity] = useState(0)
     
    const dispatch = useDispatch()
    const curSt = useSelector(getCurrentStatement)
    
    dispatch(setCurrentStatement(null))

    const submitForm = async (e) => {
        e.preventDefault()
        let st: Statement = {
            name,
            statement,
            veracity
        }
        
        dispatch(createStatement(st) as any)
    }

    useEffect(() => {
        if(curSt){ 
            if(curSt.id) router.push(`/statement/view/${curSt.id}`)
            else console.log(curSt)
        }
    }, [curSt])


    return (<div>
        <FormControl>
            <FormLabel>Name</FormLabel>
            <Input value={name} onChange={e => setName(e.target.value)} />

            <FormLabel>Statement</FormLabel>
            <Input value={statement} onChange={e => setStatement(e.target.value)} />
            
            <FormLabel>Veracity</FormLabel>
            <Slider aria-label='veracity' defaultValue={veracity} onChange={setVeracity} min={0} max={100} step={1}>
                <SliderTrack>
                    <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
            </Slider>
            <Button colorScheme='blue' onClick={submitForm}>Create</Button>
        </FormControl>
    </div>)
}
