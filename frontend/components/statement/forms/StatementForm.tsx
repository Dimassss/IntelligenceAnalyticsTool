import { useEffect, useState } from 'react'
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
import { StatementType } from "../../../types/model/Statement"
import React from "react"
import clone from "../../../lib/clone"

type Props = {
    statement: StatementType,
    onSubmit: (el?: StatementType) => void,
    doSubmit?: boolean
}

function StatementForm({onSubmit, statement, doSubmit}: Props){
    /*
        doSubmit is boolean value;
        This value is needed to send signal from parent element to submit form.
        When this value is true, this element will use hook to automaticly call saveChanges function
        and as a result onSubmit event will be emited.
    */
    let [name, setName] = useState(statement ? statement.name : '')
    let [statementStr, setStatement] = useState(statement ? statement.statement : '')
    let [veracity, setVeracity] = useState(statement ? statement.veracity : 0)

    const saveChanges = () => {
        let st: StatementType = {
            ...clone(statement),
            name,
            statement: statementStr,
            veracity
        } as StatementType
        onSubmit(st)
    }

    useEffect(() => {
        if(doSubmit) {
            saveChanges()
        }
    }, [doSubmit])

    useEffect(() => {
        setName(statement.name ? statement.name : '')
        setStatement(statement.statement ? statement.statement : '')
        setVeracity(statement.veracity ? statement.veracity : 0)
    }, [statement])

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
                {doSubmit !== null ? ('') : (
                    <Button onClick={saveChanges} variant-color="green">Save Changes</Button>
                )}
            </Stack>
        </FormControl>
    </Flex>)
}

export default StatementForm