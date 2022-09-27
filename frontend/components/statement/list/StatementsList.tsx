import { Box, Flex, Heading } from "@chakra-ui/layout"
import { Progress } from "@chakra-ui/progress"
import { Text } from '@chakra-ui/react'
import Link from "next/link"
import { cutStatementText, timeToString } from "../../../lib/formating"
import { StatementType } from "../../../types/model/Statement"

type Props = {
    list: StatementType[]
}

export default function StatementsList({ list }: Props){
    return (<>
        {list.map((item: StatementType) => 
            (<Box key={item.id} border-width="1px" rounded="md" m='1' p='2' minW="250px" maxW="400px" flexGrow='1' boxShadow="1px 1px #eee">
                <Link href={`statement/view/${item.id}`}>
                <div>
                    <Heading size='md'>
                    { item.name }
                    </Heading>
                    <Progress value={item.veracity} size='sm'/>
                    <Flex color="grey" fontSize="xs">
                    { timeToString(item.created_at) }
                    </Flex>
                    <Text>{ cutStatementText(item.statement) } </Text>
                </div>
                </Link>
            </Box>)
        )}
    </>)
}