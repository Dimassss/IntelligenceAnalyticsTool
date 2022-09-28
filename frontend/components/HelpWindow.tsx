import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
} from '@chakra-ui/react'
import { useEffect } from 'react'

export default function HelpWindow({toOpen, onClose}) {
    const { isOpen, onOpen, onClose: c } = useDisclosure()
    
    useEffect(() => {
        if(toOpen) {
            onOpen()
        }
    }, [toOpen])

    return (
        <Modal isOpen={isOpen} onClose={(...a) => {
            onClose(...a)
            c()
        }}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Help</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                asd fa sdf asd fa sdf a sdf as df as df asd f as df
            </ModalBody>

            <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={(...a) => {
                    onClose(...a)
                    c()
                }}>
                    Close
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    )
}