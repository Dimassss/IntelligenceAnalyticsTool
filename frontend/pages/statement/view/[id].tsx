import { useSelector, useDispatch } from "react-redux"
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
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
import {ChevronLeftIcon} from '@chakra-ui/icons'
import { timeToString } from '../../../lib/formating'
import { getCurrentStatement, loadStatement, saveStatement } from "../../../store/statementSlice"
import { Statement } from "~~/types/model/Statement"
import StatementForm from "../../../components/statement/forms/StatementForm"

function StatementView(){
    const router = useRouter()
    const dispatch = useDispatch()
    const { id } = router.query
    let [loaded, setLoaded] = useState(false)
    let curSt = useSelector(getCurrentStatement)

    const saveChanges = (st: Statement) => {
        if(!curSt || curSt.id != +id) return
        dispatch(saveStatement(st) as any)
    }

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
            {curSt ? (<Text ml='2' color="grey">{ timeToString(curSt.created_at) }</Text>) : '' }
        </Flex>

        {loaded ? (<StatementForm statement={curSt} onSubmit={saveChanges}/>) : (
            <Flex align="center" justify="center" h="300px" flexDirection="column">
                <CircularProgress m='2' isIndeterminate={true} />
                <Text m='2'>
                    Statement #{ id }
                </Text>
            </Flex>
        )}
    </Box>)
}

StatementView.getInitialProps = async (ctx) => {
    return {}
}

export default StatementView