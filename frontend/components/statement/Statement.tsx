import { Box, Flex, Heading } from "@chakra-ui/layout"
import { Progress } from "@chakra-ui/progress"
import { Text } from '@chakra-ui/react'
import Link from "next/link"
import { cutStatementText, timeToString } from "../../lib/formating"
import { StatementType } from "../../types/model/Statement"

type Props = {
    statement: StatementType
}

export default function Statement({ statement: st }: Props){
    return (<Box key={st.id} border-width="1px" rounded="md" m='1' p='2' minW="250px" maxW="400px" flexGrow='1' boxShadow="1px 1px #eee">
                <Link href={`statement/view/${st.id}`}>
                <div>
                    <Heading size='md'>
                    { st.name }
                    </Heading>
                    <Progress value={st.veracity} size='sm'/>
                    <Flex color="grey" fontSize="xs">
                    { timeToString(st.created_at) }
                    </Flex>
                    <Text>{ cutStatementText(st.statement) } </Text>
                </div>
                </Link>
            </Box>)
}