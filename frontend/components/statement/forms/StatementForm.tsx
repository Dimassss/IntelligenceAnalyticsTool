import { useState } from 'react'
import { 
    Flex,
    FormControl, 
    Stack, 
    Input, 
    FormLabel, 
    Slider, 
    SliderTrack, 
    SliderFilledTrack,
    SliderThumb,
    Textarea,
    Button
} from '@chakra-ui/react'
import { Statement } from "../../../types/model/Statement"
import React from "react"
import clone from "../../../lib/clone"

type Props = {
    statement: Statement,
    onSubmit: (el?: Statement) => void
}

function StatementForm({onSubmit, statement}: Props){
    let [name, setName] = useState(statement ? statement.name : '')
    let [statementStr, setStatement] = useState(statement ? statement.statement : '')
    let [veracity, setVeracity] = useState(statement ? statement.veracity : 0)

    const saveChanges = () => {
        let st: Statement = {
            ...clone(statement),
            name,
            statement: statementStr,
            veracity
        } as Statement
        onSubmit(st)
    }

    return (<Flex
        mt='2'
        p='2'
    >
        <FormControl>
            <Stack>
                <Input placeholder="Name of the statement" size="lg" value={name} onChange={e => setName(e.target.value)} id="name"/>
                <FormLabel>Veracity</FormLabel>
                <Slider value={veracity} onChange={setVeracity} min={0} max={100} step={1} id="veracity" colorScheme={'blue'}>
                    <SliderTrack>
                        <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                </Slider>
                <Textarea placeholder="Statement body" value={statementStr} onChange={e => setStatement(e.target.value)} rows={15} cols={70}/>
                <Button onClick={saveChanges} variant-color="green">Save Changes</Button> 
            </Stack>
        </FormControl>
    </Flex>)
}

export default StatementForm