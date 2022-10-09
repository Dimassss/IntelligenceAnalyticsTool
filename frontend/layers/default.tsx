import { Button, Flex, Grid, GridItem, IconButton, Spacer } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FaHome } from "react-icons/fa";
import { logout } from "../lib/account";

export function DefaultLayer({ children }) {
    const router = useRouter()

    return (<Flex direction={"column"}>
        <Flex
            style={{
                backgroundColor: '#fff',
                boxShadow: "0 1px 4px #aaa"
            }}
            p={1}
            mb={3}
        >
            <IconButton 
                icon={<FaHome/>}
                aria-label="Go home page"  
                rounded="0" 
                onClick={() => {
                    router.push('/')
                }}
                mr={1}
            />
            <Spacer/>
            <Button onClick={e => logout()}>
                Logout
            </Button>
        </Flex>
        <div>{children}</div>
    </Flex>)
}