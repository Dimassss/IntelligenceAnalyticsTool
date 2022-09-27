import { useSelector, useDispatch } from "react-redux"
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FaRegSave } from "react-icons/fa";
import { 
    IconButton, 
    Box, 
    Flex, 
    Text, 
    FormControl, 
    Stack, 
    Input, 
    FormLabel, 
    Slider, 
    SliderTrack, 
    SliderFilledTrack,
    SliderThumb,
    Textarea,
    Button,
    CircularProgress
} from '@chakra-ui/react'
import { Grid, GridItem } from '@chakra-ui/react'
import {ChevronLeftIcon} from '@chakra-ui/icons'
import { timeToString } from '../../../lib/formating'
import { getCurrentStatement, loadStatement, saveStatement } from "../../../store/statementSlice"
import { StatementType } from "../../../types/model/Statement"
import StatementForm from "../../../components/statement/forms/StatementForm"

function StatementView(){
    const router = useRouter()
    const dispatch = useDispatch()
    const { id } = router.query
    let [loaded, setLoaded] = useState(false)
    let curSt = useSelector(getCurrentStatement)

    const saveChanges = (st: StatementType) => {
        setDoSubmit(false)
        if(!curSt || curSt.id != +id) return
        dispatch(saveStatement(st) as any)
    }
    const [doSubmit, setDoSubmit] = useState(false)

    useEffect(() => {
        dispatch(loadStatement(+id) as any)
    }, [])

    useEffect(() => {
        if(curSt && +id == curSt.id) {
            setLoaded(true)
        }
    }, [curSt])

    return (<Box>
        <Flex align="center">
            <IconButton 
                icon={<ChevronLeftIcon/>}
                aria-label="Main page"  
                variant-color="green" 
                rounded="0" 
                roundedBottomRight='md'
                onClick={() => router.push('/')}
            />
            <IconButton 
                icon={<FaRegSave/>}
                aria-label="Main page"  
                variant-color="green" 
                rounded="0" 
                roundedBottomRight='md'
                onClick={() => setDoSubmit(true)}
            />
            {curSt ? (<Text ml='2' color="grey">{ timeToString(curSt.created_at) }</Text>) : '' }
        </Flex>

        <Grid templateColumns='repeat(4, 1fr)' gap={6}>
            <GridItem w='100%'>
                {loaded ? (<StatementForm statement={curSt} onSubmit={saveChanges} doSubmit={doSubmit}/>) : (
                    <Flex align="center" justify="center" h="300px" flexDirection="column">
                        <CircularProgress m='2' isIndeterminate={true} />
                        <Text m='2'>
                            Statement #{ id }
                        </Text>
                    </Flex>
                )}
            </GridItem>
            <GridItem w='100%'>
                <Flex flexDirection={"column"}>
                    <Input placeholder='Search statement' />
                </Flex>
            </GridItem>
        </Grid>
    </Box>)
}

StatementView.getInitialProps = async (ctx) => {
    return {}
}

export default StatementView