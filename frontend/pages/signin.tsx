import { Box, Button, Flex, FormControl, FormHelperText, FormLabel, Input } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { signIn } from "../lib/account";

export default function SignIn() {
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState({} as {username?: string[], password?: string[], general?: string})

    return (<Flex justifyContent={"center"} alignItems={"center"} height={"100vh"}>
        <Box maxWidth={800}>
            <FormControl>
                <FormLabel>Login</FormLabel>
                <Input type={"text"} value={login} onChange={e => setLogin(e.target.value)}/>
                {   error.username
                    ? <FormHelperText color={"red"}>{error.username[0]}</FormHelperText>
                    : ''
                }

                <FormLabel mt={2}>Password</FormLabel>
                <Input type='password' value={password} onChange={e => setPassword(e.target.value)}/>
                {   error.password
                    ? <FormHelperText color={"red"}>{error.password[0]}</FormHelperText>
                    : ''
                }

                <Button 
                    onClick={e => signIn(login, password).then(err => setError(err))} 
                    mt={2}
                >Sign in</Button>
                <Box mt={4} color={"red"}>{error.general}</Box>
            </FormControl>
        </Box>
    </Flex>)
}