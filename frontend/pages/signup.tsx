import { Box, Button, Flex, FormControl, FormHelperText, FormLabel, Input, Link, Spacer } from "@chakra-ui/react";
import { useState } from "react";
import { signUp } from "../lib/account";

type ErrType = {
    firstName?: string[]
    lastName?: string[]
    email?: string[]
    username?: string[]
    password?: string[]
    general?: string
}

export default function SignUp() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [error, setError] = useState({} as ErrType)

    return (<Flex justifyContent={"center"} alignItems={"center"} height={"100vh"}>
        <Box maxWidth={800}>
            <FormControl>
                <Box mb={4} color={"red"}>{error.general}</Box>

                <FormLabel mt={2}>First Name</FormLabel>
                <Input type={"text"} value={firstName} onChange={e => setFirstName(e.target.value)}/>
                {   error.firstName
                    ? <FormHelperText color={"red"}>{error.firstName[0]}</FormHelperText>
                    : ''
                }

                <FormLabel mt={2}>Last Name</FormLabel>
                <Input type={"text"} value={lastName} onChange={e => setLastName(e.target.value)}/>
                {   error.lastName
                    ? <FormHelperText color={"red"}>{error.lastName[0]}</FormHelperText>
                    : ''
                }

                <FormLabel>Email</FormLabel>
                <Input type={"text"} value={email} onChange={e => setEmail(e.target.value)}/>
                {   error.email
                    ? <FormHelperText color={"red"}>{error.email[0]}</FormHelperText>
                    : ''
                }

                <FormLabel mt={2}>Username</FormLabel>
                <Input type={"text"} value={username} onChange={e => setUsername(e.target.value)}/>
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

                <FormLabel mt={2}>Repeat password</FormLabel>
                <Input type='password' value={repeatPassword} onChange={e => setRepeatPassword(e.target.value)}/>
                {   repeatPassword != password
                    ? <FormHelperText color={"red"}>Passwords are not equal</FormHelperText>
                    : ''
                }

                <Flex>
                    <Button 
                        onClick={e => {
                            signUp(firstName, lastName, email, username, password).then(err => setError(err))
                        }} 
                        isDisabled={
                            repeatPassword != password ||
                            firstName.length < 2 ||
                            lastName.length < 2 ||
                            email.length < 5 ||
                            username.length < 10
                        }
                        mt={2}
                    >Sign up</Button>
                    <Spacer/>
                    <Button mt={2} variant='link'>
                        <Link href={"/signin"}>Sign in</Link>
                    </Button>
                </Flex>
            </FormControl>
        </Box>
    </Flex>)
}