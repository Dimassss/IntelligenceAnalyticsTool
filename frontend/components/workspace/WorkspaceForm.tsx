import { Flex, FormControl, Input, Stack, Textarea } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { WorkspaceType } from "../../store/workspaceSlice"

type Props = {
    workspace: WorkspaceType,
    onSubmit: (w: WorkspaceType) => void,
    doSubmit: boolean
}

export default function WorkspaceForm({workspace: w, onSubmit, doSubmit}: Props) {
    const [title, setTitle] = useState(w.title)
    const [description, setDescription] = useState(w.description)

    useEffect(() => {
        if(doSubmit) {
            console.log('fsadfas')
            onSubmit({...w, title, description})
        }
    }, [doSubmit])

    return (<Flex
        mt='2'
        p='2'
        direction={'column'}
    >
        <FormControl>
            <Stack>
                <Input placeholder="Title" size="md" value={title} onChange={e => setTitle(e.target.value)} id="title"/>
                <Textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} rows={2} cols={35}/>
            </Stack>
        </FormControl>
    </Flex>)
}